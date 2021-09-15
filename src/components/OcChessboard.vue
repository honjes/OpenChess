<template>
  <div class="oc-chessboard blue merida">
    <div ref="board" :style="{ width: gameWidth, height: gameWidth }" class="cg-board-wrap"></div>
  </div>
</template>

<script lang="ts">
import { Chess } from "chess.js"
import { Chessground } from "chessground"
import { uniques } from "../util/chessboard"
import { getGameSubscription } from "../util/parse"
import _ from "lodash"
import { ref } from "vue"

export default {
  name: "chessboard",
  setup(props) {
    return {
      windowWith: ref(0),
      gameWidth: ref("700px"),
      game: new Chess(),
      fen: ref(props.fen),
      pgn: ref(props.pgn),
      board: null,
      promotions: [],
      promoteTo: "q",
      color: ref(props.color),
      gameId: ref(props.gameId),
      finished: ref(false),
    }
  },
  async mounted() {
    this.loadPosition()

    const windowWithListener = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "refreshWindowSize") {
        this.setGameWidth()
      }
    })
    this.setGameWidth()

    // Setup Subscription to update game on move
    this.subscription = await getGameSubscription(this.gameId)
    if (!_.isUndefined(this.subscription) && this.subscription !== false)
      this.subscription.on("update", this.gameUpdateHandler)

    // emit init event
    this.$emit("onInitalise", this.game)

    return {
      windowWithListener,
    }
  },
  onBeforeUnmount() {
    this.subscription.unsubscribe()
  },
  methods: {
    setGameWidth() {
      const gameBorder = 50
      this.windowWith = window.innerWidth

      if (_.isUndefined(this) || this.windowWith > 700 + gameBorder) this.gameWidth = "700px"
      else this.gameWidth = `${this.windowWith - gameBorder}px`
    },
    /* Chess functions */
    possibleMoves() {
      const dests = new Map()
      this.game.SQUARES.forEach(s => {
        const ms = this.game.moves({ square: s, verbose: true })
        if (ms.length)
          dests.set(
            s,
            ms.map(m => m.to)
          )
      })
      return dests
    },
    opponentMoves() {
      let originalPGN = this.game.pgn()
      let tokens = this.game.fen().split(" ")
      tokens[1] = tokens[1] === "w" ? "b" : "w"
      tokens = tokens.join(" ")
      let valid = this.game.load(tokens)
      if (valid) {
        let moves = this.game.moves({ verbose: true })
        this.game.load_pgn(originalPGN)
        return moves
      } else {
        return []
      }
    },
    toColor() {
      return this.game.turn() === "w" ? "white" : "black"
    },
    paintThreats() {
      let moves = this.game.moves({ verbose: true })
      let threats = []
      moves.forEach(function (move) {
        threats.push({ orig: move.to, brush: "yellow" })

        if (move["captured"]) {
          threats.push({ orig: move.from, dest: move.to, brush: "red" })
        }
        if (move["san"].includes("+")) {
          threats.push({ orig: move.from, dest: move.to, brush: "blue" })
        }
      })
      this.board.setShapes(threats)
    },
    calculatePromotions() {
      let moves = this.game.moves({ verbose: true })
      this.promotions = []
      for (let move of moves) {
        if (move.promotion) {
          this.promotions.push(move)
        }
      }
    },
    isPromotion(orig, dest) {
      let filteredPromotions = this.promotions.filter(
        move => move.from === orig && move.to === dest
      )
      return filteredPromotions.length > 0 // The current movement is a promotion
    },
    changeTurn() {
      return (orig, dest, metadata) => {
        if (this.isPromotion(orig, dest)) {
          this.promoteTo = this.onPromotion()
        }
        this.game.move({ from: orig, to: dest, promotion: this.promoteTo }) // promote to queen for simplicity
        this.board.set({
          fen: this.game.fen(),
          turnColor: this.toColor(),
          movable: {
            ...this.getMovable(),
          },
        })
        this.calculatePromotions()
        this.afterMove()
      }
    },
    afterMove() {
      if (this.showThreats) this.paintThreats()
      this.paintCrucialThreats()

      this.$emit("onMove", this.game)
      // check if game is finished
      if (this.game.game_over) this.$emit("onFinish", this.game)
    },
    countThreats(color) {
      let threats = {}
      let captures = 0
      let checks = 0
      let moves = this.game.moves({ verbose: true })
      if (color !== this.toColor()) {
        moves = this.opponentMoves()
      }

      if (moves.length === 0) {
        return null // It´s an invalid position
      }

      moves.forEach(function (move) {
        if (move["captured"]) {
          captures++
        }
        if (move["san"].includes("+")) {
          checks++
        }
      })

      threats[`legal_${color}`] = uniques(moves.map(x => x.from + x.to)).length // promotions count as 4 moves. This remove those duplicates moves.
      threats[`checks_${color}`] = checks
      threats[`threat_${color}`] = captures
      threats[`turn`] = color
      return threats
    },
    loadPosition() {
      let orientation
      const pgnSplit = this.pgn.split("\n")

      if (this.color === "white" || this.color === "black") orientation = this.color
      else orientation = this.orientation

      // if no moves are made add empty move, else load_pgn wont work
      if (_.isUndefined(pgnSplit[pgnSplit.length - 1][0])) pgnSplit.push("1. ")
      if (!_.isUndefined(this.pgn)) this.game.load_pgn(pgnSplit.join("\n"))
      else this.game.load(this.fen)

      this.board = Chessground(this.$refs.board, {
        fen: this.game.fen(),
        turnColor: this.toColor(),
        movable: {
          ...this.getMovable(),
          free: this.free,
        },
        orientation: orientation,
      })
      this.board.set({
        movable: { events: { after: this.changeTurn() } },
      })
      this.afterMove()
    },
    // Custom Functions
    paintCrucialThreats() {
      // Only paint if user is in_check
      if (this.game.in_check()) {
        let threats = []
        const kingPos = this.getPosition("k", this.game.turn())[0]
        const lastMove = this.game.history({ verbose: true }).pop()

        threats.push({ orig: lastMove.to, brush: "yellow" })
        threats.push({ orig: kingPos, brush: "red" })
        threats.push({ orig: lastMove.to, dest: kingPos, brush: "red" })

        this.board.setShapes(threats)
      }
    },
    getMovable() {
      const currentColor = _.isUndefined(this.toColor()) ? "" : this.toColor()
      let returnOb = {}

      if (currentColor !== "") {
        if (currentColor !== this.color) {
          return returnOb
        }
      }
      returnOb = {
        color: currentColor,
        dests: this.possibleMoves(),
      }

      return returnOb
    },
    alphabetPosition(letter: string): number {
      const charCode = parseInt(letter, 36)
      return charCode - 10
    },
    letterFromAlphabetPosition(position: number): string {
      switch (position) {
        case 1:
          return "a"
        case 2:
          return "b"
        case 3:
          return "c"
        case 4:
          return "d"
        case 5:
          return "e"
        case 6:
          return "f"
        case 7:
          return "g"
        case 8:
          return "h"
        default:
          return "outside of the Chessrange"
      }
    },
    getPosition(pice: string, color = "w") {
      const board = this.game.board()
      let partPos = []

      board.map((row, rowIndex) => {
        row.map((col, colIndex) => {
          if (col !== null && col.color === color && col.type === pice) {
            partPos.push(`${this.letterFromAlphabetPosition(1 + colIndex)}${8 - rowIndex}`)
          }
        })
      })

      return partPos
    },
    gameUpdateHandler(object) {
      const newFen = object.get("fen")
      const newPgn = object.get("pgn")

      this.fen = newFen
      this.pgn = newPgn
      this.loadPosition()
    },
  },
  props: {
    fen: {
      type: String,
    },
    free: {
      type: Boolean,
      default: false,
    },
    showThreats: {
      type: Boolean,
      default: false,
    },
    onPromotion: {
      type: Function,
      default: () => "q",
    },
    orientation: {
      type: String,
      default: "white",
    },
    // Custom Params
    color: {
      type: String,
      default: "",
    },
    gameId: {
      type: String,
      requried: true,
    },
    pgn: {
      type: String,
      required: true,
    },
  },
  watch: {
    orientation(orientation) {
      this.orientation = orientation
      this.loadPosition()
    },
    showThreats(st) {
      this.showThreats = st
      if (this.showThreats) {
        this.paintThreats()
      }
    },
  },
  emits: ["onMove", "onFinish", "onInitalise"],
}
</script>

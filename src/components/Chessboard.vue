<template>
  <div class="blue merida">
    <div
      ref="board"
      :style="{ width: gameWidth, height: gameWidth }"
      class="cg-board-wrap"
    ></div>
  </div>
</template>

<script>
import { Chess } from "chess.js"
import { Chessground } from "chessground"
import { uniques } from "../util/chessboard"
import { isUndefined } from "lodash"
import { ref } from "vue"
import config from "../config"

export default {
  name: "chessboard",
  props: {
    fen: {
      type: String,
      default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
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
  },
  watch: {
    fen(newFen) {
      this.fen = newFen
      this.loadPosition()
    },
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
  methods: {
    setGameWidth() {
      this.windowWith = window.innerWidth
      const gameBorder = 50
      if (isUndefined(this) || this.windowWith > 700 + gameBorder)
        this.gameWidth = "700px"
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
            color: this.toColor(),
            dests: this.possibleMoves(),
          },
        })
        this.calculatePromotions()
        this.afterMove()
      }
    },
    afterMove() {
      if (this.showThreats) {
        this.paintThreats()
      }
      let threats = this.countThreats(this.toColor()) || {}
      threats["history"] = this.game.history()
      threats["fen"] = this.game.fen()
      this.$emit("onMove", threats)
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
      this.game.load(this.fen)
      this.board = Chessground(this.$refs.board, {
        fen: this.game.fen(),
        turnColor: this.toColor(),
        movable: {
          color: this.toColor(),
          free: this.free,
          dests: this.possibleMoves(),
        },
        orientation: this.orientation,
      })
      this.board.set({
        movable: { events: { after: this.changeTurn() } },
      })
      this.afterMove()
    },
  },
  setup() {
    return {
      windowWith: ref(0),
      gameWidth: ref("700px"),
      game: new Chess(),
      board: null,
      promotions: [],
      promoteTo: "q",
    }
  },
  mounted() {
    this.loadPosition()

    const windowWithListener = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "refreshWindowSize") {
        this.setGameWidth()
      }
    })
    this.setGameWidth()

    return {
      windowWithListener,
    }
  },
}
</script>

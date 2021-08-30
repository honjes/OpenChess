<template>
  <div class="oc-chess chessGame" :class="styleClass">
    <chessboard
      v-if="gameColor !== ''"
      style="margin-top: 20px"
      :gameId="id"
      :color="gameColor"
      :fen="currentFen"
      :pgn="currentPgn"
      @onMove="onChessMove"
      @onFinish="onChessFinish"
    />
  </div>
</template>

<script lang="ts">
import chessboard from "./OcChessboard.vue"
import { ref } from "vue"
import { getCurrentUser, getGame, initaliseGame, updateGame } from "../util/parse"
import _ from "lodash"

export default {
  setup(props) {
    const currentFen = props.defaultFen

    return {
      styleClass: props.class,
      id: props.id,
      gameColor: ref(""),
      currentFen: ref(currentFen),
      currentPgn: ref(props.pgn),
      playing: ref(props.playing),
    }
  },
  async data() {
    await this.setupGameConnection()

    return {}
  },
  methods: {
    async onChessMove(game) {
      const gameFen = game.fen()
      const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

      if (
        game !== false &&
        gameFen !== startFen &&
        this.game !== false &&
        gameFen !== this.currentFen
      ) {
        this.currentFen = gameFen
        await updateGame(this.id, game)
      }
    },
    async setupGameConnection() {
      const currentUser = getCurrentUser()
      if (!_.isUndefined(this.id) && this.id !== "" && currentUser) {
        this.game = await getGame(this.id)
        let newGameColor = ""

        if (_.isUndefined(this.game.get("white"))) {
          await initaliseGame(this.id)
          newGameColor = "white"
        } else if (this.game.get("white").id === currentUser.id) newGameColor = "white"
        else newGameColor = "black"

        this.gameColor = newGameColor
        if (this.game) {
          this.currentFen = this.game.get("fen")
          this.currentPgn = this.game.get("pgn")
        }
      }
    },
    async onChessFinish() {
      this.$emit("gameFinished")
    },
  },
  components: {
    chessboard,
  },
  props: {
    class: {
      type: String,
      default: "",
    },
    defaultFen: {
      type: String,
      default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    },
    pgn: {
      type: String,
    },
    playing: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  emits: ["onFinish"],
}
</script>

<style lang="scss">
.chessGame {
  display: flex;
  justify-content: center;
}
</style>

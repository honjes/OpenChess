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
    />
  </div>
</template>

<script lang="ts">
import chessboard from "./OcChessboard.vue"
import { ref } from "vue"
import { getGame, setWhiteToCurrent, updateGame } from "../util/parse"
import _, { isUndefined } from "lodash"

export default {
  setup(props) {
    const currentFen = props.defaultFen

    return {
      styleClass: props.class,
      id: props.id,
      gameColor: ref(""),
      currentFen: ref(currentFen),
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
      if (!isUndefined(this.id) && this.id !== "") {
        this.game = await getGame(this.id)
        let newGameColor = ""

        if (this.game.get("white") === "" || this.game.get("white") === " ") {
          await setWhiteToCurrent(this.id)
          newGameColor = "white"
        } else if (this.game.get("white") === this.playing) newGameColor = "white"
        else newGameColor = "black"

        this.gameColor = newGameColor
        if (this.game) {
          this.currentFen = this.game.get("fen")
          this.currentPgn = this.game.get("pgn")
        }
      }
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
    playing: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.chessGame {
  display: flex;
  justify-content: center;
}
</style>

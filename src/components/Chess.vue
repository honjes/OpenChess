<template>
  <div class="oc-chess chessGame" :class="styleClass">
    <chessboard
      v-if="gameColor !== ''"
      :color="gameColor"
      style="margin-top: 20px"
      :fen="defaultFen"
      @onMove="onChessMove"
    />
  </div>
</template>

<script lang="ts">
import chessboard from "./OcChessboard.vue"
import { ref } from "vue"
import { getGame, setWhiteToCurrent } from "../util/parse"
import { isUndefined } from "lodash"

export default {
  setup(props) {
    return {
      styleClass: props.class,
      id: props.id,
      gameColor: ref(""),
      defaultFen: props.defaultFen,
    }
  },
  async data() {
    await this.setupGameConnection()

    return {}
  },
  methods: {
    onChessMove(ev) {
      let { fen } = ev
      this.currentFen = String(fen)
    },
    async setupGameConnection() {
      if (!isUndefined(this.id) && this.id !== "") {
        this.game = await getGame(this.id)
        let newGameColor = ""
        if (this.game.get("white") === "") {
          await setWhiteToCurrent(this.id)
          newGameColor = "white"
        } else if (this.game.get("white") === this.currentlyPlaying) newGameColor = "white"
        else newGameColor = "black"

        this.gameColor = newGameColor
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
    currentlyPlaying: {
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

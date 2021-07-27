<template>
  <chessboard :fen="defaultFen" @onMove="onChessMove" />
  <div>
    <p>Fen: {{ currentFen }}</p>
  </div>
</template>

<script type="ts">
import chessboard from "./Chessboard.vue"
import 'vue-chessboard/dist/vue-chessboard.css'
import { isUndefined } from "lodash"
export default {
  setup(props) {
    return {
      defaultFen: isUndefined(props.defaultValue) ? "" : props.defaultValue
    }
  },
  methods: {
    onChessMove(ev) {
      let { fen } = ev
      this.currentFen = String(fen)
    }
  },
  data() {
    return {
      currentFen: ""
    }
  },
  components: {
    chessboard
  },
}
</script>

<style></style>

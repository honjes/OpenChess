<template>
  <div class="chessGame" :class="styleClass">
    <chessboard
      style="margin-top: 20px"
      :fen="defaultFen"
      @onMove="onChessMove"
    />
  </div>
</template>

<script type="ts">
import chessboard from "./Chessboard.vue"
import { isUndefined } from "lodash"
export default {
  setup(props) {
    return {
      defaultFen: isUndefined(props.defaultValue) ? "" : props.defaultValue,
      styleClass: props.class
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
  props: {
    class: {
      type: String,
      default: ""
    }
  }
}
</script>

<style></style>

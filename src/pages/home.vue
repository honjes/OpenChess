<script lang="ts">
import { ref } from "vue"
import Chess from "../components/Chess.vue"

export default {
  data() {
    return {}
  },
  components: {
    Chess,
  },
}
</script>
<template>
  Home
  <Chess class="oc-flex-center" />
</template>

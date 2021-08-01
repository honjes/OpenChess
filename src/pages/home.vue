<template>
  <Nav />
  <CurrentGames />
</template>
<script lang="ts">
import CurrentGames from "../components/CurrentGames.vue"
import Nav from "../components/Nav.vue"

export default {
  data() {
    return {}
  },
  components: {
    Nav,
    CurrentGames,
  },
}
</script>

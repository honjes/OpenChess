<template>
  <div id="home_site">
    <Nav />
    <div class="home_content">
      <div class="left"><CreateGame /></div>
      <div class="games"><CurrentGames /></div>
    </div>
  </div>
</template>
<script lang="ts">
import CurrentGames from "../components/CurrentGames.vue"
import CreateGame from "../components/CreateGame.vue"
import Nav from "../components/Nav.vue"
import { isLoggedIn } from "../util/parse"

export default {
  mounted() {
    if (!isLoggedIn()) this.$router.push({ name: "login" })
  },
  components: {
    Nav,
    CurrentGames,
    CreateGame,
  },
}
</script>

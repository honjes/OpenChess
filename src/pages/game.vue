<template>
  <div class="game_site">
    <Nav />
    <div class="game_content">
      <Chess />
    </div>
  </div>
</template>

<script lang="ts">
import Nav from "../components/Nav.vue"
import Chess from "../components/Chess.vue"
import { ref } from "vue"
import { isLoggedIn } from "../util/parse"
export default {
  name: "Game",
  mounted() {
    if (!isLoggedIn()) this.$router.push({ name: "login" })
  },
  data() {
    return {
      gameId: ref(this.$route.params.gameId),
    }
  },
  components: {
    Chess,
    Nav,
  },
}
</script>

<style></style>

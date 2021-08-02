<template>
  <div class="game_site">
    <Nav />
    <Chess />
  </div>
</template>

<script lang="ts">
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
  },
}
</script>

<style></style>

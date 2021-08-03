<template>
  <div class="game_site">
    <Nav />
    <div class="game_content">
      <div class="info_header">
        <div class="user">
          <Avatar />
        </div>
        <div class="enemy"></div>
      </div>
      <div class="game"><Chess /></div>
    </div>
  </div>
</template>

<script lang="ts">
import Nav from "../components/Nav.vue"
import Chess from "../components/Chess.vue"
import { ref } from "vue"
import { getGame, isLoggedIn } from "../util/parse"
import Avatar from "../components/Avatar.vue"
export default {
  name: "Game",
  async mounted() {
    if (!isLoggedIn()) this.$router.push({ name: "login" })
    await this.setupGameConnection()
  },
  data() {
    return {
      game: ref(),
      gameId: ref(this.$route.params.gameId),
    }
  },
  methods: {
    async setupGameConnection() {
      this.game = await getGame(this.gameId)
    },
  },
  components: {
    Chess,
    Nav,
    Avatar,
  },
}
</script>

<style></style>

<template>
  <div class="oc-game_site">
    <div class="game_content">
      <div class="info_header">
        <div class="user">
          <Avatar />
        </div>
        <div class="enemy"></div>
      </div>
      <div class="game"><Chess :id="gameId" :playing="user.id" /></div>
    </div>
  </div>
</template>

<script lang="ts">
import Chess from "../components/Chess.vue"
import { ref } from "vue"
import { isLoggedIn } from "../util/parse"
import Avatar from "../components/Avatar.vue"
import { useRoute } from "vue-router"
export default {
  name: "Game",
  setup() {
    const route = useRoute()
    const paramGameId = route.params.gameId

    return {
      gameId: ref(paramGameId),
    }
  },
  mounted() {
    isLoggedIn(this.$router)
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  components: {
    Chess,
    Avatar,
  },
}
</script>

<style></style>

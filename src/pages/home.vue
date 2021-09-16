<template>
  <div id="oc-home_site">
    <div class="home_content">
      <div class="left"><InvitePlayers /></div>
      <div class="games"><CurrentGames /></div>
    </div>
  </div>
</template>
<script lang="ts">
import CurrentGames from "../components/CurrentGames.vue"
import InvitePlayers from "../components/InvitePlayers.vue"
import Nav from "../components/Nav.vue"
import { isLoggedIn } from "../util/parse"

export default {
  mounted() {
    isLoggedIn(this.$router)
  },
  components: {
    Nav,
    CurrentGames,
    InvitePlayers,
  },
}
</script>

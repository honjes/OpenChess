<template>
  <div class="oc-current_games">
    debug: {{ currentGames }}
    <div v-if="currentGames.length > 0">
      <div
        v-for="game in currentGames"
        :key="game.objectId"
        class="oc-clickable oc-hover"
        @click="toGamePage(game.id)"
      >
        <span class="oc-disabled">vs </span>
        {{ game.getEnemy(this.$store.state.user.id) }}
        <it-tag
          type="warning"
          v-if="game.isUsersTurn(this.$store.state.user.username)"
        >
          Your Turn
        </it-tag>
      </div>
    </div>
    <div v-else>No games Found</div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"
import { parseQuery } from "../util/parse"
export default {
  setup() {
    return {
      currentGames: ref([]),
    }
  },
  async mounted() {
    this.currentGames = await parseQuery(this.$store.state.parseObjects.Game, {
      users: this.$store.state.user.username,
    })
  },
  methods: {
    toGamePage(gameId: any) {
      this.$router.push({ name: "game", params: { gameId } })
    },
  },
}
</script>

<style lang="scss">
.oc-current_games {
  border: 1px solid #000;
  padding: 7px 0;
  font-size: 1.1em;
}
</style>

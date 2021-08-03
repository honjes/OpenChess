<template>
  <div class="oc-current_games">
    <div v-if="debug">debug: {{ currentGames }}</div>
    <div v-if="currentGames.length > 0">
      <div
        v-for="game in currentGames"
        :key="game.objectId"
        class="single_game oc-clickable oc-hover"
        @click="toGamePage(game.id)"
      >
        <span class="oc-disabled" style="margin-right: 10px">vs</span>
        <Avatar
          size="30px"
          :text="game.getEnemy(storeUser.id)"
          :color="storeUser.color"
          :extended="true"
        />
        <it-tag type="warning" v-if="game.isUsersTurn(storeUser.username)">
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
import Avatar from "./Avatar.vue"

export default {
  setup() {
    return {
      currentGames: ref([]),
    }
  },
  computed: {
    debug() {
      return this.$store.state.config.debug
    },
    storeUser() {
      return this.$store.state.user
    },
  },
  async mounted() {
    this.currentGames = await parseQuery(this.$store.state.parseObjects.Game, {
      users: this.storeUser.username,
    })
  },
  methods: {
    toGamePage(gameId: any) {
      this.$router.push({ name: "game", params: { gameId } })
    },
  },
  components: {
    Avatar,
  },
}
</script>

<style lang="scss">
.oc-current_games {
  border: 1px solid #000;
  padding: 0 0;
  font-size: 1.1em;
  .single_game {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 7px 0;
  }
}
</style>

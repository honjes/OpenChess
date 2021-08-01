<template>
  <div>
    {{ currentGames }}
    <div v-if="currentGames.length > 0">
      <table style="width: 100%">
        <tbody>
          <tr
            v-for="game in currentGames"
            :key="game.objectId"
            class="oc-clickable"
            @click="() => toGamePage(game.objectId)"
          >
            <td>
              {{ game.getEnemy(this.$store.state.user.id) }}
              <it-tag
                type="warning"
                v-if="game.isUsersTurn(this.$store.state.user.username)"
              >
                Your Turn
              </it-tag>
            </td>
          </tr>
        </tbody>
      </table>
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
    toGamePage(gameId: string) {},
  },
}
</script>

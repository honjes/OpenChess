<template>
  <div class="oc-current_games">
    <p style="margin: 10px 0">Current Games:</p>
    <div v-if="userGames.length > 0">
      <div
        v-for="game in userGames"
        :key="game.objectId"
        class="single_game oc-clickable oc-hover"
        @click="toGamePage(game.id)"
      >
        <it-tag class="turn_tag" type="warning" v-if="game.isUsersTurn(storeUser.username)">
          Your Turn
        </it-tag>
        <span class="oc-disabled" style="margin-right: 10px">vs</span>
        <span v-if="game && getEnemyName(game.getEnemy(currentUser.id).id) !== ''">
          <Avatar
            size="30px"
            :color="getEnemyColor(game.getEnemy(currentUser.id).id)"
            :extends="true"
            :text="getEnemyName(game.getEnemy(currentUser.id).id)"
          />
        </span>
      </div>
    </div>
    <div v-else>No games Found</div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"
import { getCurrentUser, getGame, getUserById } from "../util/parse"
import Avatar from "./Avatar.vue"

export default {
  setup() {
    return {
      userGames: ref([]),
      currentUser: null,
      enemys: ref([]),
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
    this.currentUser = await getCurrentUser()
    await this.refreshGames()
  },
  methods: {
    toGamePage(gameId: any) {
      this.$router.push({ name: "game", params: { gameId } })
    },
    async refreshGames() {
      if (this.currentUser) {
        const newUserGames = await getGame(this.currentUser)
        if (newUserGames !== false) {
          this.userGames = newUserGames
          await this.refreshEnemys()
        }
      }
    },
    async refreshEnemys() {
      const enemys = await Promise.all(
        this.userGames.map(async game => {
          const enemyId = game.getEnemy(this.currentUser.id).id
          const enemy = await getUserById(enemyId)
          return enemy
            ? { username: enemy.get("username"), id: enemy.id, color: enemy.get("color") }
            : false
        })
      )

      this.enemys = enemys
    },
    getEnemyName(enemyId: string): string {
      const fenemys = this.enemys.filter(val => {
        return val.id === enemyId
      })
      if (fenemys.length > 0) return fenemys[0].username
      else return ""
    },
    getEnemyColor(enemyId: string): string {
      const fenemys = this.enemys.filter(val => {
        return val.id === enemyId
      })
      if (fenemys.length > 0) return fenemys[0].color
      else return ""
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

    .turn_tag {
      margin-right: 10px;
    }
  }
}
</style>

<template>
  <div id="oc-game_site">
    <div class="game_content">
      <div class="info_header">
        <div class="user_info" v-if="game">
          <div class="user">
            <Avatar size="70px" :color="user.color" :extends="true" :text="user.username" />
            <span
              :class="{
                'oc-icon-king_white': game.getUserColor(user.id) === 'white',
                'oc-icon-king_black': game.getUserColor(user.id) === 'black',
              }"
            />
            <div>
              <it-tag v-if="game.isUsersTurn(user.id)">Turn</it-tag>
            </div>
          </div>
          <it-divider vertical style="height: 70px; width: 3px; margin: 0 30px" />
          <div class="enemy">
            <div><it-tag v-if="game.isUsersTurn(game.getEnemy(user.id).id)">Turn</it-tag></div>
            <span
              :class="{
                'oc-icon-king_white': game.getUserColor(game.getEnemy(user.id).id) === 'white',
                'oc-icon-king_black': game.getUserColor(game.getEnemy(user.id).id) === 'black',
              }"
            />
            <Avatar
              size="70px"
              :color="game.getEnemy(user.id).get('color')"
              :extends="true"
              :text="game.getEnemy(user.id).get('username')"
            />
          </div>
        </div>
      </div>
      <div class="game">
        <Chess v-if="Boolean(game)" :defaultFen="game.get('fen')" :id="gameId" :playing="user.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Chess from "../components/Chess.vue"
import { ref } from "vue"
import { getGame, getUserById, isLoggedIn } from "../util/parse"
import Avatar from "../components/Avatar.vue"
import { useRoute } from "vue-router"
export default {
  name: "Game",
  setup() {
    const route = useRoute()
    const paramGameId = route.params.gameId

    return {
      gameId: ref(paramGameId),
      game: ref(false),
      enemy: ref({}),
    }
  },
  async mounted() {
    isLoggedIn(this.$router)
    await this.initGame()
  },
  methods: {
    async initGame() {
      const game = await getGame(String(this.gameId))

      // when game is set get Enemy
      if (game) {
        const enemyId = game.getEnemy(this.user.id).id
        const enemy = await getUserById(enemyId)
        this.enemy = enemy
      }
      this.game = game
    },
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

<style lang="scss">
#oc-game_site {
  .info_header .user_info {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .user,
    .enemy {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>

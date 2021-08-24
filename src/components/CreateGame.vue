<template>
  <div class="oc-create_game">
    <it-input
      class="input"
      label-top="Playername"
      placeholder="Player you want to invite to a game"
      :value="playername"
      @input="changePlayername"
    />
    <it-button @click="invitePlayer">Invite</it-button>
  </div>
</template>

<script lang="ts">
import { createGameWithCurrent } from "../util/parse"
export default {
  name: "CreateGame",
  setup() {
    return {
      playername: "",
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    changePlayername(e: any) {
      this.playername = e.currentTarget.value
    },
    async invitePlayer() {
      await createGameWithCurrent(this.playername)
    },
  },
}
</script>

<style lang="scss">
.oc-create_game {
  display: flex;
  justify-content: space-between;
  align-items: end;

  > div {
    width: 100%;
    margin-right: 20px;
  }
}
</style>

<template>
  <div class="oc-create_game">
    <it-input
      label-top="Playername"
      placeholder="Username of the Player you want to invite to a game"
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

<style></style>

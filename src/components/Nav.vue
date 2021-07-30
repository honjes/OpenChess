<template>
  <nav>
    <it-button v-if="isLoggedIn()" @click="logout">Logout</it-button>
  </nav>
</template>

<script lang="ts">
import { logoutUser, isLoggedIn } from "../util/parse"
export default {
  methods: {
    async logout() {
      if (await logoutUser())
        this.$Message.success({ text: "Sucessfully Loged out" })
      else this.$Message.danger({ text: "Logout failed" })
    },
    isLoggedIn,
  },
}
</script>

<style lang="scss">
nav {
  display: flex;
}
</style>

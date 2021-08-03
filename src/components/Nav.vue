<template>
  <nav>
    <it-button text><router-link to="/">Home</router-link></it-button>
    <it-button v-if="$store.state.isLoggedIn" @click="logout">Logout</it-button>
  </nav>
</template>

<script lang="ts">
import { logoutUser, isLoggedIn } from "../util/parse"
export default {
  name: "Nav",
  methods: {
    async logout() {
      if (await logoutUser()) {
        this.$Message.success({ text: "Sucessfully Loged out" })
        this.$store.commit("changeLoginState")
        this.$router.push({ name: "login" })
      } else this.$Message.danger({ text: "Logout failed" })
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

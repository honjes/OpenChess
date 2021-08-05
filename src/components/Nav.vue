<template>
  <nav class="oc-nav">
    <it-button text><router-link to="/">Home</router-link></it-button>
    <div v-if="$store.state.isLoggedIn" :class="{ userAvatar: true, extended }">
      <it-button @click="logout">Logout</it-button>
    </div>
  </nav>
</template>

<script lang="ts">
import { logoutUser } from "../util/parse"
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
  },
}
</script>

<style lang="scss">
nav {
  display: flex;
}
</style>

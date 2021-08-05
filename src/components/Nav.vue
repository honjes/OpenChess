<template>
  <nav class="oc-nav">
    <it-button class="home_link" text><router-link to="/">Home</router-link></it-button>
    <it-dropdown class="user_link" v-if="$store.state.isLoggedIn">
      <it-icon name="face" />
      <template #menu>
        <it-dropdown-menu>
          <it-dropdown-item @click="routeTo('user')">Account</it-dropdown-item>
          <it-dropdown-item divided @click="logout">Logout</it-dropdown-item>
        </it-dropdown-menu>
      </template>
    </it-dropdown>
  </nav>
</template>

<script lang="ts">
import { logoutUser } from "../util/parse"
export default {
  name: "Nav",
  methods: {
    routeTo(to: string) {
      this.$router.push({ name: to })
    },
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
@import "../static/scss/vars.scss";
nav.oc-nav {
  display: grid;
  grid-template-columns: 10% 85% 5%;
  grid-template-areas: "first fill last";

  .home_link {
    grid-area: first;
    justify-content: left;
    padding-left: $default-padding;
  }
  .user_link {
    grid-area: last;
    text-align: right;
    padding-right: $default-padding;
  }
}
</style>

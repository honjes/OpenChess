<template>
  <div class="pc-user_page"></div>
</template>

<script lang="ts">
import { isLoggedIn } from "../util/parse"
export default {
  name: "User",
  mounted() {
    isLoggedIn(this.$router)
  },
}
</script>

<style lang="scss"></style>

<template>
  <div class="oc-user_page"></div>
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

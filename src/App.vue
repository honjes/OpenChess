<template>
  <div>
    <Login />
    <router-view />
  </div>
</template>

<script lang="ts">
import Login from "./components/Login.vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "app",
  components: {
    Login,
  },
})
</script>

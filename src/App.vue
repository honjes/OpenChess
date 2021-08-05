<template>
  <div class="oc-container">
    <EmailVerification v-if="isLoggedIn()" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { isLoggedIn } from "./util/parse"
import EmailVerification from "./components/EmailVerification.vue"

export default defineComponent({
  name: "app",
  mounted() {
    window.addEventListener("resize", this.handleWindowResize)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize)
  },
  methods: {
    handleWindowResize() {
      this.$store.commit("refreshWindowSize")
    },
    isLoggedIn,
  },
  components: {
    EmailVerification,
  },
})
</script>

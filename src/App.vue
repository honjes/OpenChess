<template>
  <div class="oc-container">
    <Nav v-if="loginState" />
    <EmailVerification v-if="loginState" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { isLoggedIn } from "./util/parse"
import EmailVerification from "./components/EmailVerification.vue"
import Nav from "./components/Nav.vue"

export default defineComponent({
  name: "app",
  mounted() {
    window.addEventListener("resize", this.handleWindowResize)
  },
  computed: {
    loginState() {
      return this.$store.state.isLoggedIn
    },
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
    Nav,
  },
})
</script>

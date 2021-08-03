<template>
  <div class="oc-container">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

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
  },
})
</script>

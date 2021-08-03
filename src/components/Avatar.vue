<template>
  <div
    :class="{ 'oc-avatar': true, 'extended': extend }"
    @mouseover="changeExtend"
    @mouseout="changeExtend"
  >
    <span class="username" ref="extendedText" :style="{ width: textWidth }">{{
      text
    }}</span>
    <it-avatar
      :src="src"
      :text="text"
      :color="color"
      :size="size"
      :square="square"
      :style="{ transform: avatarTransform }"
    />
  </div>
</template>

<script>
import { ref } from "vue"

export default {
  name: "Avatar",
  props: {
    src: { type: String, default: null },
    text: { type: String, default: null },
    color: { type: String, default: null },
    size: { type: String, default: "40px" },
    square: { type: Boolean, default: false },
    extended: { type: Boolean, default: false },
  },
  setup(props) {
    return {
      ...props,
      extend: ref(false),
      extendTextWidth: ref(0),
    }
  },
  mounted() {
    this.extendTextWidth = this.$refs.extendedText.clientWidth
  },
  data() {},
  computed: {
    textWidth() {
      if (this.extendTextWidth === 0) return "auto"
      else if (!this.extend) return "15px"
      return `${this.extendTextWidth + 25}px`
    },
    avatarTransform() {
      if (!this.extend) return "translate(0)"
      return `translate(${this.extendTextWidth + 6}px)`
    },
  },
  methods: {
    changeExtend() {
      console.log("this.avatarTransform: ", this.avatarTransform)
      this.extend = !this.extend
    },
  },
}
</script>

<style lang="scss">
.oc-avatar {
  position: relative;
  .username {
    vertical-align: middle;
    text-align: left;
    position: absolute;
    height: 25px;
    background: #fff;
    color: #000;
    opacity: 0;
    border-radius: 120px 160px 160px 120px;
    transition: ease all 1s;
    padding: 5px 0 0 10px;
  }
  .it-avatar {
    transition: ease all 1s;
  }
  &.extended {
    animation: roll-right 1s;
    .username {
      opacity: 1;
    }
  }
}
</style>

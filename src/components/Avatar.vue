<template>
  <div
    :class="{ 'oc-avatar': true, 'extended': extend, 'left': !extendsLeft }"
    @mouseover="changeExtend"
    @mouseout="changeExtend"
  >
    <span
      v-if="extendsLeft"
      :class="{ username: true, left: extendsLeft }"
      ref="extendedText"
      :style="{ width: textWidth, opacity: textOpacity, transform: avatarTransform }"
      >{{ text }}</span
    >
    <it-avatar
      ref="mainAvatar"
      :src="src"
      :text="text"
      :color="color"
      :size="size"
      :square="square"
    />
    <span
      v-if="!extendsLeft"
      :class="{ username: true, left: extendsLeft }"
      ref="extendedText"
      :style="{ width: textWidth, opacity: textOpacity, transform: avatarTransform }"
      >{{ text }}</span
    >
  </div>
</template>

<script>
import { ref } from "vue"
import { isUndefined } from "lodash"

export default {
  name: "Avatar",
  props: {
    src: { type: String, default: null },
    text: { type: String, default: null },
    color: { type: String, default: null },
    size: { type: String, default: "40px" },
    square: { type: Boolean, default: false },
    extends: { type: Boolean, default: false },
    extendsLeft: { type: Boolean, default: true },
  },
  setup(props) {
    return {
      ...props,
      text: ref(props.text),
      extend: ref(false),
      extendTextWidth: ref(0),
      extendsLeft: ref(props.extendsLeft),
      firstExtend: true,
      avatarWidth: ref(0),
    }
  },
  mounted() {
    this.updateRefWidths()
  },
  computed: {
    textWidth() {
      if (!this.$props.extends || this.extendTextWidth === 0) return "auto"
      else if (!this.extend) return "15px"
      return `${this.extendTextWidth + (this.avatarWidth / 100) * 20}px`
    },
    textOpacity() {
      if (!this.$props.extends || !this.extend) return 0
      else return 1
    },
    avatarTransform() {
      if (!this.$props.extends || !this.extend) return "translate(0)"
      return `translate(${!this.extendsLeft ? "" : "-"}${this.extendTextWidth + 4}px)`
    },
  },
  methods: {
    changeExtend() {
      if (this.firstExtend && this.avatarWidth === 0) {
        this.updateRefWidths()
        this.firstExtend = false
      }
      this.extend = !this.extend
    },
    updateRefWidths() {
      if (!isUndefined(this.$refs.extendedText)) {
        this.extendTextWidth = this.$refs.extendedText.clientWidth
        this.avatarWidth = Number(this.$refs.mainAvatar.size.replace("px", ""))
      }
    },
  },
}
</script>

<style lang="scss">
.oc-avatar {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  &.left .username {
    text-align: right;
  }
  .username {
    z-index: -1;
    vertical-align: middle;
    text-align: left;
    position: absolute;
    height: 25px;
    background: #fff;
    color: transparent;
    border-radius: 120px 50% 50% 120px;
    transition: ease all 1s;
    padding: 5px 10px 0 0;
    &.left {
      padding: 5px 0 0 10px;
    }
  }
  .it-avatar {
    transition: ease all 1s;
  }
  &.extended {
    animation: roll-right 1s;
    .username {
      color: #000;
    }
  }
}
</style>

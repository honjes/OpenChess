<template>
  <span class="oc-countdown">
    <span>{{ currentValue }} <slot /></span>
  </span>
</template>

<script>
import { isUndefined } from "lodash"
import { ref } from "vue"

export default {
  Name: "Countdown",
  setup(props) {
    const currentValue = ref(props.value)

    return { currentValue, currentInterval: ref(undefined) }
  },
  mounted() {
    this.startAutoDecrese()
  },
  unmounted() {
    if (!isUndefined(this.currentInterval)) clearInterval(this.currentInterval)
  },
  methods: {
    startAutoDecrese() {
      if (isUndefined(this.currentInterval))
        this.currentInterval = setInterval(() => this.decreaseValue(), 1000)
    },
    decreaseValue() {
      if (this.currentValue <= 0) {
        clearInterval(this.currentInterval)
        this.$emit("finished", true)
      } else this.currentValue = Number(this.currentValue) - 1
    },
  },
  props: {
    value: {
      type: Number,
      default: 10,
    },
  },
  emits: ["finished"],
}
</script>

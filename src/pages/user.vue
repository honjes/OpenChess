<template>
  <div id="oc-user_page">
    <h2>Your Userinformation</h2>
    <div class="user_form">
      <it-input v-model="username" label-top="Username" />
      <it-input v-model="email" label-top="Email" />
      <it-popover class="user_color_change" borderless>
        <it-input suffix-icon="face" v-model="color" label-top="User Color" />
        <template #content>
          <it-colorpicker v-model="color" @change="changeColor" />
        </template>
      </it-popover>
      <it-button class="user_save" type="primary" @click="saveUser">Save Changes</it-button>
    </div>
  </div>
</template>

<script lang="ts">
import { isLoggedIn } from "../util/parse"
import { ref } from "vue"

export default {
  name: "User",
  setup() {
    return {
      username: ref(""),
      email: ref(""),
      color: ref("#fff"),
    }
  },
  mounted() {
    isLoggedIn(this.$router)

    const newUsername = this.$store.state.user.username
    const newEmail = this.$store.state.user.email
    const newColor = this.$store.state.user.color

    this.username = newUsername
    this.email = newEmail
    this.color = newColor
  },
  methods: {
    changeColor(e) {
      this.color = e.hex
    },
  },
}
</script>

<style lang="scss">
#oc-user_page {
  .user_color_change {
    width: 100%;
    .it-tooltip-trigger {
      width: 100%;
    }
  }
  .user_save {
    margin-top: 10px;
  }
}
</style>

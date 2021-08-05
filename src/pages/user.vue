<template>
  <div id="oc-user_page">
    <h2>Your Userinformation</h2>
    <div class="user_form">
      <it-input
        v-model="username"
        label-top="Username"
        :message="error.username"
        :status="error.username && error.username !== '' ? 'danger' : ''"
        @change="inputChange"
      />
      <it-input
        v-model="email"
        label-top="Email"
        :message="error.email"
        :status="error.email && error.email !== '' ? 'danger' : ''"
        @change="inputChange"
      />
      <it-popover class="user_color_change" borderless>
        <it-input suffix-icon="face" v-model="color" label-top="User Color" />
        <template #content>
          <it-colorpicker v-model="color" @change="colorChange" />
        </template>
      </it-popover>
      <it-button class="user_save" type="primary" @click="saveUser">Save Changes</it-button>
    </div>
  </div>
</template>

<script lang="ts">
import { getCurrentUser, isLoggedIn } from "../util/parse"
import { ref } from "vue"
import {
  usernameCheck,
  emailCheck,
  FormCheckError,
  setError,
  setValid,
  hasNoErrors,
} from "../util/form"

export default {
  name: "User",
  setup() {
    return {
      username: ref(""),
      email: ref(""),
      color: ref("#fff"),
      error: ref({}),
    }
  },
  mounted() {
    isLoggedIn(this.$router)
    this.$store.commit("updateCurrentUser")

    const newUsername = this.$store.state.user.username
    const newEmail = this.$store.state.user.email
    const newColor = this.$store.state.user.color

    this.username = newUsername
    this.email = newEmail
    this.color = newColor
  },
  methods: {
    inputChange() {
      this.validateForm()
    },
    colorChange(e) {
      this.color = e.hex
      this.inputChange()
    },
    updateValid(field: string) {
      this.error = setValid(this.error, field)
    },
    updateError(errorOb: FormCheckError) {
      const newError = setError(this.error, errorOb)
      this.error = newError
    },
    validateForm() {
      const checkUsernameRes = usernameCheck(this.username)
      if (checkUsernameRes === true) this.updateValid("username")
      else this.updateError(checkUsernameRes)

      const checkEmailRes = emailCheck(this.email)
      if (checkEmailRes === true) this.updateValid("email")
      else this.updateError(checkEmailRes)

      return hasNoErrors(this.error)
    },
    async saveUser() {
      if (this.validateForm()) {
        const user = getCurrentUser()
        if (user) {
          user.set("username", this.username)
          user.set("email", this.email)
          user.set("color", this.color)
          await user.save()
        }
      }
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

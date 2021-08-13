<template>
  <div id="oc-user_page">
    <h2>Your Userinformation</h2>
    <div class="user_form">
      <div class="email_verified">
        <span v-if="emailIsVerified">Email is Verified</span>
        <span v-else>Email is not Verified</span>
        <it-icon v-if="emailIsVerified" box box-color="#3051ff" color="#fff" name="verified_user" />
        <it-icon v-else box box-color="#3051ff" color="#fff" name="shield" />
      </div>
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
      color: ref("#fff"),
      email: ref(""),
      emailIsVerified: ref(false),
      error: ref({}),
    }
  },
  mounted() {
    isLoggedIn(this.$router)
    this.$store.commit("updateCurrentUser")

    this.username = this.$store.state.user.username
    this.color = this.$store.state.user.color
    this.email = this.$store.state.user.email
    this.emailIsVerified = this.$store.state.user.emailIsVerified
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
  .email_verified {
    display: flex;
    justify-content: space-between;
  }
}
</style>

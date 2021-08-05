<template>
  <div id="oc-login_site" class="container">
    <div v-if="showSignUpForm">
      <h3>Create User Account</h3>
      <div class="form">
        <it-input
          v-model="username"
          @input="updateUsername"
          label-top="Username"
          :message="error.username"
          :status="error.username && error.username !== '' ? 'danger' : ''"
        />
        <it-input
          v-model="email"
          @input="updateEmail"
          label-top="Email"
          :message="error.email"
          :status="error.email && error.email !== '' ? 'danger' : ''"
        />
        <it-input
          v-model="password"
          @input="updatePassword"
          type="password"
          label-top="Password"
          :message="error.password"
          :status="error.password && error.password !== '' ? 'danger' : ''"
        />
        <it-divider />
      </div>
      <div class="buttons">
        <it-button @click="changeForm()"> Login Instead </it-button>
        <it-button type="primary" @click="registerUser">Create User</it-button>
      </div>
    </div>
    <div v-else>
      <h3>Login</h3>
      <div class="form">
        <it-input
          v-model="username"
          @input="updateUsername"
          label-top="Username"
          :message="error.username"
          :status="error.username && error.username !== '' ? 'danger' : ''"
        />
        <it-input
          v-model="password"
          @input="updatePassword"
          label-top="Password"
          type="password"
          :message="error.password"
          :status="error.password && error.password !== '' ? 'danger' : ''"
        />
        <it-divider />
      </div>
      <div class="buttons">
        <it-button @click="changeForm()">Signe up Instead </it-button>
        <it-button type="primary" @click="clickLoginUser">Login</it-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { isUndefined } from "lodash"
import { ref } from "vue"
import { singeUpUser, isLoggedIn, loginUser } from "../util/parse"
import {
  usernameCheck,
  emailCheck,
  passwordCheck,
  FormCheckError,
  setError,
  setValid,
  hasNoError,
} from "../util/form"
import { getItem, setItem } from "../util/localstorage"

export default {
  name: "Login",
  setup() {
    // shows SingnUp Modal as Default. not showing any modal in debug
    const showSignUpForm = ref(Boolean(getItem("showSignUpForm")))
    return {
      showSignUpForm,
      email: ref(getItem("email")),
      username: ref(getItem("username")),
      password: ref(""),
      error: ref<{ username?: string; password?: string; email?: string }>({}),
      validateAfterInput: ref(false),
    }
  },
  mounted() {
    // Check if user is logedIn and then redirecting
    if (isLoggedIn()) this.$router.push({ name: "home" })
  },
  methods: {
    changeForm() {
      this.showSignUpForm = !this.showSignUpForm
      setItem("showSignUpForm", this.showSignUpForm ? "true" : "")
    },
    redirectTo(page = "home") {
      this.$router.push({ name: page })
    },
    // Imported Functions
    usernameCheck,
    emailCheck,
    passwordCheck,
    setError,
    setValid,
    hasNoError,
    // Parse Functions
    async registerUser() {
      this.validateAfterInput = true
      if (this.validateForm()) {
        this.validateAfterInput = false
        const isSigndUp = await singeUpUser({
          username: this.username,
          email: this.email,
          password: this.password,
        })
        if (isSigndUp) {
          this.$Message.success({ text: "Successfully Singed Up" })
          this.validateAfterInput = false
          this.redirectTo()
        } else this.$Message.danger({ text: "Error while Singing Up" })
      }
    },
    async clickLoginUser() {
      this.validateAfterInput = true
      if (this.validateForm()) {
        if (await loginUser(this.username, this.password)) {
          this.$Message.success({ text: "Successfully Logged In" })
          this.$store.commit("changeLoginState")
          this.validateAfterInput = false
          this.redirectTo()
        } else this.$Message.danger({ text: "Error while Logging in" })
      }
    },
    updateError(error: FormCheckError) {
      this.error = this.setError(this.error, error)
    },
    updateValid(fieldName: string) {
      this.error = this.setValid(this.error, fieldName)
    },
    validateForm(): boolean {
      // check if all fields are set
      let { username, password, email, showSignUpForm } = this

      // Checking Username
      const usernameCheck: FormCheckError | true = this.usernameCheck(username)
      if (usernameCheck === true) this.updateValid("username")
      else this.updateError(usernameCheck)

      // Checking Email
      const emailCheck: FormCheckError | true = showSignUpForm ? this.emailCheck(email) : true
      if (emailCheck === true) this.updateValid("email")
      else this.updateError(emailCheck.message)

      // Checking Password
      const passwordCheck: FormCheckError | true = this.passwordCheck(password)
      if (passwordCheck === true) this.updateValid("password")
      else this.updateError(passwordCheck)

      return this.hasNoError(this.error)
    },
    // Form -> State functions
    updateEmail(e) {
      const value = e.currentTarget.value
      setItem("email", value)
      this.email = value
      if (this.validateAfterInput) this.validateForm()
    },
    updateUsername(e) {
      const value = e.currentTarget.value
      setItem("username", value)
      this.username = value
      if (this.validateAfterInput) this.validateForm()
    },
    updatePassword(e) {
      const value = e.currentTarget.value
      this.password = value
      if (this.validateAfterInput) this.validateForm()
    },
  },
}
</script>

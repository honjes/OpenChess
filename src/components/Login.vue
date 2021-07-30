<template>
  <it-modal v-model="signUpUser" :closable-mask="closableMask">
    <template #header>
      <h3>Create User Account</h3>
    </template>
    <template #body>
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
      <it-button @click="changeModals()"> Login Instead </it-button>
    </template>
    <template #actions>
      <it-button type="primary" @click="registerUser">Create User</it-button>
    </template>
  </it-modal>
  <it-modal v-model="loggingIn" :closable-mask="closableMask">
    <template #header>
      <h3>Login</h3>
    </template>
    <template #body>
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
      <it-button @click="changeModals()">Signe up Instead </it-button>
    </template>
    <template #actions>
      <it-button type="primary" @click="clickLoginUser">Login</it-button>
    </template>
  </it-modal>
</template>

<script lang="ts">
import { isUndefined } from "lodash"
import { ref } from "vue"
import config from "../config"
import { singeUpUser, getCurrentUser, loginUser } from "../util/parse"
import { getItem, setItem } from "../util/localstorage"

export default {
  name: "Login",
  setup() {
    // shows SingnUp Modal as Default. not showing any modal in debug
    const signUpUser = ref(config.debug ? false : !getCurrentUser())
    const loggingIn = ref(false)
    return {
      signUpUser,
      loggingIn,
      email: ref(getItem("email")),
      username: ref(getItem("username")),
      password: ref(""),
      error: ref<{ username?: string; password?: string; email?: string }>({}),
    }
  },
  async data() {
    // check if user is Logged in
    const isLoggedIn = ref(await getCurrentUser())

    return {
      isLoggedIn,
      validateAfterInput: ref(false),
      closableMask: false,
    }
  },
  methods: {
    changeModals() {
      this.signUpUser = !this.signUpUser
      this.loggingIn = !this.loggingIn
    },
    // Parse Functions
    async registerUser() {
      this.validateAfterInput = true
      if (await this.validateForm()) {
        await singeUpUser({
          username: this.username,
          email: this.email,
          password: this.password,
        })
      }
    },
    async clickLoginUser() {
      this.validateAfterInput = true
      await loginUser(this.username, this.password)
      console.log(`Login User with ${this.username} und ${this.password}`)
    },
    // Validation Functions
    setError(id: string, value: string): false {
      this.error[id] = value
      return false
    },
    setValid(id: string): true {
      if (!isUndefined(this.error[id])) delete this.error[id]
      return true
    },
    /**
     * Checks if any errors are sets
     * @returns {boolean} - returns true if its finds any errors else false
     */
    checkError(): boolean {
      if (!isUndefined(this.error?.username)) return true
      if (!isUndefined(this.error?.password)) return true
      if (!isUndefined(this.error?.email)) return true
      return false
    },
    async validateForm(): Promise<boolean> {
      // check if all fields are set
      let { username, password, email, signUpUser, setError } = this
      // Validates Username
      function usernameCheck(): boolean {
        // Check if Username is set
        const empty = username === ""
        if (empty) return setError("username", "Username needs to be set")

        return true
      }
      // Validates Email
      function emailCheck(): boolean {
        // only check Email if user is trying to singeup
        if (signUpUser) {
          // Check if Email is set
          const empty = email === ""
          if (empty) return setError("email", "Email needs to be set")
        }
        return true
      }
      // Validates Password
      function passwordCheck(): boolean {
        // Check if Password is set
        const empty = password === ""
        if (empty) return setError("password", "Password needs to be set")

        // Check if Password is set
        const short = password.length < 8
        if (short)
          return setError(
            "password",
            "Password needs to be at least 8 characters long"
          )
        return true
      }

      if (usernameCheck()) this.setValid("username")
      if (emailCheck()) this.setValid("email")
      if (passwordCheck()) this.setValid("password")

      return !this.checkError()
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

<style></style>

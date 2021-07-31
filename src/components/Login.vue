<template>
  <it-modal v-model="showSignUpModal" :closable-mask="closableMask">
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
  <it-modal v-model="showLoggingInModal" :closable-mask="closableMask">
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
import { singeUpUser, isLoggedIn, loginUser } from "../util/parse"
import { getItem, setItem } from "../util/localstorage"

export default {
  name: "Login",
  setup() {
    // shows SingnUp Modal as Default. not showing any modal in debug
    const showSignUpModal = ref(config.debug ? false : !isLoggedIn())
    const showLoggingInModal = ref(false)
    return {
      showSignUpModal,
      showLoggingInModal,
      email: ref(getItem("email")),
      username: ref(getItem("username")),
      password: ref(""),
      error: ref<{ username?: string; password?: string; email?: string }>({}),
      closableMask: false,
    }
  },
  async data() {
    // check if user is Logged in
    const logedIn = ref(await isLoggedIn())

    return {
      logedIn,
      validateAfterInput: ref(false),
    }
  },
  methods: {
    changeModals() {
      this.showSignUpModal = !this.showSignUpModal
      this.showLoggingInModal = !this.showLoggingInModal
    },
    vanishModal() {
      this.showSignUpModal = false
      this.showLoggingInModal = false
    },
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
          this.vanishModal()
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
          this.vanishModal()
        } else this.$Message.danger({ text: "Error while Logging in" })
      }
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
    validateForm(): boolean {
      // check if all fields are set
      let { username, password, email, showSignUpModal, setError } = this
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
        if (showSignUpModal) {
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

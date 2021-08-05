<template>
  <div class="oc-email_verification">
    <it-modal v-model="hasNoEmailVerification">
      <template #header>
        <h3>Verify Email Address</h3>
      </template>

      <template #body>
        <p>An Email was send to the Email you saved in your Account.</p>
        <p>Email verification is needed to play Games</p>
      </template>

      <template #actions>
        <it-button type="primary" @click="resendEmail">Resend Email</it-button>
      </template>
    </it-modal>
  </div>
</template>

<script>
import { isVerified } from "../util/parse"
import { ref } from "vue"

export default {
  data() {
    const hasNoEmailVerification = isVerified()
    return {
      hasNoEmailVerification: ref(!hasNoEmailVerification),
    }
  },
  methods: {
    resendEmail() {
      this.$Message.danger({ text: "Resending Email is not Implementet" })
    },
  },
}
</script>

<style></style>

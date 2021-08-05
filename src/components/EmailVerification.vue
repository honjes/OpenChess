<template>
  <div class="oc-email_verification">
    <it-modal v-model="hasNoEmailVerification">
      <template #header>
        <h3>Verify Email Address</h3>
      </template>

      <template #body>
        <p>Modal body. You can put here whatever you want: forms, images, text</p>
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

<template>
  <it-modal class="oc-email_verification" v-model="hasNoEmailVerification">
    <template #header>
      <h3>Verify Email Address</h3>
    </template>

    <template #body>
      <p>An Email was send to the Email you saved in your Account.</p>
      <p>Email verification is needed to play Games</p>
      <br />
    </template>

    <template #actions>
      <p v-if="getTimerPer < 100">
        <Countdown :value="tillNextEmail" @finished="resetResendTimer" /> seconds Couldown
      </p>
      <p v-else>The next mail can be send</p>
      <it-button type="primary" @click="sendEmail" :disabled="getTimerPer < 100">
        Send Email
      </it-button>
    </template>
  </it-modal>
</template>

<script>
import { isVerified, sendVerificationEmail } from "../util/parse"
import { ref } from "vue"
import moment from "moment"
import { getItem } from "../util/localstorage"
import Countdown from "./Countdown.vue"
import config from "../config"

export default {
  setup() {
    const hasNoEmailVerification = !isVerified()

    return {
      hasNoEmailVerification: ref(hasNoEmailVerification),
      lastEmailSend: ref(0),
    }
  },
  mounted() {
    this.lastEmailSend = this.getLastEmaiSend()
  },
  computed: {
    getTimerPer() {
      const secondsToGo = config.email_resend_delay_sec - this.lastEmailSend
      if (secondsToGo <= 0) return 100
      const per = (config.email_resend_delay_sec / 100) * secondsToGo

      return Math.round(per)
    },
    tillNextEmail() {
      return config.email_resend_delay_sec - this.lastEmailSend
    },
  },
  methods: {
    async sendEmail() {
      if (this.hasNoEmailVerification) {
        const emailSend = await sendVerificationEmail()
        this.resetResendTimer()
        if (emailSend) this.$Message.success({ text: "Email was successfully sent" })
        else this.$Message.danger({ text: "Error while sending the Email" })
      }
    },
    getLastEmaiSend() {
      return moment().diff(getItem("lastEmailSend"), "seconds")
    },
    resetResendTimer() {
      this.lastEmailSend = this.getLastEmaiSend()
    },
  },
  components: {
    Countdown,
  },
}
</script>

<style lang="scss">
.oc-email_verification {
  .it-modal-footer {
    justify-content: space-between;
  }
}
</style>

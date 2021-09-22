import _ from "lodash"

interface OCConfig {
  debug: boolean
  back4app_url: string
  back4app_applicationId: string
  back4app_javascriptKey: string
  back4app_livequeryurl: string
  sentry_dns: string
  parse_secret: string
  email_resend_delay_sec: number
  [index: string]: string | number | boolean
}

const { parse_secret, SENTRY_DSN } = process.env

const config: OCConfig = {
  debug: false, // Disables Accounts and all connections to the server
  back4app_url: "https://parseapi.back4app.com/",
  back4app_applicationId: "N1auF9Z0lGlmaLOkzKLCsnJbBpOPJvzroxfqTuRT",
  back4app_javascriptKey: "ZMmQSzeaetTcBLAy5F1UeTd6yYGu5EzNRU3fHnOY",
  back4app_livequeryurl: "wss://chess.b4a.io",
  sentry_dns: _.isUndefined(SENTRY_DSN) ? "" : SENTRY_DSN,
  parse_secret: _.isUndefined(parse_secret) ? "localhostSecret" : parse_secret,
  email_resend_delay_sec: 60,
}

export default config

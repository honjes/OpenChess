interface OCConfig {
  debug: boolean
  back4app_url: string
  back4app_applicationId: string
  back4app_javascriptKey: string
  back4app_livequeryurl: string
  parse_secret: string
  email_resend_delay_sec: number
  [index: string]: string | number | boolean
}

const config: OCConfig = {
  debug: false, // Disables Accounts and all connections to the server
  back4app_url: "https://parseapi.back4app.com/",
  back4app_applicationId: "N1auF9Z0lGlmaLOkzKLCsnJbBpOPJvzroxfqTuRT",
  back4app_javascriptKey: "ZMmQSzeaetTcBLAy5F1UeTd6yYGu5EzNRU3fHnOY",
  back4app_livequeryurl: "wss://chess.b4a.io",
  parse_secret: "87zzbsdf/($%)=awdat5t51",
  email_resend_delay_sec: 60,
}

export default config

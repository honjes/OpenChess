import { createApp, defineAsyncComponent } from "vue"
import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router"
import App from "./App.vue"
import Equal from "equal-vue"
import "equal-vue/dist/style.css"
import "bootstrap/dist/css/bootstrap-grid.css"
import "./static/scss/index.scss"
import {
  getParseStoreObject,
  getCurrentUser,
  initaliseParse,
  isLoggedIn as parseIsLoggedIn,
  isLoggedIn,
  emailIsVerified,
  ParseObject,
} from "./util/parse"
import { createStore } from "vuex"
import config from "./config"
import * as Sentry from "@sentry/vue"
import { Integrations } from "@sentry/tracing"

const routes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
  {
    path: "/",
    name: "home",
    component: defineAsyncComponent(() => import("./pages/home.vue")),
  },
  {
    path: "/login",
    name: "login",
    component: defineAsyncComponent(() => import("./pages/login.vue")),
  },
  {
    path: "/user",
    name: "user",
    component: defineAsyncComponent(() => import("./pages/user.vue")),
  },
  {
    path: "/game/:gameId",
    name: "game",
    component: defineAsyncComponent(() => import("./pages/game.vue")),
  },
]

if (config.debug)
  routes.push({
    path: "/playground",
    name: "playground",
    component: defineAsyncComponent(() => import("./pages/playground.vue")),
  })

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export interface StoreInterface {
  isLoggedIn: boolean
  user: StoreCurrentUserInterface
  parseObjects: {
    Game: any
  }
  windowWith: number
  config: {
    debug: boolean
  }
}

export interface StoreCurrentUserInterface {
  id: string
  username: string
  color: string
  email: string
  emailIsVerified: boolean
  friends: any[]
}

export interface StoreParseObject {
  Game: ParseObject
}

function getCurrentUserObject(): StoreCurrentUserInterface {
  let returnUser: StoreCurrentUserInterface = {
    id: "",
    username: "",
    color: "",
    email: "",
    emailIsVerified: false,
    friends: [],
  }
  const isLoggedIn = parseIsLoggedIn()

  if (isLoggedIn) {
    const currentUser = getCurrentUser()
    if (currentUser) {
      returnUser = {
        id: currentUser.id,
        username: currentUser.getUsername(),
        color: String(currentUser.get("color")),
        email: String(currentUser.get("email")),
        friends: currentUser.get("friends"),
        emailIsVerified: emailIsVerified(),
      }
    }
  }
  return returnUser
}

initaliseParse()
const store = createStore({
  state(): StoreInterface {
    const isLoggedIn = parseIsLoggedIn(router)
    const parseStoreObject = getParseStoreObject()
    let parseUser = getCurrentUserObject()

    return {
      isLoggedIn,
      user: parseUser,
      parseObjects: parseStoreObject,
      windowWith: window.innerWidth,
      config: {
        debug: config.debug,
      },
    }
  },
  mutations: {
    /**
     * Changes the LoginState to the oppisite of before
     * and sets the current userId if user is Logged in
     */
    changeLoginState(state: StoreInterface) {
      const isLoggedIn = parseIsLoggedIn()
      state.isLoggedIn = isLoggedIn

      // If user is now logged in set currentUserObject
      if (isLoggedIn) state.user = getCurrentUserObject()
    },
    refreshWindowSize(state: StoreInterface) {
      state.windowWith = window.innerWidth
    },
    updateCurrentUser(state: StoreInterface) {
      if (state.isLoggedIn) {
        state.user = getCurrentUserObject()
      }
    },
  },
})
const app = createApp(App)

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    app,
    dsn: "https://b5b860a1767043b9a39ec5e788ccf582@o497145.ingest.sentry.io/5963248",
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ["localhost", "my-site-url.com", /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}

app.use(Equal).use(store).use(router).mount("#app")

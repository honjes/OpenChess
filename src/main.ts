import { createApp, defineAsyncComponent } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import App from "./App.vue"
import Equal from "equal-vue"
import "equal-vue/dist/style.css"
import "bootstrap/dist/css/bootstrap-grid.css"
import "./static/scss/index.scss"
import {
  getParseObjects,
  getCurrentUser,
  initaliseParse,
  isLoggedIn as parseIsLoggedIn,
  isLoggedIn,
  emailIsVerified,
} from "./util/parse"
import { createStore } from "vuex"
import config from "./config"

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
  ],
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
    const parseObjects = getParseObjects()
    let parseUser = getCurrentUserObject()

    return {
      isLoggedIn,
      user: parseUser,
      parseObjects,
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

createApp(App).use(Equal).use(store).use(router).mount("#app")

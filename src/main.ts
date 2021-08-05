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
} from "./util/parse"
import { createStore } from "vuex"
import config from "./config"

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
  user: {
    id: string
    username: string
    color: string
  }
  parseObjects: {
    Game: any
  }
  windowWith: number
  config: {
    debug: boolean
  }
}

initaliseParse()
const store = createStore({
  state(): StoreInterface {
    const isLoggedIn = parseIsLoggedIn()
    const parseObjects = getParseObjects()
    let parseUser = { id: "", username: "", color: "" }
    if (isLoggedIn) {
      const currentUser = getCurrentUser()
      if (currentUser) {
        parseUser = {
          id: currentUser.id,
          username: currentUser.getUsername(),
          color: currentUser.get("color"),
        }
      }
    }

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
      const { isLoggedIn } = state
      const currentUser = getCurrentUser()
      state.isLoggedIn = !isLoggedIn

      // If user is now logged in set current user.id
      if (currentUser !== false) state.user.id = currentUser.id
      else state.user.id = ""
    },
    refreshWindowSize(state) {
      state.windowWith = window.innerWidth
    },
  },
})

createApp(App).use(Equal).use(store).use(router).mount("#app")

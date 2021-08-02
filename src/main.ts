import { createApp, defineAsyncComponent } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import App from "./App.vue"
import Equal from "equal-vue"
import "equal-vue/dist/style.css"
import "bootstrap/dist/css/bootstrap-grid.css"
import "./static/scss/index.scss"
import {
  getParseObjects,
  getUser,
  initaliseParse,
  isLoggedIn as parseIsLoggedIn,
} from "./util/parse"
import { createStore } from "vuex"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: defineAsyncComponent(() => import("./pages/Home.vue")),
    },
    {
      path: "/login",
      name: "login",
      component: defineAsyncComponent(() => import("./pages/Login.vue")),
    },
  ],
})

export interface StoreInterface {
  isLoggedIn: boolean
  user: {
    id: string
    username: string
  }
  parseObjects: {
    Game: any
  }
}

initaliseParse()
const store = createStore({
  state(): StoreInterface {
    const isLoggedIn = parseIsLoggedIn()
    const parseObjects = getParseObjects()
    const parseUser = getUser()

    return {
      isLoggedIn,
      user: {
        id: parseUser.id,
        username: parseUser.getUsername(),
      },
      parseObjects,
    }
  },
  mutations: {
    /**
     * Changes the LoginState to the oppisite of before
     * and sets the current userId if user is Logged in
     */
    changeLoginState(state: StoreInterface) {
      const { isLoggedIn } = state
      state.isLoggedIn = !isLoggedIn

      // If user is now logged in set current user.id
      if (isLoggedIn) state.user.id = getUser().id
      else state.user.id = ""
    },
  },
})

createApp(App).use(Equal).use(store).use(router).mount("#app")

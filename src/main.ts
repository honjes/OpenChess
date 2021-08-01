import { createApp, defineAsyncComponent } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import App from "./App.vue"
import Equal from "equal-vue"
import "equal-vue/dist/style.css"
import "./static/scss/index.scss"
import {
  getParseObjects,
  getUserId,
  initaliseParse,
  isLoggedIn as parseIsLoggedIn,
} from "./util/parse"
import { createStore } from "vuex"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: defineAsyncComponent(() => import("./pages/home.vue")),
    },
  ],
})

export interface StoreInterface {
  isLoggedIn: boolean
  userId: string
  parseObjects: {
    Game: any
  }
}

initaliseParse()
const store = createStore({
  state(): StoreInterface {
    const isLoggedIn = parseIsLoggedIn()
    const parseObjects = getParseObjects()
    return {
      isLoggedIn,
      userId: isLoggedIn ? "UserId" : "",
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

      // If user is now logged in set current userId
      if (isLoggedIn) {
        const userId = getUserId()
        state.userId = userId ? userId : ""
      } else state.userId = ""
    },
  },
})

createApp(App).use(Equal).use(store).use(router).mount("#app")

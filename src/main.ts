import { createApp, defineAsyncComponent } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import App from "./App.vue"
import Equal from "equal-vue"
import "equal-vue/dist/style.css"
import "./static/scss/index.scss"
import {
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
}

initaliseParse()
const store = createStore({
  state(): StoreInterface {
    const isLoggedIn = parseIsLoggedIn()
    return {
      isLoggedIn,
      userId: isLoggedIn ? "UserId" : "",
    }
  },
  mutations: {
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

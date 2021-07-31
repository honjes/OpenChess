import { createApp, defineAsyncComponent } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import App from "./App.vue"
import Equal from "equal-vue"
import "equal-vue/dist/style.css"
import "./static/scss/index.scss"
import { initaliseParse, isLoggedIn as parseIsLoggedIn } from "./util/parse"
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

initaliseParse()
const store = createStore({
  state() {
    return {
      isLoggedIn: parseIsLoggedIn(),
    }
  },
  mutations: {
    changeLoginState(state) {
      state.isLoggedIn = !state.isLoggedIn
    },
  },
})

createApp(App).use(Equal).use(store).use(router).mount("#app")

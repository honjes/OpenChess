import { createApp, defineAsyncComponent } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import App from "./App.vue"
import Equal from "equal-vue"
import "equal-vue/dist/style.css"
import "./index.css"
import { initaliseParse } from "./util/parse"

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
createApp(App).use(Equal).use(router).mount("#app")

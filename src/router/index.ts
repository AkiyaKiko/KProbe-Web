import { createRouter, createWebHistory } from "vue-router"
import VisualScreen from "@/views/VisualScreen.vue"
import DetailScreen from "@/views/DetailScreen.vue"
import Settings from "@/views/Settings.vue"
import { useServerDetailStore } from "@/stores/serverDetailStore"
import { usePreload } from "@/stores/preLoad"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/visual" },
    {
      path: "/visual",
      component: VisualScreen,
      beforeEnter: async (to, from, next) => {
        console.log("Router Guard: 开始预加载服务器数据...")
        const store = useServerDetailStore()
        const storepre = usePreload()
        if (!storepre.preload) {
          storepre.preload = true
          await store.preloadAllData()
          console.log("Router Guard: 数据加载完成，继续导航。")
          next()
        } else {
          console.log("Router Guard: 数据已加载，继续导航。")
          next()
        }
      },
    },
    { path: "/detail", component: DetailScreen },
    { path: "/settings", component: Settings },
  ],
})

export default router

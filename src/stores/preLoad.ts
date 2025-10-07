import { defineStore } from "pinia"
import { ref } from "vue"

export const usePreload = defineStore("preload", () => {
  const preload = ref(false)
  return { preload }
})

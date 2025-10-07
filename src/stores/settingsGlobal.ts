import { defineStore } from "pinia"
import { ref } from "vue"

export const useSettingsGlobal = defineStore("settings", () => {
  const INTERVAL_MS = ref(1000)
  const MAX_POINTS = ref(600)
  return { INTERVAL_MS, MAX_POINTS }
})

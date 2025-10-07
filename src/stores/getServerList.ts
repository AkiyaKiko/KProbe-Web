import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"
import type { serverList } from "@/types/serverListType"

export const useGetServerList = defineStore("getServerList", () => {
  // State
  let list = ref<serverList>()
  let loading = ref<boolean>(true)

  // Action
  async function fetchServerList() {
    try {
      const res = await axios.get("/api/server/list")
      if (res.data.code === 200) {
        const data = res.data.data
        list.value = data
      }
    } catch (e) {
      console.error(`@@@From Pinia: Failed to fetch data`, e)
    } finally {
      loading.value = false
    }
  }

  return { list, loading, fetchServerList }
})

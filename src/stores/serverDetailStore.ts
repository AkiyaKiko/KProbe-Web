import { defineStore } from "pinia"
import { computed, ref } from "vue"
import axios from "axios"
import { useGetServerList } from "./getServerList"
import type {
  serverDataStoreStructure,
  apiResponse,
  serverSys,
  dynamicStatus,
} from "@/types/serverDetailType"

/* Cache-First */
export const useServerDetailStore = defineStore("serverDetailStore", () => {
  const serverData = ref<serverDataStoreStructure>(
    {} as serverDataStoreStructure
  )

  // State
  const systemDefault: serverSys = { os: "unknown", arch: "unknown" }
  const statusDefault: dynamicStatus = {
    cpu: 0,
    mem: 0,
    disk: 0,
    upload: 0,
    download: 0,
    online: false,
  }

  // Getter
  // only one which can return ref obj
  const getDetailData = computed(() => {
    return (id: string) => {
      return serverData.value[id]
    }
  })

  const getServerNum = computed(() => {
    console.log("AAA HIT")
    console.log(serverData.value)
    return Object.keys(serverData.value).length
  })

  const getOnlineNum = computed(() => {
    console.log("BBB HIT")
    let count = 0
    for (const id in serverData.value) {
      if (serverData.value[id]?.status.online) {
        count++
      }
    }
    return count
  })

  // Action
  // init return boolean to deal with loading
  async function init(id: string) {
    // Check Cache
    if (serverData.value[id]) {
      console.log("Cache Hit")
      return false
    }

    // Init Request
    // Initialize obj
    serverData.value[id] = {
      system: systemDefault,
      status: statusDefault,
    }

    try {
      const res = await axios.get<apiResponse>(`/api/server/detail?id=${id}`)
      if (res.data.code === 200 && res.data.data) {
        const dataGot = res.data.data

        // Update All fields
        serverData.value[id] = {
          system: dataGot.system,
          status: dataGot.status,
        }
      }
    } catch (error) {
      console.error(`Failed to initialize data for ID ${id}:`, error)
      return true
    } finally {
      return false
    }
  }

  async function updateStatusData(id: string) {
    // Confirm this action is called behind intialization
    if (!serverData.value[id]) {
      console.warn(
        `Polling called before initialization for ID ${id}. Initializing now.`
      )
      await init(id)
      return
    }

    try {
      // Only Update Status
      const res = await axios.get<apiResponse>(`/api/server/detail?id=${id}`)

      if (res.data.code === 200 && res.data.data) {
        const statusGot = res.data.data.status
        serverData.value[id].status = statusGot
      }
    } catch (error) {
      console.error(`Polling failed for ID ${id}:`, error)
      // Polling Failed and Change Online-Status to False
      if (serverData.value[id]) {
        serverData.value[id].status.online = false
      }
    }
  }

  async function preloadAllData() {
    const serverListStore = useGetServerList()
    await serverListStore.fetchServerList()

    const serverIdArray = Array.isArray(serverListStore.list?.list)
      ? serverListStore.list.list
      : []

    const serverIds = serverIdArray.map((item) => item.id)

    if (serverIds.length === 0) {
      console.warn("没有服务器 ID 可供预加载。")
      return
    }

    console.log(`开始并发预加载 ${serverIds.length} 个服务器数据...`)

    const loadingPromises = serverIds.map((id) => init(id))

    await Promise.all(loadingPromises)

    console.log("所有服务器详细数据预加载完成。")
  }
  return {
    init,
    updateStatusData,
    preloadAllData,
    getDetailData,
    getServerNum,
    getOnlineNum,
  }
})

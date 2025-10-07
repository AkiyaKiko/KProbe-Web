<!-- 封装插槽 -->
<script setup lang="ts">
import { ref, onUnmounted, onBeforeMount, computed } from "vue"
import Card from "./Card.vue"
import SysIcon from "./SysIcon.vue"
import onlineIcon from "@/assets/icon/online.svg"
import offlineIcon from "@/assets/icon/offline.svg"
import { useServerDetailStore } from "@/stores/serverDetailStore"
import { useSettingsGlobal } from "@/stores/settingsGlobal"
import type { serverDataStoreStructure } from "@/types/serverDetailType"

/*
  接收props
  只需要包含id的对象
  本组将会通过props传入的id，调用接口对每个卡片（服务器）的详情数据进行查询
*/

// Data
const props = defineProps(["id"])
const store = useServerDetailStore()
const storeSettings = useSettingsGlobal()
const loading = ref(true)

loading.value = await store.init(props.id)

const serverDetail = computed(() => {
  return store.getDetailData(props.id)
}) as unknown as serverDataStoreStructure[string]
let intervalId: number = 0

// Function
function getColor(usage: number) {
  if (usage < 70) return "bg-blue-400"
  else if (usage < 90) return "bg-yellow-400"
  else return "bg-red-400"
}

function getConversion(value: number) {
  if (value < 1024) {
    return value.toFixed(2) + " Kbps"
  } else if (value < 1024 * 1024) {
    return (value / 1024).toFixed(2) + " Mbps"
  } else {
    return (value / (1024 * 1024)).toFixed(2) + " Gbps"
  }
}

// Lifecycle
onBeforeMount(() => {
  intervalId = setInterval(
    () => store.updateStatusData(props.id),
    storeSettings.INTERVAL_MS
  )
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <!-- 小屏幕一行一个，大屏幕一行四个 -->
  <div class="w-full p-1">
    <Card>
      <template v-slot:content>
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center h-full text-gray-500"
        >
          <svg
            class="animate-spin h-6 w-6 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>

          <span class="mt-3">Loading Server Data...</span>
        </div>
        <div class="flex flex-col gap-3 h-full w-full" v-if="!loading">
          <!-- System & State -->
          <div class="w-full flex flex-row justify-between items-center">
            <SysIcon :system="serverDetail?.system" />
            <div class="flex flex-row items-center gap-1">
              <span class="text-sm">{{
                serverDetail?.status.online ? "Online" : "Offline"
              }}</span>
              <img
                :src="serverDetail?.status.online ? onlineIcon : offlineIcon"
                class="w-10"
              />
            </div>
          </div>
          <!-- CPU  -->
          <div class="flex flex-row gap-3 items-center">
            <span class="w-1/4">CPU</span>
            <div class="custom-progress-bar-track">
              <div
                class="custom-progress-value"
                :class="getColor(serverDetail?.status?.cpu ?? 0)"
                :style="{ width: serverDetail?.status.cpu + '%' }"
              ></div>
            </div>
            <div>{{ serverDetail?.status.cpu.toFixed(1) + "%" }}</div>
          </div>
          <!-- Mem -->
          <div class="flex flex-row gap-3 items-center">
            <span class="w-1/4">内存</span>
            <div class="custom-progress-bar-track">
              <div
                class="custom-progress-value"
                :class="getColor(serverDetail?.status.mem ?? 0)"
                :style="{ width: serverDetail?.status.mem + '%' }"
              ></div>
            </div>
            <div>{{ serverDetail?.status.mem.toFixed(1) + "%" }}</div>
          </div>
          <!-- Disk -->
          <div class="flex flex-row gap-3 items-center">
            <span class="w-1/4">硬盘</span>
            <div class="custom-progress-bar-track">
              <div
                class="custom-progress-value"
                :class="getColor(serverDetail?.status.disk ?? 0)"
                :style="{ width: serverDetail?.status.disk + '%' }"
              ></div>
            </div>
            <div>{{ serverDetail?.status.disk.toFixed(1) + "%" }}</div>
          </div>
          <!-- IO -->
          <div class="flex flex-row place-content-start items-baseline gap-4">
            <span>网络IO</span>
            <img class="w-7 col-span-1" src="@/assets/icon/up.svg" />
            <span class="text-sm col-span-1">{{
              getConversion(serverDetail?.status.upload ?? 0)
            }}</span>
            <img class="w-7 col-span-1" src="@/assets/icon/down.svg" />
            <span class="text-sm col-span-1">{{
              getConversion(serverDetail?.status.download ?? 0)
            }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>

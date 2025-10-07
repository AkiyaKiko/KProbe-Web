<script setup lang="ts">
import { useSettingsGlobal } from "@/stores/settingsGlobal"
import { computed } from "vue"

// 取全局 store
const store = useSettingsGlobal()

// 可选项定义
const intervalOptions = [
  { label: "0.5 秒", value: 500 },
  { label: "1 秒", value: 1000 },
  { label: "2 秒", value: 2000 },
  { label: "5 秒", value: 5000 },
]

const maxPointOptions = [
  { label: "最近 1 分钟 (60点)", value: 60 },
  { label: "最近 5 分钟 (300点)", value: 300 },
  { label: "最近 10 分钟 (600点)", value: 600 },
  { label: "最近 30 分钟 (1800点)", value: 1800 },
]

// 计算属性包装，让下拉框能双向绑定
const interval = computed({
  get: () => store.INTERVAL_MS,
  set: (val) => (store.INTERVAL_MS = val),
})

const maxPoints = computed({
  get: () => store.MAX_POINTS,
  set: (val) => (store.MAX_POINTS = val),
})
</script>

<template>
  <div class="p-4 bg-white rounded-2xl shadow-md flex flex-col gap-4 w-80">
    <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">
      ⚙️ 实时刷新设置
    </h3>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-600">刷新间隔</label>
      <select
        v-model="interval"
        class="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400"
      >
        <option
          v-for="opt in intervalOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-600">保留数据点数</label>
      <select
        v-model="maxPoints"
        class="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-400"
      >
        <option
          v-for="opt in maxPointOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="text-xs text-gray-500 mt-2">
      当前设置：间隔 {{ interval }} ms，最大 {{ maxPoints }} 点
    </div>
  </div>
</template>

<style scoped></style>

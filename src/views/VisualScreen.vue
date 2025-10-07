<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue"
import Card from "@/components/Card.vue"
import { useSettingsGlobal } from "@/stores/settingsGlobal"
import * as echarts from "echarts/core"
import { LineChart } from "echarts/charts"
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkPointComponent,
  MarkLineComponent,
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import { useServerDetailStore } from "@/stores/serverDetailStore"

const storeSettings = useSettingsGlobal()
const INTERVAL_MS = storeSettings.INTERVAL_MS
const MAX_POINTS = storeSettings.MAX_POINTS

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkPointComponent,
  MarkLineComponent,
  LineChart,
  CanvasRenderer,
])

const store = useServerDetailStore()
const totalServer = store.getServerNum
const onlineServer = store.getOnlineNum

// --- 日志部分（保留你原来的） ---
const logs = ref([
  "[12:00:01 INFO] Cluster initialization started.",
  "[12:00:02 SUCCESS] Node 'sv-001' connected and ready.",
  "[12:00:03 SUCCESS] Node 'sv-002' connected and ready.",
  "[12:00:04 WARNING] Node 'sv-010' has high memory usage (95%).",
  "[12:00:05 INFO] Monitoring CPU utilization across 99 nodes.",
  "[12:00:06 SUCCESS] Data replication service initialized.",
  "[12:00:07 ERROR] Connection timeout for external API.",
  "[12:00:08 INFO] Automatic load balancing in progress...",
  "[12:00:09 SUCCESS] All nodes reporting stable status.",
])

// --- Chart refs ---
const cpuChartRef = ref<HTMLDivElement | null>(null)
const memChartRef = ref<HTMLDivElement | null>(null)
const netChartRef = ref<HTMLDivElement | null>(null)
const diskChartRef = ref<HTMLDivElement | null>(null)

let cpuChart: echarts.ECharts | null = null
let memChart: echarts.ECharts | null = null
let netChart: echarts.ECharts | null = null
let diskChart: echarts.ECharts | null = null

// const INTERVAL_MS = 1000 // 每次推入数据间隔（毫秒）
// const MAX_POINTS = 60 // 保留点数（例如 600 = 最近 10 分钟 @ 1s）

// 初始化每个图的数据数组（x 时间字符串，y 数值）
function createSeriesData(initialCount = 60, base = 50, variance = 10) {
  const xs: string[] = []
  const ys: number[] = []
  const now = Date.now()
  for (let i = initialCount - 1; i >= 0; i--) {
    const t = new Date(now - i * INTERVAL_MS)
    xs.push(formatTime(t))
    ys.push(base + (Math.random() - 0.5) * variance)
  }
  return { xs, ys }
}

function formatTime(d: Date) {
  return (
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0") +
    ":" +
    d.getSeconds().toString().padStart(2, "0")
  )
}

// 各图初始数据（设置不同基线与波动）
const cpu = createSeriesData(60, 35, 25) // CPU %
const mem = createSeriesData(60, 60, 20) // Memory %
const net = createSeriesData(60, 200, 120) // Network I/O (KB/s)
const disk = createSeriesData(60, 100, 80) // Disk I/O (KB/s)

// ECharts 基础 option 生成器（避免重复）
function baseTimeSeriesOption(
  title: string,
  unit: string,
  xs: string[],
  ys: number[]
) {
  return {
    title: {
      text: title,
      left: 8,
      top: 6,
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      formatter: function (params: any) {
        const p = params[0]
        return `${p.axisValueLabel}<br/>${p.seriesName}: ${Number(
          p.data
        ).toFixed(2)} ${unit}`
      },
    },
    grid: { left: 40, right: 16, top: 38, bottom: 24 },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xs,
      axisLabel: { fontSize: 10 },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: `{value} ${unit}`,
        fontSize: 10,
      },
      splitLine: { show: true },
    },
    series: [
      {
        name: title,
        type: "line",
        smooth: true,
        showSymbol: false,
        data: ys,
        areaStyle: { opacity: 0.08 },
        lineStyle: { width: 2 },
        animationDuration: 500,
      },
    ],
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
        dataZoom: { yAxisIndex: "none" },
        restore: {},
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
    ],
  }
}

// 推新数据的 helper（保持数组长度上限）
function pushNewPoint(xs: string[], ys: number[], value: number) {
  xs.push(formatTime(new Date()))
  ys.push(value)
  if (xs.length > MAX_POINTS) {
    xs.shift()
    ys.shift()
  }
}

// 定时器 id
const timers: number[] = []

onMounted(async () => {
  // Wait DOM
  await nextTick()

  // init charts
  if (cpuChartRef.value) cpuChart = echarts.init(cpuChartRef.value)
  if (memChartRef.value) memChart = echarts.init(memChartRef.value)
  if (netChartRef.value) netChart = echarts.init(netChartRef.value)
  if (diskChartRef.value) diskChart = echarts.init(diskChartRef.value)

  cpuChart?.setOption(baseTimeSeriesOption("CPU 使用率", "%", cpu.xs, cpu.ys))
  memChart?.setOption(baseTimeSeriesOption("内存使用率", "%", mem.xs, mem.ys))
  netChart?.setOption(
    baseTimeSeriesOption("网络 I/O (上行+下行)", "KB/s", net.xs, net.ys)
  )
  diskChart?.setOption(
    baseTimeSeriesOption("磁盘 I/O (读/写)", "KB/s", disk.xs, disk.ys)
  )

  // 定时推入随机数据：这里模拟合理范围，实际可替换为后端推送
  timers.push(
    window.setInterval(() => {
      // CPU: 0-100
      const nextCpu = clamp(
        cpu.ys[cpu.ys.length - 1]! + (Math.random() - 0.5) * 8,
        0,
        100
      )
      pushNewPoint(cpu.xs, cpu.ys, nextCpu)
      cpuChart?.setOption({
        xAxis: { data: cpu.xs },
        series: [{ data: cpu.ys }],
      })
    }, INTERVAL_MS)
  )

  timers.push(
    window.setInterval(() => {
      // Memory: 0-100
      const nextMem = clamp(
        mem.ys[mem.ys.length - 1]! + (Math.random() - 0.5) * 6,
        0,
        100
      )
      pushNewPoint(mem.xs, mem.ys, nextMem)
      memChart?.setOption({
        xAxis: { data: mem.xs },
        series: [{ data: mem.ys }],
      })
    }, INTERVAL_MS)
  )

  timers.push(
    window.setInterval(() => {
      // Network I/O: 保持正值，容易波动
      const nextNet = Math.max(
        0,
        net.ys[net.ys.length - 1]! + (Math.random() - 0.4) * 80
      )
      pushNewPoint(net.xs, net.ys, nextNet)
      netChart?.setOption({
        xAxis: { data: net.xs },
        series: [{ data: net.ys }],
      })
    }, INTERVAL_MS)
  )

  timers.push(
    window.setInterval(() => {
      // Disk I/O
      const nextDisk = Math.max(
        0,
        disk.ys[disk.ys.length - 1]! + (Math.random() - 0.5) * 60
      )
      pushNewPoint(disk.xs, disk.ys, nextDisk)
      diskChart?.setOption({
        xAxis: { data: disk.xs },
        series: [{ data: disk.ys }],
      })
    }, INTERVAL_MS)
  )

  // resize on window change
  const onResize = () => {
    cpuChart?.resize()
    memChart?.resize()
    netChart?.resize()
    diskChart?.resize()
  }
  window.addEventListener("resize", onResize)

  // 把 resize 清理也推入 timers 长度里（用 onUnmounted 清理）
  timers.push(-1) // 占位，真实清理在 onUnmounted 处理
})

onUnmounted(() => {
  // 清除 intervals
  timers.forEach((id) => {
    if (id > 0) window.clearInterval(id)
  })
  // dispose charts
  cpuChart?.dispose()
  memChart?.dispose()
  netChart?.dispose()
  diskChart?.dispose()

  // remove resize listener (防止没移除的情况)
  try {
    window.removeEventListener("resize", () => {
      cpuChart?.resize()
      memChart?.resize()
      netChart?.resize()
      diskChart?.resize()
    })
  } catch (e) {
    // ignore
  }
})

// 辅助函数
function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4 h-full p-4 bg-gray-50">
    <div class="col-span-12 lg:col-span-3 flex flex-col gap-4">
      <h2 class="text-xl font-bold text-gray-700 mb-2">集群概览</h2>

      <div class="grid grid-cols-2 gap-4">
        <Card class="h-28">
          <div class="flex flex-col justify-center items-center h-full">
            <span class="text-3xl font-extrabold text-blue-600"
              >{{ onlineServer }}/{{ totalServer }}</span
            >
            <span class="text-sm text-gray-500 mt-1">就绪服务器</span>
          </div>
        </Card>
        <Card class="h-28">
          <div class="flex flex-col justify-center items-center h-full">
            <span class="text-3xl font-extrabold text-green-600">
              {{
                totalServer > 0
                  ? ((onlineServer / totalServer) * 100).toFixed(1) + "%"
                  : "0.0%"
              }}
            </span>
            <span class="text-sm text-gray-500 mt-1">集群在线率</span>
          </div>
        </Card>
      </div>

      <Card class="p-1">
        <template v-slot:content>
          <h3
            class="text-lg font-mono text-green-400 border-b border-gray-700 pb-2 mb-2"
          >
            > Cluster Live Log
          </h3>
          <div
            class="h-full overflow-y-auto font-mono text-xs leading-relaxed bg-gray-700 p-4 m-2 rounded-2xl"
            style="scrollbar-width: none"
          >
            <div
              v-for="(log, index) in logs"
              :key="index"
              :class="{
                'text-green-400': log.includes('SUCCESS'),
                'text-yellow-400': log.includes('WARNING'),
                'text-red-500': log.includes('ERROR'),
                'text-gray-300': log.includes('INFO'),
              }"
            >
              {{ log }}
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="col-span-12 lg:col-span-9 flex flex-col gap-4">
      <h2 class="text-xl font-bold text-gray-700 mb-2">资源使用趋势</h2>

      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
        <Card class="h-full">
          <template v-slot:content>
            <h3 class="text-lg font-semibold">CPU 使用率趋势</h3>
            <div ref="cpuChartRef" class="h-[calc(100%-2rem)] w-full"></div>
          </template>
        </Card>

        <Card class="h-full">
          <template v-slot:content>
            <h3 class="text-lg font-semibold">内存使用率趋势</h3>
            <div ref="memChartRef" class="h-[calc(100%-2rem)] w-full"></div>
          </template>
        </Card>
      </div>

      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
        <Card class="h-full">
          <template v-slot:content>
            <h3 class="text-lg font-semibold">网络 I/O 监控</h3>
            <div ref="netChartRef" class="h-[calc(100%-2rem)] w-full"></div>
          </template>
        </Card>

        <Card class="h-full">
          <template v-slot:content>
            <h3 class="text-lg font-semibold">磁盘 I/O 监控</h3>
            <div ref="diskChartRef" class="h-[calc(100%-2rem)] w-full"></div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

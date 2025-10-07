<script setup lang="ts">
import type { serverSys } from "@/types/serverDetailType"

const props = defineProps<{
  system?: serverSys // 注意：可能是 undefined，因为用了 ?.
}>()

// 安全解构（可选链或默认值）
const os = props.system?.os ?? "unknown"
const arch = props.system?.arch ?? "unknown"
console.log(os, arch)
</script>

<template>
  <div class="flex flex-row place-content-evenly gap-2">
    <!-- OS Icon -->
    <div id="os" class="w-10">
      <div v-if="os === 'win'">
        <img src="@/assets/icon/windows.svg" />
      </div>
      <div v-else-if="os === 'linux'">
        <img src="@/assets/icon/linux.svg" />
      </div>
      <div v-else-if="os === 'mac'">
        <img src="@/assets/icon/apple.svg" />
      </div>
      <div v-else>
        <img src="@/assets/icon/unknown.svg" />
      </div>
    </div>

    <!-- Architecture -->
    <div id="arch" class="w-10">
      <div v-if="arch === 'x86'">
        <img src="@/assets/icon/x86.svg" />
      </div>
      <div v-else-if="arch === 'arm'">
        <img src="@/assets/icon/arm.svg" />
      </div>
      <div v-else-if="arch === 'risc-v'">
        <img src="@/assets/icon/riscv.svg" />
      </div>
      <div v-else>
        <img src="@/assets/icon/unknown.svg" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

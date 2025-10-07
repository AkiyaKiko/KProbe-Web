<script setup lang="ts">
defineSlots<{
  default?: () => void
  content?: () => void
}>()
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-xl overflow-hidden p-4 h-full font-mono"
  >
    <slot></slot>
    <slot name="content"></slot>
  </div>
</template>

<style scoped></style>

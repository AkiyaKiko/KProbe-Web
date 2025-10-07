<script setup>
import DetailCard from "@/components/DetailCard.vue"
import { useGetServerList } from "@/stores/getServerList"
import { usePreload } from "@/stores/preLoad"
import { storeToRefs } from "pinia"

// Pinia
const store = useGetServerList()
const storepre = usePreload()
if (!storepre.preload) {
  store.fetchServerList()
  storepre.preload = true
  console.log(store.list)
  console.log("!!! Direct to Here")
}
const { list, loading } = storeToRefs(store) // state & action
console.log(list.value)
</script>

<template>
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
  <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
    <div v-for="value in list.list" :key="value.id">
      <Suspense>
        <DetailCard :id="value.id" />

        <template #fallback>
          <div
            class="p-4 bg-white rounded-lg shadow h-48 flex items-center justify-center"
          >
            <svg
              class="animate-spin h-6 w-6 text-gray-400"
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
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style scoped></style>

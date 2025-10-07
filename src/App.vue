<script setup>
import SideNavBar from "./components/SideNavbar.vue"
import { onBeforeMount } from "vue"
import { RouterView } from "vue-router"
// import { useGetServerList } from "@/stores/getServerList"

// Pinia
// const store = useGetServerList()

// Lifecycle
// onBeforeMount(() => {
//   store.fetchServerList()
// })
</script>

<template>
  <!-- Side Navigation Layout -->
  <div class="flex min-h-screen">
    <!-- Side Navigation Bar -->
    <nav
      class="w-full sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8 flex-col p-4 bg-gray-50 rounded-r-md shadow-2xl h-screen"
    >
      <SideNavBar />
    </nav>

    <!-- Main Content -->
    <main
      class="flex-1 bg-gray-200 ml-0.5 p-4 rounded-l-md border-solid border-gray-800"
    >
      <RouterView />
    </main>
  </div>
</template>

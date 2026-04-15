<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import SideMenu from './components/SideMenu.vue'

const route = useRoute()
const menuOpen = ref(true)
</script>

<template>
  <div class="h-screen flex bg-surface-0 font-sans text-zinc-300 antialiased selection:bg-accent/20">
    <!-- Sidebar -->
    <SideMenu :open="menuOpen" @toggle="menuOpen = !menuOpen" />

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-6xl mx-auto px-10 py-10">
        <router-view />
      </div>
    </main>
  </div>
</template>

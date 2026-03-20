<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar v-if="user" />
    <main class="flex-grow container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Navbar from './components/Navbar.vue'

const user = computed(() => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
})
</script>

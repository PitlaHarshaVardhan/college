<template>
  <nav class="bg-indigo-600 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <span class="text-white text-xl font-bold">Leave LMS</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-indigo-100 hidden md:block">Welcome, {{ user?.name }} ({{ user?.role }})</span>
          
          <router-link 
            v-if="user?.role === 'employee'" 
            to="/employee-dashboard" 
            class="text-white hover:bg-indigo-500 px-3 py-2 rounded-md transition"
          >
            Dashboard
          </router-link>
          
          <router-link 
            v-if="user?.role === 'employee'" 
            to="/apply-leave" 
            class="text-white hover:bg-indigo-500 px-3 py-2 rounded-md transition"
          >
            Apply
          </router-link>

          <router-link 
            v-if="user?.role === 'employer'" 
            to="/employer-dashboard" 
            class="text-white hover:bg-indigo-500 px-3 py-2 rounded-md transition"
          >
            Dashboard
          </router-link>

          <button 
            @click="logout" 
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const user = computed(() => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
})

const logout = async () => {
  try {
    await api.get('/auth/logout')
  } catch (err) {
    console.error('Logout error', err)
  } finally {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
}
</script>

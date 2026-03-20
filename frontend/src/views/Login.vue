<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login to LMS</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input 
          v-model="email" 
          type="email" 
          required
          class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="employee@example.com"
        >
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input 
          v-model="password" 
          type="password" 
          required
          class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="********"
        >
      </div>
      <p v-if="error" class="text-red-500 text-xs italic mb-4">{{ error }}</p>
      <div class="flex items-center justify-between">
        <button 
          type="submit" 
          :disabled="loading"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Sign In' }}
        </button>
      </div>
      <div class="mt-4 text-center">
        <p class="text-sm">Don't have an account? <router-link to="/register" class="text-indigo-600 hover:text-indigo-800">Register</router-link></p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  try {
    error.value = ''
    loading.value = true
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
    
    // Redirect based on role
    if (response.data.data.user.role === 'employer') {
      window.location.href = '/employer-dashboard'
    } else {
      window.location.href = '/employee-dashboard'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

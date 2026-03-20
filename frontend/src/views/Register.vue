<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
        <input v-model="name" type="text" required class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input v-model="email" type="email" required class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input v-model="password" type="password" required minlength="6" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">Role</label>
        <select v-model="role" class="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="employee">Employee</option>
          <option value="employer">Employer</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Select Employer to test manager features.</p>
      </div>
      <p v-if="error" class="text-red-500 text-xs italic mb-4">{{ error }}</p>
      <div class="flex items-center justify-between">
        <button type="submit" :disabled="loading" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </div>
      <div class="mt-4 text-center">
        <p class="text-sm">Already have an account? <router-link to="/login" class="text-indigo-600 hover:text-indigo-800">Login</router-link></p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('employee')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  try {
    error.value = ''
    loading.value = true
    const response = await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value
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
    error.value = err.response?.data?.message || 'Registration failed.'
  } finally {
    loading.value = false
  }
}
</script>

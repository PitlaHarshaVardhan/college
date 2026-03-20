<template>
  <div class="max-w-2xl mx-auto mt-8 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Apply for Leave</h2>
      <button @click="router.back()" class="text-gray-500 hover:text-gray-700 text-sm font-medium">
        &larr; Back
      </button>
    </div>

    <form @submit.prevent="submitApplication">
      <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-6">
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
          <select v-model="form.type" required class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 border">
            <option value="" disabled>Select a type</option>
            <option value="Sick">Sick</option>
            <option value="Casual">Casual</option>
            <option value="Annual">Annual</option>
            <option value="Maternity">Maternity</option>
            <option value="Paternity">Paternity</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input v-model="form.startDate" type="date" required :min="today" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 border" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input v-model="form.endDate" type="date" required :min="form.startDate || today" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 border" />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Reason for Leave</label>
          <textarea v-model="form.reason" rows="4" required maxlength="500" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 border" placeholder="Please explain why you need this leave..."></textarea>
          <p class="text-xs text-gray-500 mt-1 mt-1 text-right">{{ 500 - form.reason.length }} characters left</p>
        </div>
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
        {{ error }}
      </div>

      <div class="mt-8 flex justify-end">
        <button type="submit" :disabled="loading" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition disabled:opacity-50">
          {{ loading ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const today = new Date().toISOString().split('T')[0]

const form = ref({
  type: '',
  startDate: '',
  endDate: '',
  reason: ''
})

const loading = ref(false)
const error = ref('')

const submitApplication = async () => {
  try {
    error.value = ''
    loading.value = true
    
    // Convert to ISO string format required by backend
    const payload = {
      type: form.value.type,
      startDate: new Date(form.value.startDate).toISOString(),
      endDate: new Date(form.value.endDate).toISOString(),
      reason: form.value.reason
    }

    await api.post('/leaves', payload)
    router.push('/employee-dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to submit leave application. Please check your inputs.'
  } finally {
    loading.value = false
  }
}
</script>

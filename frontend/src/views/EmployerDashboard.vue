<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Employer Dashboard</h1>
    </div>

    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <div v-else-if="leaves.length === 0" class="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100">
      <p class="text-gray-500 mb-4">No leave applications found.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="leave in leaves" :key="leave._id" class="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col h-full">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-bold text-gray-900 text-lg">{{ leave.employee?.name || 'Unknown' }}</h3>
            <p class="text-xs text-gray-500">{{ leave.employee?.email }}</p>
          </div>
          <span class="px-2 py-1 text-xs font-semibold rounded-full" 
            :class="{
              'bg-yellow-100 text-yellow-800': leave.status === 'Pending',
              'bg-green-100 text-green-800': leave.status === 'Approved',
              'bg-red-100 text-red-800': leave.status === 'Rejected'
            }">
            {{ leave.status }}
          </span>
        </div>
        
        <div class="mb-4 flex-grow text-sm text-gray-600 border-t border-b border-gray-100 py-3 my-2">
          <p class="mb-1"><span class="font-medium">Type:</span> {{ leave.type }} Leave ({{ leave.days }} days)</p>
          <p class="mb-1"><span class="font-medium">Dates:</span> {{ formatDate(leave.startDate) }} to {{ formatDate(leave.endDate) }}</p>
          <p class="mt-2 text-gray-700 italic border-l-2 border-indigo-200 pl-2">"{{ leave.reason }}"</p>
        </div>
        
        <div class="flex mt-auto space-x-3" v-if="leave.status === 'Pending'">
          <button @click="updateStatus(leave._id, 'Approved')" class="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-medium py-2 px-4 rounded text-sm transition">
            Approve
          </button>
          <button @click="updateStatus(leave._id, 'Rejected')" class="flex-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-medium py-2 px-4 rounded text-sm transition">
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const leaves = ref([])
const loading = ref(true)

const fetchLeaves = async () => {
  try {
    const res = await api.get('/leaves')
    leaves.value = res.data.data.leaves
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, status) => {
  try {
    await api.patch(`/leaves/${id}/status`, { status })
    // Update local state
    const leaveIndex = leaves.value.findIndex(l => l._id === id)
    if (leaveIndex !== -1) {
      leaves.value[leaveIndex].status = status
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Error updating status')
  }
}

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

onMounted(() => {
  fetchLeaves()
})
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/api/http'
import type { Medicine } from '@/types'

const items = ref<Medicine[]>([])
const error = ref('')
const editingId = ref<number | null>(null)
const form = ref({ name: '', medical_name: '', price: '', dosage: '' })

async function load() {
  try {
    items.value = (await http.get<Medicine[]>('/medicine')).data
  } catch (e: any) {
    error.value = e.response?.data?.error ?? 'Failed to load'
  }
}

function reset() {
  editingId.value = null
  form.value = { name: '', medical_name: '', price: '', dosage: '' }
}

async function save() {
  error.value = ''
  try {
    if (editingId.value) await http.put(`/medicine/${editingId.value}`, form.value)
    else await http.post('/medicine', form.value)
    reset()
    await load()
  } catch (e: any) {
    error.value = e.response?.data?.error ?? 'Save failed'
  }
}

function edit(m: Medicine) {
  editingId.value = m.id
  form.value = {
    name: m.name,
    medical_name: m.medical_name ?? '',
    price: String(m.price ?? ''),
    dosage: m.dosage ?? '',
  }
}

async function remove(id: number) {
  if (!confirm('Delete this medicine?')) return
  try {
    await http.delete(`/medicine/${id}`)
    await load()
  } catch (e: any) {
    error.value = e.response?.data?.error ?? 'Delete failed'
  }
}

onMounted(load)
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 space-y-6">
    <h1 class="text-2xl font-bold">Medicine</h1>
    <p v-if="error" class="text-sm text-red-600 bg-red-50 p-2 rounded">{{ error }}</p>

    <form @submit.prevent="save" class="grid gap-3 sm:grid-cols-5 bg-white p-4 rounded-xl shadow">
      <input v-model="form.name" placeholder="Name" required class="border rounded px-3 py-2" />
      <input v-model="form.medical_name" placeholder="Medical name" class="border rounded px-3 py-2" />
      <input v-model="form.price" type="number" step="0.01" placeholder="Price" class="border rounded px-3 py-2" />
      <input v-model="form.dosage" placeholder="Dosage" class="border rounded px-3 py-2" />
      <div class="flex gap-2">
        <button class="flex-1 bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700">
          {{ editingId ? 'Update' : 'Add' }}
        </button>
        <button v-if="editingId" type="button" @click="reset" class="border rounded px-3 py-2">Cancel</button>
      </div>
    </form>

    <div class="overflow-x-auto bg-white rounded-xl shadow">
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-sm text-gray-600">
        <tr><th class="p-3">Name</th><th class="p-3">Medical name</th><th class="p-3">Price</th><th class="p-3">Dosage</th><th class="p-3"></th></tr>
        </thead>
        <tbody>
        <tr v-for="m in items" :key="m.id" class="border-t">
          <td class="p-3">{{ m.name }}</td>
          <td class="p-3">{{ m.medical_name }}</td>
          <td class="p-3">{{ m.price }}</td>
          <td class="p-3">{{ m.dosage }}</td>
          <td class="p-3 text-right space-x-3">
            <button @click="edit(m)" class="text-blue-600">Edit</button>
            <button @click="remove(m.id)" class="text-red-600">Delete</button>
          </td>
        </tr>
        <tr v-if="!items.length"><td colspan="5" class="p-4 text-center text-gray-500">No medicine yet.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
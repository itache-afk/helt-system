<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/medicine')
  } catch (e: any) {
    error.value = e.response?.data?.error ?? 'Cannot reach the server'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <form @submit.prevent="submit" class="w-full max-w-sm bg-white p-6 rounded-xl shadow space-y-4">
      <h1 class="text-2xl font-bold text-center">Login</h1>
      <p v-if="error" class="text-sm text-red-600 bg-red-50 p-2 rounded">{{ error }}</p>
      <input v-model="email" type="email" placeholder="Email" required
             class="w-full border rounded px-3 py-2" />
      <input v-model="password" type="password" placeholder="Password" required
             class="w-full border rounded px-3 py-2" />
      <button :disabled="loading"
              class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {{ loading ? 'Signing in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>
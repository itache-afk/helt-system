<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav v-if="auth.isLoggedIn" class="bg-white shadow px-4 py-3 flex justify-between">
    <span class="font-semibold">Health App</span>
    <button @click="logout" class="text-red-600">Logout</button>
  </nav>
  <RouterView />
</template>
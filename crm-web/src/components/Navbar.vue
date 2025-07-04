<template>
  <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <span class="font-semibold text-lg">Mini CRM</span>
    <button @click="logout" class="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Cerrar sesión</button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

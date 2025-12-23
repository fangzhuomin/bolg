<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user' // 使用相对路径，彻底消除报错

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.initFromStorage()

  const token = localStorage.getItem('token')
  const currentPath = window.location.pathname

  if (!token && !['/login', '/register'].includes(currentPath)) {
    router.push('/login')
  }

  console.log('useUserStore:', useUserStore)
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

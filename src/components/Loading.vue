<template>
  <div v-if="loading" class="loading-overlay">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p v-if="text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 添加多单词组件名
defineOptions({
  name: 'AppLoading', // 或者 'PageLoading', 'LoadingSpinner' 等
})

defineProps<{
  loading: boolean
  text?: string
}>()
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

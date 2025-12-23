<template>
  <div class="not-found">
    <div class="error-container">
      <div class="error-code">404</div>
      <div class="error-message">页面未找到</div>
      <p class="error-description">抱歉，您访问的页面不存在或已被移除</p>
      <div class="action-buttons">
        <el-button type="primary" @click="goBack">返回上一页</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .error-container {
    text-align: center;
    background: white;
    padding: 60px 40px;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    .error-code {
      font-size: 120px;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 20px;
    }

    .error-message {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #333;
    }

    .error-description {
      color: #666;
      margin-bottom: 30px;
      max-width: 400px;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
  }
}
</style>

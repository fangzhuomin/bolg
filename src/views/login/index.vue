<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>博客文章管理系统</h2>
        <p class="login-subtitle">毕业设计项目</p>
      </div>

      <div class="login-body">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="loginForm.remember">记住用户名</el-checkbox>
            <el-link
              type="primary"
              :underline="false"
              class="forgot-password"
              @click="handleForgot"
            >
              忘记密码？
            </el-link>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              style="width: 100%"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="success" size="large" style="width: 100%" @click="goToRegister">
              注册账号
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-tip">
          <p>测试账号：<strong>admin</strong> / <strong>123456</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  remember: false,
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const loading = ref(false)
const loginFormRef = ref<InstanceType<typeof ElForm>>()

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    await userStore.login(loginForm.username, loginForm.password, loginForm.remember)

    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '登录失败'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

const handleForgot = () => {
  ElMessage.warning('功能开发中')
}

console.log(useUserStore)

onMounted(() => {
  const remembered = localStorage.getItem('rememberMe')
  if (remembered) {
    loginForm.username = remembered
    loginForm.remember = true
  }

  if (userStore.isLoggedIn) {
    router.push('/dashboard')
  }
})
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="rgba(255,255,255,0.05)"/><path d="M0,50 L50,0 L100,50 L50,100 Z" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></svg>');
}

.login-box {
  width: 400px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.login-header {
  padding: 40px 30px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;

  h2 {
    margin: 0 0 10px 0;
    font-size: 24px;
    font-weight: 600;
  }

  .login-subtitle {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
}

.login-body {
  padding: 30px;

  .login-form {
    margin-bottom: 20px;

    .forgot-password {
      float: right;
      font-size: 14px;
    }
  }

  .login-tip {
    text-align: center;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 6px;
    border-left: 4px solid #409eff;

    p {
      margin: 5px 0;
      font-size: 14px;
      color: #666;

      strong {
        color: #333;
      }
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    margin: 0 20px;
  }
}
</style>

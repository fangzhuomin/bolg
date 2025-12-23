<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>注册账号</h2>
        <p class="register-subtitle">创建您的博客管理账号</p>
      </div>

      <div class="register-body">
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              type="text"
              placeholder="请输入用户名 (3-20位字符)"
              size="large"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              type="email"
              placeholder="请输入邮箱"
              size="large"
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码 (至少6位)"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              show-password
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="agreement">
            <el-checkbox v-model="registerForm.agreement">
              我已阅读并同意
              <el-link type="primary" :underline="false">《用户协议》</el-link>
              和
              <el-link type="primary" :underline="false">《隐私政策》</el-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              @click="handleRegister"
              :loading="loading"
              style="width: 100%"
            >
              立即注册
            </el-button>
          </el-form-item>

          <div class="register-footer">
            <el-link type="info" :underline="false" @click="goToLogin">
              <el-icon><ArrowLeft /></el-icon>
              已有账号？立即登录
            </el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import { User, Lock, Message, ArrowLeft } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false,
})

// 表单验证规则
const validateUsername = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else if (value.length < 3 || value.length > 20) {
    callback(new Error('用户名长度在3到20个字符'))
  } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    callback(new Error('用户名只能包含字母、数字和下划线'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度至少6位'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateAgreement = (rule: any, value: boolean, callback: any) => {
  if (!value) {
    callback(new Error('请同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] },
  ],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
  agreement: [{ required: true, validator: validateAgreement, trigger: 'change' }],
}

const loading = ref(false)
const registerFormRef = ref<InstanceType<typeof ElForm>>()

// 注册处理
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    // 验证表单
    const valid = await registerFormRef.value.validate()
    if (!valid) return

    loading.value = true

    // 调用 store 的 register 方法
    await userStore.register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
    })

    ElMessage.success('注册成功！请登录')
    loading.value = false

    // 注册成功后跳转到登录页
    router.push('/login')
  } catch (error: any) {
    loading.value = false
    ElMessage.error(error.message || '注册失败，请稍后重试')
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

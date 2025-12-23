// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as userApi from '@/api/modules/user'
import type { LoginParams, RegisterParams, UserInfo } from '@/api/modules/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo | null>(null)
  const token = ref<string | null>(null)
  const rememberMe = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const username = computed(() => user.value?.username || '')

  // 从 localStorage 初始化
  const initFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const storedRememberMe = localStorage.getItem('rememberMe')

    if (storedToken) {
      token.value = storedToken
    }

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e: unknown) {
        // 修改 1: 将 any 改为 unknown
        console.error('解析用户信息失败:', e)
      }
    }

    if (storedRememberMe) {
      rememberMe.value = storedRememberMe
    }
  }

  // 登录 - 使用 API
  const login = async (username: string, password: string, remember = false): Promise<void> => {
    const params: LoginParams = {
      username,
      password,
      rememberMe: remember,
    }

    try {
      const response = await userApi.login(params)

      user.value = response.user
      token.value = response.token

      // 存储到 localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      if (remember) {
        localStorage.setItem('rememberMe', username)
      } else {
        localStorage.removeItem('rememberMe')
      }
    } catch (error: unknown) {
      // 修改 2: 将 any 改为 unknown
      const errorMessage = error instanceof Error ? error.message : '登录失败'
      throw new Error(errorMessage)
    }
  }

  // 注册 - 使用 API
  const register = async (userData: {
    username: string
    email: string
    password: string
    confirmPassword: string
  }): Promise<void> => {
    const params: RegisterParams = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    }

    try {
      await userApi.register(params)
    } catch (error: unknown) {
      // 修改 3: 将 any 改为 unknown
      const errorMessage = error instanceof Error ? error.message : '注册失败'
      throw new Error(errorMessage)
    }
  }

  // 获取当前用户信息 - 使用 API
  const fetchCurrentUser = async (): Promise<void> => {
    try {
      const currentUser = await userApi.getCurrentUser()
      user.value = currentUser
      localStorage.setItem('user', JSON.stringify(currentUser))
    } catch (error: unknown) {
      // 修改 4: 将 any 改为 unknown
      console.error('获取用户信息失败:', error)
      // 如果获取失败，清理登录状态
      logout()
    }
  }

  // 退出登录 - 使用 API
  const logout = async (): Promise<void> => {
    try {
      await userApi.logout()
    } catch (error: unknown) {
      // 修改 5: 将 any 改为 unknown
      console.error('退出登录失败:', error)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  // 更新用户信息 - 使用 API
  const updateProfile = async (profile: Partial<UserInfo>): Promise<void> => {
    if (!user.value) return

    try {
      const updatedUser = await userApi.updateProfile(profile)
      user.value = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error: unknown) {
      // 修改 6: 将 any 改为 unknown
      const errorMessage = error instanceof Error ? error.message : '更新个人信息失败'
      throw new Error(errorMessage)
    }
  }

  // 修改密码 - 使用 API
  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await userApi.changePassword({
        oldPassword,
        newPassword,
      })
    } catch (error: unknown) {
      // 修改 7: 将 any 改为 unknown
      const errorMessage = error instanceof Error ? error.message : '修改密码失败'
      throw new Error(errorMessage)
    }
  }

  return {
    user,
    token,
    rememberMe,
    isLoggedIn,
    isAdmin,
    username,
    initFromStorage,
    login,
    register,
    fetchCurrentUser,
    logout,
    updateProfile,
    changePassword,
  }
})

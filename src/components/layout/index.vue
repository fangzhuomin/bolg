<template>
  <div class="layout-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="logo" @click="toggleSidebar">
        <h2 v-show="!sidebarCollapsed">博客管理系统</h2>
        <span v-show="sidebarCollapsed">BMS</span>
        <el-icon class="collapse-icon">
          <component :is="sidebarCollapsed ? Expand : Fold" />
        </el-icon>
      </div>

      <!-- 用户信息 -->
      <div class="user-info" v-show="!sidebarCollapsed && userInfo">
        <el-avatar :size="40" :src="userInfo?.avatar || defaultAvatar" />
        <div class="user-details">
          <h4>{{ userInfo?.username || '未登录' }}</h4>
          <p>{{ userInfo?.role === 'admin' ? '管理员' : '用户' }}</p>
        </div>
      </div>

      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="sidebarCollapsed"
        background-color="#2d3a4b"
        text-color="#fff"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>

        <el-sub-menu index="article">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>文章管理</span>
          </template>
          <el-menu-item index="/article">文章列表</el-menu-item>
          <el-menu-item index="/article/create">新建文章</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/category">
          <el-icon><Folder /></el-icon>
          <span>分类管理</span>
        </el-menu-item>

        <el-menu-item index="/tag">
          <el-icon><PriceTag /></el-icon>
          <span>标签管理</span>
        </el-menu-item>

        <el-menu-item index="/comment">
          <el-icon><ChatLineRound /></el-icon>
          <span>评论管理</span>
        </el-menu-item>

        <!-- 通知中心菜单项 -->
        <el-menu-item index="/notification">
          <el-icon><Bell /></el-icon>
          <span>通知中心</span>
        </el-menu-item>

        <el-menu-item index="/profile" v-if="userInfo">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>

      <!-- 底部操作 -->
      <div class="sidebar-footer" v-show="!sidebarCollapsed && userInfo">
        <el-dropdown @command="handleCommand">
          <span class="user-dropdown">
            <el-avatar :size="32" :src="userInfo?.avatar || defaultAvatar" />
            <span>{{ userInfo?.username || '用户' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>个人中心
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>系统设置
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="main-content">
      <!-- 顶部头部 -->
      <div class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <template v-for="item in breadcrumbs" :key="item.path">
              <el-breadcrumb-item :to="item.path">
                {{ item.meta?.title || item.name }}
              </el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- 通知图标 -->
          <div class="notification-icon" @click="goToNotification">
            <el-icon :size="20" :color="hasUnread ? '#ff4d4f' : '#666'">
              <Bell />
            </el-icon>
            <span v-if="hasUnread" class="notification-badge"></span>
          </div>

          <!-- 主题切换 -->
          <el-switch
            v-model="darkMode"
            class="theme-switch"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            @change="toggleTheme"
          />
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import {
  Odometer,
  Document,
  Folder,
  PriceTag,
  ChatLineRound,
  User,
  Setting,
  SwitchButton,
  ArrowDown,
  Bell,
  Expand,
  Fold,
  Moon,
  Sunny,
} from '@element-plus/icons-vue'

// 多字组件名
defineOptions({
  name: 'LayoutIndex',
})

const route = useRoute()
const router = useRouter()

// 用户信息接口
interface UserInfo {
  id?: number
  username?: string
  avatar?: string
  role?: 'user' | 'admin'
  email?: string
}

const userInfo = ref<UserInfo | null>(null)
const sidebarCollapsed = ref(false)
const darkMode = ref(false)
const hasUnread = ref(false)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const activeMenu = computed(() => route.path)
const breadcrumbs = computed(() =>
  route.matched.filter((record) => record.meta && record.meta.title),
)

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    // 从 localStorage 获取用户信息
    const storedUser = localStorage.getItem('userInfo')
    if (storedUser) {
      userInfo.value = JSON.parse(storedUser)
      return
    }

    // 如果没有存储的信息，检查是否有 token
    const token = localStorage.getItem('token')
    if (!token) {
      // 没有 token，跳转到登录页
      if (route.path !== '/login' && route.path !== '/register') {
        router.push('/login')
      }
      return
    }

    // 这里可以添加 API 调用获取用户信息
    // 暂时模拟一个用户
    userInfo.value = {
      id: 1,
      username: '管理员',
      avatar: defaultAvatar,
      role: 'admin',
      email: 'admin@example.com',
    }

    // 保存到 localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  } catch (error) {
    console.error('获取用户信息失败:', error)
    userInfo.value = null
  }
}

// 登出
const logout = async () => {
  try {
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    // 清除用户信息
    userInfo.value = null

    return true
  } catch (error) {
    console.error('登出失败:', error)
    return false
  }
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const goToNotification = () => {
  router.push('/notification')
  // 标记为已读
  hasUnread.value = false
}

const handleCommand = async (command: string) => {
  try {
    if (command === 'logout') {
      const success = await logout()
      if (success) {
        ElMessage.success('退出登录成功')
        router.push('/login')
      } else {
        ElMessage.error('退出登录失败')
      }
    } else if (command === 'profile') {
      router.push('/profile')
    } else if (command === 'settings') {
      ElMessage.info('系统设置功能开发中')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }
}

// 检查未读通知
const checkNotifications = () => {
  // 这里可以添加 API 调用
  // 暂时随机设置
  hasUnread.value = Math.random() > 0.5
}

// 键盘快捷键支持
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl + B 切换侧边栏
  if (event.ctrlKey && event.key === 'b') {
    event.preventDefault()
    toggleSidebar()
  }
  // Ctrl + T 切换主题
  if (event.ctrlKey && event.key === 't') {
    event.preventDefault()
    darkMode.value = !darkMode.value
    toggleTheme(darkMode.value)
  }
}

watch(
  () => route.path,
  (newPath) => {
    console.log('路由变化到:', newPath)
  },
)

onMounted(() => {
  initTheme()
  fetchUserInfo()
  checkNotifications()

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyDown)

  // 定时检查通知
  const notificationInterval = setInterval(checkNotifications, 60000) // 每分钟检查一次

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    clearInterval(notificationInterval)
  })
})
</script>

<style scoped lang="scss">
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background-color: #2d3a4b;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: relative;

  &.collapsed {
    width: 64px;

    .user-info,
    .user-details,
    .sidebar-footer .user-dropdown span {
      display: none;
    }
  }

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      white-space: nowrap;
    }

    span {
      font-size: 16px;
      font-weight: bold;
    }

    .collapse-icon {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.8);
      transition: transform 0.3s;
    }

    &:hover .collapse-icon {
      color: #ffffff;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .el-avatar {
      margin-right: 12px;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .user-details {
      h4 {
        margin: 0 0 4px 0;
        font-size: 14px;
        font-weight: 500;
      }

      p {
        margin: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .el-menu-vertical {
    flex: 1;
    border-right: none;

    :deep(.el-sub-menu__title),
    :deep(.el-menu-item) {
      height: 48px;
      line-height: 48px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
    }

    :deep(.el-menu-item.is-active) {
      background-color: #1890ff !important;

      &:hover {
        background-color: #40a9ff !important;
      }
    }
  }

  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .user-dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: white;
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .el-avatar {
        margin-right: 8px;
        border: 2px solid rgba(255, 255, 255, 0.3);
      }

      span {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f0f2f5;
}

.header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;

  .header-left {
    .el-breadcrumb {
      font-size: 14px;

      :deep(.el-breadcrumb__inner) {
        font-weight: 500;

        &:hover {
          color: #409eff;
          cursor: pointer;
        }
      }

      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #666;
        font-weight: 600;

        &:hover {
          color: #666;
          cursor: default;
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .notification-icon {
      position: relative;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f5f5;
      }

      .notification-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 6px;
        height: 6px;
        background-color: #ff4d4f;
        border-radius: 50%;
      }
    }
  }
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;

  & > * {
    min-height: calc(100vh - 100px);
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;

    &.collapsed {
      transform: translateX(-100%);
    }
  }

  .main-content {
    margin-left: 0;

    .header {
      padding: 0 16px;

      .header-left {
        .el-breadcrumb {
          font-size: 12px;
        }
      }

      .header-right {
        gap: 12px;
      }
    }

    .content {
      padding: 12px;

      & > * {
        padding: 16px;
      }
    }
  }
}

.dark {
  --el-bg-color: #1a1a1a;
  --el-text-color-primary: #ffffff;
  --el-border-color: #303030;
}

.dark .main-content {
  background-color: #141414;
}

.dark .header {
  background: #1a1a1a;
  border-bottom-color: #303030;

  .header-right .notification-icon:hover {
    background-color: #303030;
  }
}

.dark .content {
  background-color: #141414;

  & > * {
    background: #1a1a1a;
    border-color: #303030;
  }
}
</style>

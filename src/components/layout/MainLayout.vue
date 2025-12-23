<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>博客管理系统</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
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
        </el-menu>
      </el-aside>

      <!-- 右侧内容区域 -->
      <el-container>
        <!-- 顶部头部 -->
        <el-header class="header">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <div class="user-info">
              <el-avatar :size="32" :src="userAvatar" />
              <span class="username">管理员</span>
            </div>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主要内容区域 -->
        <el-main class="main-content">
          <div class="content-wrapper">
            <!-- 页面内容 -->
            <router-view v-slot="{ Component }">
              <transition name="fade-transform" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Odometer,
  Document,
  Folder,
  PriceTag,
  ChatLineRound,
  ArrowDown,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 当前路由名称（用于面包屑）
const currentRouteName = computed(() => {
  const routeName = route.meta.title || route.name
  return routeName || ''
})

// 用户头像（这里可以替换为实际的头像URL）
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  if (command === 'logout') {
    // 退出登录逻辑
    localStorage.removeItem('token')
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped lang="scss">
.common-layout {
  height: 100vh;
  overflow: hidden;

  .el-container {
    height: 100%;
  }
}

.sidebar {
  background-color: #2d3a4b;
  transition: width 0.3s;

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    h2 {
      color: #fff;
      font-size: 18px;
      margin: 0;
      font-weight: 600;
    }
  }

  .el-menu-vertical {
    border-right: none;
    height: calc(100% - 60px);

    :deep(.el-sub-menu__title),
    :deep(.el-menu-item) {
      height: 48px;
      line-height: 48px;
    }

    :deep(.el-menu-item.is-active) {
      background-color: #1890ff !important;
    }
  }
}

.header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  .header-left {
    .el-breadcrumb {
      font-size: 14px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .username {
        font-size: 14px;
        color: #333;
      }
    }

    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
      display: flex;
      align-items: center;
    }
  }
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;

  .content-wrapper {
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    min-height: calc(100vh - 100px);
  }
}

// 过渡动画
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

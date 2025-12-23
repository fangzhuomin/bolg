<template>
  <div class="dashboard">
    <!-- 统计数据卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon size="24"><Document /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalArticles }}</div>
                <div class="stat-label">总文章数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon size="24"><ChatDotRound /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalComments }}</div>
                <div class="stat-label">总评论数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon size="24"><View /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalViews }}</div>
                <div class="stat-label">总浏览量</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon size="24"><Bell /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ notificationStore.unreadCount }}</div>
                <div class="stat-label">未读通知</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 欢迎卡片 -->
    <div class="welcome-card">
      <h1>欢迎回来，Hello</h1>
      <p class="date-info">今天是 {{ currentDate }} {{ currentWeek }}，祝您工作愉快！</p>
      <p class="system-info">系统已稳定运行 30 天，共发布 {{ stats.totalArticles }} 篇文章</p>
    </div>

    <!-- 最近文章表格 -->
    <div class="recent-articles">
      <div class="card-header">
        <h3>最近文章</h3>
        <div class="header-actions">
          <el-button type="primary" @click="$router.push('/article')"> 管理文章 </el-button>
        </div>
      </div>

      <el-table :data="recentArticles" style="width: 100%">
        <el-table-column prop="title" label="标题" width="300" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="createTime" label="发布时间" width="180" />
        <el-table-column prop="views" label="浏览量" width="100" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editArticle(row.id)"> 编辑 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BlogDashboard',
})

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, ChatDotRound, View, Bell } from '@element-plus/icons-vue'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const notificationStore = useNotificationStore()

// 定义文章类型
interface Article {
  id: number
  title: string
  category: string
  createTime: string
  views: number
}

// 统计数据类型
interface DashboardStats {
  totalArticles: number
  totalComments: number
  totalViews: number
}

// 响应式数据
const currentDate = ref<string>('')
const currentWeek = ref<string>('')
const recentArticles = ref<Article[]>([])
const stats = ref<DashboardStats>({
  totalArticles: 128,
  totalComments: 543,
  totalViews: 12345,
})

// 获取当前日期和星期
const initDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  currentDate.value = `${year}年${month}月${day}日`

  const weekDays: string[] = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const dayOfWeek = now.getDay()
  currentWeek.value = weekDays[dayOfWeek] || ''
}

// 模拟获取最近文章
const fetchRecentArticles = () => {
  recentArticles.value = [
    {
      id: 1,
      title: 'Vue3组合式API入门指南',
      category: '技术教程',
      createTime: '2025-12-14 10:30',
      views: 156,
    },
    {
      id: 2,
      title: 'TypeScript在项目中的最佳实践',
      category: '技术分享',
      createTime: '2025-12-13 14:20',
      views: 89,
    },
    {
      id: 3,
      title: 'Element Plus组件库使用心得',
      category: '前端开发',
      createTime: '2025-12-12 09:15',
      views: 234,
    },
  ]
}

// 编辑文章
const editArticle = (id: number) => {
  router.push(`/article/edit/${id}`)
}

onMounted(() => {
  initDate()
  fetchRecentArticles()
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;
}

.stats-cards {
  margin-bottom: 24px;
}

.stat-card {
  height: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.welcome-card h1 {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 500;
}

.date-info {
  margin: 0 0 8px 0;
  font-size: 16px;
  opacity: 0.9;
}

.system-info {
  margin: 0;
  font-size: 16px;
  opacity: 0.8;
}

.recent-articles {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}
</style>

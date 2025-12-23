<template>
  <div class="notification-page">
    <div class="page-header">
      <h1>通知中心</h1>
      <div class="header-actions">
        <el-button-group>
          <el-button type="primary" :disabled="unreadCount === 0" @click="markAllAsRead">
            <el-icon><Check /></el-icon>
            全部已读
          </el-button>
          <el-button type="danger" :disabled="notifications.length === 0" @click="clearAll">
            <el-icon><Delete /></el-icon>
            清空全部
          </el-button>
        </el-button-group>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon total">
                <el-icon size="24"><Bell /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalCount }}</div>
                <div class="stat-label">总通知数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon unread">
                <el-icon size="24"><Message /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.unreadCount }}</div>
                <div class="stat-label">未读通知</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon today">
                <el-icon size="24"><Calendar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.todayCount }}</div>
                <div class="stat-label">今日通知</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon simulate">
                <el-icon size="24"><Plus /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">测试</div>
                <div class="stat-label">
                  <el-button type="primary" link @click="simulateNotification">
                    模拟通知
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 通知列表 -->
    <div class="notification-list-container">
      <div class="list-header">
        <el-radio-group v-model="filterType" @change="handleFilterChange">
          <el-radio-button label="all">全部通知</el-radio-button>
          <el-radio-button label="unread">未读通知</el-radio-button>
          <el-radio-button label="read">已读通知</el-radio-button>
        </el-radio-group>

        <el-input
          v-model="searchKeyword"
          placeholder="搜索通知标题或内容"
          class="search-input"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
      </div>

      <div class="notification-table">
        <el-table
          :data="paginatedNotifications"
          v-loading="loading"
          @row-click="handleRowClick"
          style="width: 100%"
        >
          <el-table-column width="40">
            <template #default="{ row }">
              <div
                :class="['read-indicator', { unread: !row.read }]"
                @click.stop="toggleReadStatus(row)"
              />
            </template>
          </el-table-column>

          <el-table-column label="类型" width="80">
            <template #default="{ row }">
              <el-tag :type="row.type" size="small" :class="`type-${row.type}`">
                {{ getTypeText(row.type) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="标题" prop="title" min-width="200">
            <template #default="{ row }">
              <div class="title-cell">
                <span :class="{ 'unread-title': !row.read }">{{ row.title }}</span>
                <el-tag v-if="row.sender" size="mini" effect="plain" class="sender-tag">
                  {{ row.sender }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="内容" prop="content" min-width="300">
            <template #default="{ row }">
              <div class="content-cell">
                {{ row.content }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="时间" prop="time" width="180" />

          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button v-if="!row.read" type="primary" link @click.stop="markAsRead(row.id)">
                  标记已读
                </el-button>
                <el-button v-else type="info" link @click.stop="markAsUnread(row.id)">
                  标记未读
                </el-button>
                <el-button type="danger" link @click.stop="deleteNotification(row.id)">
                  删除
                </el-button>
                <el-button v-if="row.link" type="success" link @click.stop="gotoLink(row.link)">
                  查看
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="total > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && filteredNotifications.length === 0" class="empty-state">
          <el-empty description="暂无通知数据">
            <el-button type="primary" @click="simulateNotification"> 生成测试通知 </el-button>
          </el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Bell,
  Message,
  Calendar,
  Plus,
  Search,
  Check,
  Delete,
  Refresh,
} from '@element-plus/icons-vue'
import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/types/notification'

defineOptions({
  name: 'NotificationPage',
})

const router = useRouter()
const notificationStore = useNotificationStore()

// 响应式数据
const loading = ref(false)
const filterType = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 计算属性
const notifications = computed(() => notificationStore.notifications)
const stats = computed(() => notificationStore.stats)
const unreadCount = computed(() => notificationStore.unreadCount)

// 过滤后的通知列表
const filteredNotifications = computed(() => {
  let list = [...notifications.value]

  // 按类型过滤
  if (filterType.value === 'unread') {
    list = list.filter((item) => !item.read)
  } else if (filterType.value === 'read') {
    list = list.filter((item) => item.read)
  }

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword) ||
        (item.sender && item.sender.toLowerCase().includes(keyword)),
    )
  }

  return list
})

// 分页数据
const total = computed(() => filteredNotifications.value.length)
const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredNotifications.value.slice(start, end)
})

// 获取类型文本
const getTypeText = (type: Notification['type']) => {
  const typeMap = {
    success: '成功',
    warning: '警告',
    error: '错误',
    info: '信息',
  }
  return typeMap[type] || '信息'
}

// 处理行点击
const handleRowClick = (row: Notification) => {
  if (row.link) {
    router.push(row.link)
  }
}

// 切换已读状态
const toggleReadStatus = (row: Notification) => {
  if (row.read) {
    markAsUnread(row.id)
  } else {
    markAsRead(row.id)
  }
}

// 标记为已读
const markAsRead = (id: number | string) => {
  notificationStore.markAsRead(id)
}

// 标记为未读
const markAsUnread = (id: number | string) => {
  const notification = notifications.value.find((n) => n.id === id)
  if (notification) {
    notification.read = false
  }
}

// 标记全部为已读
const markAllAsRead = async () => {
  try {
    await ElMessageBox.confirm('确定要将所有通知标记为已读吗？', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    notificationStore.markAllAsRead()
    ElMessage.success('所有通知已标记为已读')
  } catch {
    // 用户取消操作
  }
}

// 删除通知
const deleteNotification = async (id: number | string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    notificationStore.deleteNotification(id)
    ElMessage.success('通知删除成功')
  } catch {
    // 用户取消操作
  }
}

// 清空所有通知
const clearAll = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有通知吗？此操作不可撤销', '清空确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    })
    notificationStore.clearAll()
    ElMessage.success('所有通知已清空')
  } catch {
    // 用户取消操作
  }
}

// 跳转到链接
const gotoLink = (link: string) => {
  router.push(link)
}

// 模拟新通知
const simulateNotification = () => {
  notificationStore.simulateNewNotification()
  ElMessage.success('已生成测试通知')
}

// 刷新数据
const refreshData = () => {
  // 实际项目中这里应该重新请求API
  ElMessage.success('数据已刷新')
}

// 处理过滤条件变化
const handleFilterChange = () => {
  currentPage.value = 1
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  // 页面加载时获取数据
  // 实际项目中这里应该调用API
})
</script>

<style scoped lang="scss">
.notification-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
}

.stats-cards {
  margin-bottom: 24px;

  .stat-card {
    height: 100%;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        color: white;

        &.total {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.unread {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.today {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.simulate {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }

      .stat-info {
        flex: 1;

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
      }
    }
  }
}

.notification-list-container {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.search-input {
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.notification-table {
  .read-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--el-color-success);
    cursor: pointer;
    transition: all 0.3s;

    &.unread {
      background-color: var(--el-color-primary);
      box-shadow: 0 0 0 2px var(--el-color-primary-light-7);
    }

    &:hover {
      transform: scale(1.2);
    }
  }

  .type-success {
    background-color: var(--el-color-success-light-9);
    border-color: var(--el-color-success-light-7);
    color: var(--el-color-success);
  }

  .type-warning {
    background-color: var(--el-color-warning-light-9);
    border-color: var(--el-color-warning-light-7);
    color: var(--el-color-warning);
  }

  .type-error {
    background-color: var(--el-color-error-light-9);
    border-color: var(--el-color-error-light-7);
    color: var(--el-color-error);
  }

  .type-info {
    background-color: var(--el-color-info-light-9);
    border-color: var(--el-color-info-light-7);
    color: var(--el-color-info);
  }

  .title-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .unread-title {
      font-weight: 600;
    }

    .sender-tag {
      height: 20px;
      line-height: 20px;
    }
  }

  .content-cell {
    font-size: 14px;
    color: var(--el-text-color-regular);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 4px;
    }
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}

// 响应式调整
@media (max-width: 768px) {
  .notification-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;

    h1 {
      font-size: 20px;
    }
  }

  .notification-list-container {
    padding: 16px;
  }
}
</style>

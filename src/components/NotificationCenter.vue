<template>
  <el-dropdown
    ref="dropdownRef"
    trigger="click"
    placement="bottom-end"
    :hide-on-click="false"
    class="notification-center"
  >
    <!-- 触发按钮 -->
    <div class="notification-trigger">
      <el-badge
        :value="notificationStore.unreadCount"
        :max="99"
        :hidden="notificationStore.unreadCount === 0"
        class="notification-badge"
      >
        <el-icon :size="20" class="notification-icon">
          <Bell />
        </el-icon>
      </el-badge>
    </div>

    <template #dropdown>
      <div class="notification-dropdown">
        <!-- 头部 -->
        <div class="notification-header">
          <h3>通知中心</h3>
          <div class="header-actions">
            <span class="unread-count">未读: {{ notificationStore.unreadCount }}</span>
            <el-button
              v-if="notificationStore.unreadCount > 0"
              type="primary"
              link
              @click="notificationStore.markAllAsRead()"
            >
              全部已读
            </el-button>
            <el-button
              v-if="notificationStore.notifications.length > 0"
              type="danger"
              link
              @click="notificationStore.clearAll()"
            >
              清空
            </el-button>
          </div>
        </div>

        <!-- 标签页 -->
        <div class="notification-filter">
          <el-tabs v-model="activeTab" @tab-change="handleTabChange">
            <el-tab-pane label="全部" name="all" />
            <el-tab-pane label="未读" name="unread" />
          </el-tabs>
        </div>

        <!-- 通知列表 -->
        <div class="notification-list">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            :class="['notification-item', { unread: !notification.read }]"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-type">
              <el-icon :size="16" :class="`type-${notification.type}`">
                <component :is="getTypeIcon(notification.type)" />
              </el-icon>
            </div>
            <div class="notification-content">
              <div class="notification-title">
                <span class="title-text">{{ notification.title }}</span>
                <span class="notification-time">{{ formatTime(notification.time) }}</span>
              </div>
              <div class="notification-desc">{{ notification.content }}</div>
              <div v-if="notification.sender" class="notification-sender">
                来自: {{ notification.sender }}
              </div>
            </div>
            <div class="notification-actions">
              <el-button
                v-if="!notification.read"
                type="primary"
                link
                @click.stop="handleMarkAsRead(notification.id)"
              >
                标记已读
              </el-button>
              <el-button type="danger" link @click.stop="handleDeleteNotification(notification.id)">
                删除
              </el-button>
            </div>
          </div>

          <div v-if="filteredNotifications.length === 0" class="empty-notification">
            <el-empty description="暂无通知" />
          </div>
        </div>

        <!-- 底部 -->
        <div class="notification-footer">
          <el-button type="primary" link @click="gotoNotificationPage"> 查看所有通知 </el-button>
          <el-button type="info" link @click="simulateNotification"> 测试通知 </el-button>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, CircleCheck, Warning, CircleClose, InfoFilled } from '@element-plus/icons-vue'
import { useNotificationStore } from '../stores/notification' // 相对路径

// 定义图标组件类型
type IconComponent = Component

// 定义通知对象类型
interface NotificationItem {
  id: number | string
  read: boolean
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  content: string
  time: string
  sender?: string
  link?: string
}

defineOptions({
  name: 'NotificationCenter',
})

const router = useRouter()
const notificationStore = useNotificationStore()
const dropdownRef = ref<{ handleClose?: () => void }>()

const activeTab = ref('all')

// 过滤通知
const filteredNotifications = computed(() => {
  if (activeTab.value === 'unread') {
    return notificationStore.notifications.filter((n) => !n.read)
  }
  return notificationStore.notifications
})

// 获取类型图标
const getTypeIcon = (type: string): IconComponent => {
  const iconMap: Record<string, IconComponent> = {
    success: CircleCheck,
    warning: Warning,
    error: CircleClose,
    info: InfoFilled,
  }
  return iconMap[type] || InfoFilled
}

// 格式化时间
const formatTime = (time: string) => {
  const now = new Date()
  const notificationTime = new Date(time)
  const diffHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60))
  if (diffHours < 1) return '刚刚'
  if (diffHours < 24) return `${diffHours}小时前`
  return notificationTime.toLocaleDateString('zh-CN')
}

// 通知操作方法
const handleNotificationClick = (notification: NotificationItem) => {
  if (!notification.read) notificationStore.markAsRead(notification.id)
  if (notification.link) router.push(notification.link)
  dropdownRef.value?.handleClose?.()
}

// 重命名函数以避免与 store 方法冲突
const handleMarkAsRead = (id: number | string) => notificationStore.markAsRead(id)
const handleDeleteNotification = (id: number | string) => notificationStore.deleteNotification(id)

const handleTabChange = (tab: string) => (activeTab.value = tab)
const gotoNotificationPage = () => {
  router.push('/notification')
  dropdownRef.value?.handleClose?.()
}
const simulateNotification = () => notificationStore.simulateNewNotification()

onMounted(() => {
  setInterval(() => {
    if (Math.random() < 0.3) notificationStore.simulateNewNotification()
  }, 30000)
})
</script>

<style scoped lang="scss">
.notification-center {
  margin: 0 16px;
  cursor: pointer;
}

.notification-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s;

  &:hover {
    background-color: var(--el-color-primary-light-9);
  }
}

.notification-badge {
  :deep(.el-badge__content) {
    top: 6px;
    right: 6px;
  }
}

.notification-icon {
  color: var(--el-text-color-primary);
}

.notification-dropdown {
  width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 20%, transparent);

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;

  .unread-count {
    font-size: 12px;
    color: var(--el-color-primary);
    font-weight: 500;
  }
}

.notification-filter {
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  :deep(.el-tabs__nav-wrap) {
    &::after {
      height: 0;
    }
  }

  :deep(.el-tabs__item) {
    padding: 8px 0;
    font-size: 14px;

    &.is-active {
      color: var(--el-color-primary);
    }
  }
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
}

.notification-item {
  display: flex;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:hover {
    background-color: var(--el-color-primary-light-9);
  }

  &.unread {
    background-color: var(--el-color-primary-light-9);

    &:hover {
      background-color: var(--el-color-primary-light-8);
    }
  }
}

.notification-type {
  margin-right: 12px;
  flex-shrink: 0;

  .type-success {
    color: var(--el-color-success);
  }

  .type-warning {
    color: var(--el-color-warning);
  }

  .type-error {
    color: var(--el-color-error);
  }

  .type-info {
    color: var(--el-color-info);
  }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;

  .title-text {
    font-weight: 600;
    font-size: 14px;
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .notification-time {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    flex-shrink: 0;
    margin-left: 8px;
  }
}

.notification-desc {
  font-size: 12px;
  color: var(--el-text-color-regular);
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  /* 兼容性修复：同时提供标准属性和webkit前缀属性 */
  line-clamp: 2;
  -webkit-line-clamp: 2;
}

.notification-sender {
  font-size: 11px;
  color: var(--el-text-color-placeholder);
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 8px;
  flex-shrink: 0;
}

.empty-notification {
  padding: 40px 20px;
  text-align: center;
}

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-fill-color-lighter);
}
</style>

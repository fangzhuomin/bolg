// src/stores/notification.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification, NotificationStats } from '@/types/notification'

export const useNotificationStore = defineStore('notification', () => {
  // 通知列表
  const notifications = ref<Notification[]>([
    {
      id: 1,
      title: '系统维护通知',
      content: '系统将于今晚24:00-02:00进行维护，期间服务可能中断',
      type: 'warning',
      time: '2025-12-15 10:30',
      read: false,
      sender: '系统管理员',
    },
    {
      id: 2,
      title: '新用户注册',
      content: '用户 "开发者小王" 刚刚完成了注册',
      type: 'info',
      time: '2025-12-15 09:15',
      read: false,
      link: '/user',
    },
    {
      id: 3,
      title: '文章审核通过',
      content: '您的文章 "Vue3最佳实践" 已通过审核并发布',
      type: 'success',
      time: '2025-12-15 08:45',
      read: true,
      link: '/article/edit/1',
    },
    {
      id: 4,
      title: '评论待审核',
      content: '有3条新评论等待您的审核',
      type: 'warning',
      time: '2025-12-14 16:20',
      read: false,
      link: '/comment',
    },
    {
      id: 5,
      title: '登录异常警告',
      content: '检测到您的账户在异常地点登录，如非本人操作请立即修改密码',
      type: 'error',
      time: '2025-12-14 14:10',
      read: false,
      sender: '安全中心',
    },
    {
      id: 6,
      title: '系统更新完成',
      content: '系统已完成版本更新，新增了通知中心功能',
      type: 'success',
      time: '2025-12-14 10:00',
      read: true,
    },
    {
      id: 7,
      title: '备份提醒',
      content: '本周系统备份已完成，请确认数据完整性',
      type: 'info',
      time: '2025-12-13 15:30',
      read: true,
      sender: '运维团队',
    },
    {
      id: 8,
      title: '新文章发布',
      content: '用户 "技术大牛" 发布了一篇新文章 "TypeScript进阶技巧"',
      type: 'info',
      time: '2025-12-13 11:20',
      read: true,
      link: '/article',
    },
  ])

  // 未读数量
  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.read).length
  })

  // 统计信息
  const stats = computed<NotificationStats>(() => {
    const today = new Date().toDateString()

    const todayCount = notifications.value.filter((n) => {
      return new Date(n.time).toDateString() === today
    }).length

    return {
      unreadCount: unreadCount.value,
      totalCount: notifications.value.length,
      todayCount,
    }
  })

  // 获取通知列表（分页）
  const getNotifications = (page = 1, pageSize = 10) => {
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      list: notifications.value.slice(start, end),
      total: notifications.value.length,
      page,
      pageSize,
    }
  }

  // 标记为已读
  const markAsRead = (id: number | string) => {
    const item = notifications.value.find((n) => n.id === id)
    if (item) {
      item.read = true
    }
  }

  // 全部标记为已读
  const markAllAsRead = () => {
    notifications.value.forEach((n) => {
      n.read = true
    })
  }

  // 删除通知
  const deleteNotification = (id: number | string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  // 清空通知
  const clearAll = () => {
    notifications.value = []
  }

  /**
   * ✅ 添加新通知（关键修复点）
   * ❌ 不再使用 Partial<Notification>
   * ❌ 不再使用 as Notification
   */
  const addNotification = (payload: {
    title: string
    content: string
    type: 'info' | 'success' | 'warning' | 'error'
    link?: string
    sender?: string
  }): Notification => {
    const newNotification: Notification = {
      id: Date.now(),
      title: payload.title,
      content: payload.content,
      type: payload.type,
      time: new Date().toLocaleString('zh-CN'),
      read: false,
      ...(payload.link && { link: payload.link }),
      ...(payload.sender && { sender: payload.sender }),
    }

    notifications.value.unshift(newNotification)
    return newNotification
  }

  // 模拟实时通知推送
  const simulateNewNotification = () => {
    const types = ['info', 'success', 'warning', 'error'] as const
    const titles = ['系统通知', '新消息提醒', '审核通知', '安全提醒', '数据更新'] as const

    const type = types[Math.floor(Math.random() * types.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]

    addNotification({
      title,
      content: `这是模拟的实时通知内容，类型：${type}`,
      type,
      sender: '系统',
    })
  }

  return {
    notifications,
    unreadCount,
    stats,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
    simulateNewNotification,
  }
})

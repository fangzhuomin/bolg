// src/types/notification.ts

export interface Notification {
  id: number | string
  title: string
  content: string
  type: 'success' | 'warning' | 'error' | 'info'
  time: string
  read: boolean
  link?: string
  sender?: string
}

export interface NotificationStats {
  unreadCount: number
  totalCount: number
  todayCount: number
}

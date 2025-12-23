// 基础类型定义
export interface User {
  id: number
  username: string
  avatar: string
  role: 'user' | 'admin'
  email?: string
}

export interface Article {
  id: number
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  views: number
  comments: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: number
  content: string
  author: string
  articleId: number
  createdAt: string
}

// 通知类型
export interface Notification {
  id: number
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  time: string
}

// API响应格式 - 修复了 any 类型
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// 通用键值对类型（可选，如果需要的话）
export interface KeyValue {
  key: string
  value: string | number
}

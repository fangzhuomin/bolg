// 项目配置
export const config = {
  // 应用信息
  app: {
    name: '博客文章管理系统',
    version: '1.0.0',
    description: '基于 Vue 3 + TypeScript 的博客管理系统',
  },

  // API 配置
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    withCredentials: true,
  },

  // 本地存储配置
  storage: {
    prefix: 'blog_',
    tokenKey: 'token',
    userKey: 'user_info',
  },

  // 分页配置
  pagination: {
    pageSizes: [10, 20, 50, 100],
    defaultPageSize: 10,
    layout: 'total, sizes, prev, pager, next, jumper',
  },
}

export default config

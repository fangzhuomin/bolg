import { createRouter, createWebHistory } from 'vue-router'
import NotificationPage from '@/views/notification/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/notification',
      name: 'Notification',
      component: NotificationPage,
      meta: {
        title: '通知中心',
        icon: 'Bell',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { requiresGuest: true }, // 只有未登录用户能访问
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      component: () => import('@/components/layout/index.vue'),
      meta: { requiresAuth: true }, // 所有子路由都需要登录
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: '仪表盘' },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/profile/index.vue'),
          meta: { title: '个人中心', requiresAuth: true },
        },
        {
          path: 'article',
          name: 'article',
          component: () => import('@/views/article/index.vue'),
          meta: { title: '文章管理' },
        },
        {
          path: 'article/create',
          name: 'article-create',
          component: () => import('@/views/article/edit.vue'),
          meta: { title: '创建文章' },
        },
        {
          path: 'article/edit/:id',
          name: 'article-edit',
          component: () => import('@/views/article/edit.vue'),
          meta: { title: '编辑文章' },
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('@/views/category/index.vue'),
          meta: { title: '分类管理' },
        },
        {
          path: 'tag',
          name: 'tag',
          component: () => import('@/views/tag/index.vue'),
          meta: { title: '标签管理' },
        },
        {
          path: 'comment',
          name: 'comment',
          component: () => import('@/views/comment/index.vue'),
          meta: { title: '评论管理' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 博客管理系统`
  }

  // 检查登录状态
  if (to.meta.requiresAuth && !token) {
    // 需要登录但未登录，重定向到登录页
    next('/login')
    return
  }

  if (to.meta.requiresGuest && token) {
    // 已登录用户访问登录/注册页，重定向到首页
    next('/dashboard')
    return
  }

  // 如果访问根路径，根据登录状态跳转
  if (to.path === '/') {
    if (token) {
      next('/dashboard')
    } else {
      next('/login')
    }
    return
  }

  next()
})

export default router

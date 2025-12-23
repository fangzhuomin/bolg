import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { response } = error

    if (response) {
      switch (response.status) {
        case 401:
          // 未授权，跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          // 权限不足
          console.error('权限不足')
          break
        case 404:
          // 资源不存在
          console.error('请求的资源不存在')
          break
        case 500:
          // 服务器错误
          console.error('服务器错误')
          break
        default:
          console.error('请求错误:', response.status)
      }
    }

    return Promise.reject(error)
  },
)

export default request

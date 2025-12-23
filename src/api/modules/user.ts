// src/api/modules/user.ts

// 用户接口类型定义
export interface LoginParams {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterParams {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
  avatar: string
  role: 'admin' | 'user'
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

// 本地用户存储类型（用于 localStorage）
interface LocalUser {
  id: number
  username: string
  email: string
  password: string
  avatar?: string
  createdAt: string
  role: 'user'
}

// 用户登录
export const login = (data: LoginParams): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟验证
      if (data.username === 'admin' && data.password === '123456') {
        resolve({
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo',
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@blog.com',
            avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            role: 'admin',
            bio: '系统管理员',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        })
      } else {
        // 检查模拟的本地用户
        const users: LocalUser[] = JSON.parse(localStorage.getItem('users') || '[]')
        const foundUser = users.find(
          (user: LocalUser) => user.username === data.username && user.password === data.password,
        )

        if (foundUser) {
          resolve({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user_' + Date.now(),
            user: {
              id: foundUser.id,
              username: foundUser.username,
              email: foundUser.email,
              avatar:
                foundUser.avatar ||
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
              role: 'user',
              bio: '普通用户',
              createdAt: foundUser.createdAt,
              updatedAt: new Date().toISOString(),
            },
          })
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }
    }, 1000)
  })
}

// 用户注册
export const register = (data: RegisterParams): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users: LocalUser[] = JSON.parse(localStorage.getItem('users') || '[]')

      // 检查用户名是否已存在
      if (users.some((user: LocalUser) => user.username === data.username)) {
        reject(new Error('用户名已存在'))
        return
      }

      // 检查邮箱是否已存在
      if (users.some((user: LocalUser) => user.email === data.email)) {
        reject(new Error('邮箱已被注册'))
        return
      }

      // 添加新用户
      const newUser: LocalUser = {
        id: Date.now(),
        username: data.username,
        email: data.email,
        password: data.password,
        avatar: '',
        createdAt: new Date().toISOString(),
        role: 'user',
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      resolve(true)
    }, 1000)
  })
}

// 获取当前用户信息
export const getCurrentUser = (): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      reject(new Error('用户未登录'))
      return
    }

    try {
      const user: UserInfo = JSON.parse(userStr)
      resolve(user)
    } catch (error) {
      // 实际处理错误：这里我们使用了 error 参数
      console.error('解析用户信息失败:', error)
      reject(new Error('用户信息解析失败'))
    }
  })
}

// 退出登录
export const logout = (): Promise<void> => {
  return Promise.resolve()
}

// 更新用户信息
export const updateProfile = (data: Partial<UserInfo>): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user: UserInfo = JSON.parse(userStr)
        const updatedUser = { ...user, ...data, updatedAt: new Date().toISOString() }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        resolve(updatedUser)
      } catch (error) {
        // 实际处理错误：这里我们使用了 error 参数
        console.error('更新用户信息失败:', error)
        reject(new Error('用户信息解析失败'))
      }
    } else {
      reject(new Error('用户未登录'))
    }
  })
}

// 修改密码
export const changePassword = (data: {
  oldPassword: string
  newPassword: string
}): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟密码修改
    setTimeout(() => {
      // 记录一下修改密码的操作（实际项目中应该调用 API）
      console.log('修改密码:', data.oldPassword, data.newPassword)
      resolve(true)
    }, 1000)
  })
}

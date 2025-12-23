<template>
  <div class="profile-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h3>个人信息</h3>
          <el-button type="primary" @click="editMode = !editMode">
            {{ editMode ? '取消' : '编辑' }}
          </el-button>
        </div>
      </template>

      <div class="profile-content">
        <!-- 头像上传 -->
        <div class="avatar-section">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="user.avatar" :src="user.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="avatar-info">
            <h3>{{ user.username }}</h3>
            <p>{{ user.role === 'admin' ? '管理员' : '普通用户' }}</p>
            <el-tag :type="user.role === 'admin' ? 'danger' : 'success'" size="small">
              {{ user.role === 'admin' ? '管理员' : '用户' }}
            </el-tag>
          </div>
        </div>

        <!-- 个人信息表单 -->
        <el-form :model="form" label-width="100px" :disabled="!editMode">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item label="个人简介">
            <el-input
              v-model="form.bio"
              type="textarea"
              :rows="4"
              placeholder="介绍一下你自己吧"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-form-item v-if="editMode">
            <el-button type="primary" @click="saveProfile">保存修改</el-button>
            <el-button @click="editMode = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 安全设置 -->
    <el-card shadow="hover" class="mt-20">
      <template #header>
        <h3>安全设置</h3>
      </template>

      <div class="security-settings">
        <div class="setting-item">
          <div class="setting-info">
            <h4>修改密码</h4>
            <p>定期修改密码可以提高账号安全性</p>
          </div>
          <el-button type="primary" @click="showChangePassword = true">修改密码</el-button>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h4>登录记录</h4>
            <p>查看最近的登录活动</p>
          </div>
          <el-button @click="viewLoginHistory">查看记录</el-button>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h4>账号绑定</h4>
            <p>绑定第三方账号，方便登录</p>
          </div>
          <el-button @click="bindAccount">绑定账号</el-button>
        </div>
      </div>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showChangePassword" title="修改密码" width="400px">
      <el-form
        :model="passwordForm"
        label-width="80px"
        :rules="passwordRules"
        ref="passwordFormRef"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showChangePassword = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const editMode = ref(false)
const showChangePassword = ref(false)

const form = reactive({
  username: '',
  email: '',
  bio: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const user = ref({
  username: '',
  email: '',
  avatar: '',
  role: '',
  bio: '',
})

onMounted(() => {
  if (userStore.user) {
    user.value = {
      username: userStore.user.username || '',
      email: userStore.user.email || '',
      avatar: userStore.user.avatar || '',
      role: userStore.user.role || 'user',
      bio: '',
    }

    form.username = user.value.username
    form.email = user.value.email
    form.bio = user.value.bio
  }
})

const handleAvatarSuccess = (response: any) => {
  user.value.avatar = response.url
  userStore.updateProfile({ avatar: response.url })
  ElMessage.success('头像上传成功')
}

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }

  return isImage && isLt2M
}

const saveProfile = () => {
  userStore.updateProfile({
    username: form.username,
    email: form.email,
  })

  user.value.username = form.username
  user.value.email = form.email
  user.value.bio = form.bio

  editMode.value = false
  ElMessage.success('个人信息已更新')
}

const changePassword = () => {
  // 这里应该调用 API 修改密码
  showChangePassword.value = false
  ElMessage.success('密码修改成功')
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const viewLoginHistory = () => {
  ElMessage.info('登录记录功能开发中')
}

const bindAccount = () => {
  ElMessage.info('账号绑定功能开发中')
}
</script>

<style scoped lang="scss">
.profile-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .profile-content {
    .avatar-section {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .avatar-uploader {
        margin-right: 20px;

        :deep(.el-upload) {
          border: 1px dashed var(--el-border-color);
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: var(--el-transition-duration-fast);

          &:hover {
            border-color: var(--el-color-primary);
          }
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 100px;
          height: 100px;
          text-align: center;
          line-height: 100px;
        }

        .avatar {
          width: 100px;
          height: 100px;
          display: block;
          object-fit: cover;
        }
      }

      .avatar-info {
        h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        p {
          margin: 0 0 8px 0;
          color: #666;
        }
      }
    }
  }

  .security-settings {
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .setting-info {
        h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}

.mt-20 {
  margin-top: 20px;
}
</style>

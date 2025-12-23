<template>
  <div class="article-edit">
    <div class="edit-header">
      <h1>{{ isEdit ? '编辑文章' : '创建文章' }}</h1>
      <div class="header-actions">
        <el-button @click="$router.back()">取消</el-button>
        <el-button type="primary" @click="handleSave"> 保存{{ isEdit ? '修改' : '' }} </el-button>
        <el-button v-if="isEdit" type="success" @click="handlePublish">
          {{ form.status === 'published' ? '取消发布' : '发布' }}
        </el-button>
      </div>
    </div>

    <div class="edit-content">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入文章标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" placeholder="选择分类" style="width: 100%">
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签" prop="tags">
              <el-select v-model="form.tags" multiple placeholder="选择标签" style="width: 100%">
                <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="封面图片" prop="cover">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleCoverChange"
          >
            <img v-if="form.cover" :src="form.cover" class="cover-image" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="文章摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <div class="editor-container">
            <div class="editor-toolbar">
              <el-button-group>
                <el-button type="info" plain size="small">B</el-button>
                <el-button type="info" plain size="small">I</el-button>
                <el-button type="info" plain size="small">U</el-button>
                <el-button type="info" plain size="small">H1</el-button>
                <el-button type="info" plain size="small">H2</el-button>
              </el-button-group>
            </div>
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="15"
              placeholder="请输入文章内容"
            />
          </div>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="是否置顶">
              <el-switch v-model="form.isTop" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="允许评论">
              <el-switch v-model="form.allowComment" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="选择状态">
                <el-option label="草稿" value="draft" />
                <el-option label="已发布" value="published" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ArticleEdit',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface ArticleForm {
  id: number
  title: string
  category: number | string
  tags: number[]
  cover: string
  summary: string
  content: string
  isTop: boolean
  allowComment: boolean
  status: 'draft' | 'published'
}

interface Category {
  id: number
  name: string
}

interface Tag {
  id: number
  name: string
}

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const isEdit = computed(() => route.path.includes('/edit'))

// 表单数据
const form = reactive<ArticleForm>({
  id: 0,
  title: '',
  category: '',
  tags: [],
  cover: '',
  summary: '',
  content: '',
  isTop: false,
  allowComment: true,
  status: 'draft',
})

// 表单验证规则
const rules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 10, message: '文章内容至少需要 10 个字符', trigger: 'blur' },
  ],
}

// 分类数据
const categories = ref<Category[]>([
  { id: 1, name: '前端开发' },
  { id: 2, name: '后端开发' },
  { id: 3, name: '移动开发' },
  { id: 4, name: '人工智能' },
  { id: 5, name: '数据库' },
])

// 标签数据
const tags = ref<Tag[]>([
  { id: 1, name: 'Vue' },
  { id: 2, name: 'React' },
  { id: 3, name: 'TypeScript' },
  { id: 4, name: 'Node.js' },
  { id: 5, name: 'Python' },
  { id: 6, name: 'Java' },
  { id: 7, name: 'Spring Boot' },
  { id: 8, name: 'Docker' },
])

// 封面图片上传
const handleCoverChange: UploadProps['onChange'] = (file) => {
  // 这里应该实现图片上传逻辑
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      form.cover = e.target.result as string
    }
  }
  if (file.raw) {
    reader.readAsDataURL(file.raw)
  }
}

// 保存文章
const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 这里应该调用API保存文章
    console.log('保存文章:', form)

    ElMessage.success(isEdit.value ? '修改成功' : '创建成功')
    router.push('/article')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 发布文章
const handlePublish = () => {
  form.status = form.status === 'published' ? 'draft' : 'published'
  ElMessage.success(form.status === 'published' ? '文章已发布' : '文章已转为草稿')
}

// 如果是编辑模式，加载文章数据
onMounted(() => {
  if (isEdit.value) {
    // 模拟加载文章数据
    const editData = {
      id: 1,
      title: 'Vue 3 入门教程',
      category: 1, // 注意：这里使用了数字类型
      tags: [1, 2],
      cover: '',
      summary: '这是一篇关于Vue 3的入门教程，帮助初学者快速上手Vue 3开发。',
      content: '# Vue 3 入门教程\n\n这是文章内容...',
      isTop: false,
      allowComment: true,
      status: 'published' as 'published',
    }

    // 使用 Object.assign 但需要确保类型正确
    form.id = editData.id
    form.title = editData.title
    form.category = editData.category // 现在类型匹配了
    form.tags = editData.tags
    form.cover = editData.cover
    form.summary = editData.summary
    form.content = editData.content
    form.isTop = editData.isTop
    form.allowComment = editData.allowComment
    form.status = editData.status
  }
})
</script>

<style scoped lang="scss">
.article-edit {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-height: calc(100vh - 180px);

  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e8e8;

    h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .edit-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .editor-container {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;

    .editor-toolbar {
      padding: 10px;
      background: #f5f7fa;
      border-bottom: 1px solid #dcdfe6;
    }
  }

  :deep(.avatar-uploader) {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s;

      &:hover {
        border-color: #409eff;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .cover-image {
      width: 178px;
      height: 178px;
      object-fit: cover;
    }
  }
}
</style>

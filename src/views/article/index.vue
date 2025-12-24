<template>
  <div class="article-management">
    <div class="management-header">
      <h1>文章管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新建文章
        </el-button>
        <el-button @click="refreshList">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="文章标题">
          <el-input v-model="searchForm.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态">
            <el-option label="全部" value="" />
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="filteredArticleList" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="200">
        <template #default="{ row }">
          <!-- 编辑模式 -->
          <template v-if="row.editing">
            <el-input v-model="row.editTitle" size="small" placeholder="请输入标题" />
          </template>
          <!-- 查看模式 -->
          <template v-else>
            <span class="article-title">{{ row.title }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分类" width="120">
        <template #default="{ row }">
          <!-- 编辑模式 -->
          <template v-if="row.editing">
            <el-input v-model="row.editCategory" size="small" placeholder="请输入分类" />
          </template>
          <!-- 查看模式 -->
          <template v-else>
            {{ row.category }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="150">
        <template #default="{ row }">
          <!-- 编辑模式 -->
          <template v-if="row.editing">
            <el-input v-model="row.editTags" size="small" placeholder="标签用逗号分隔" />
          </template>
          <!-- 查看模式 -->
          <template v-else>
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 5px">
              {{ tag }}
            </el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="views" label="浏览" width="80" />
      <el-table-column prop="comments" label="评论" width="80" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <!-- 编辑模式 -->
          <template v-if="row.editing">
            <el-select v-model="row.editStatus" size="small">
              <el-option label="草稿" value="draft" />
              <el-option label="已发布" value="published" />
            </el-select>
          </template>
          <!-- 查看模式 -->
          <template v-else>
            <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <!-- 编辑/保存按钮 -->
          <el-button v-if="!row.editing" type="primary" size="small" @click="startEdit(row)">
            编辑
          </el-button>
          <el-button v-else type="success" size="small" @click="saveEdit(row)"> 保存 </el-button>

          <!-- 取消编辑按钮 -->
          <el-button
            v-if="row.editing"
            size="small"
            @click="cancelEdit(row)"
            style="margin-left: 5px"
          >
            取消
          </el-button>

          <!-- 删除按钮 -->
          <el-button type="danger" size="small" @click="handleDelete(row)" style="margin-left: 5px">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredTotal"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ArticleManagement',
}
</script>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'

// 定义文章接口
interface Article {
  id: number
  title: string
  category: string
  tags: string[]
  views: number
  comments: number
  status: 'draft' | 'published'
  createdAt: string
  editing?: boolean
  editTitle?: string
  editCategory?: string
  editTags?: string
  editStatus?: 'draft' | 'published'
}

// 搜索表单
const searchForm = reactive({
  title: '',
  status: '',
})

// 文章列表原始数据
const rawArticleList = ref<Article[]>([
  {
    id: 1,
    title: 'Vue 3 入门教程',
    category: '前端开发',
    tags: ['Vue', '前端'],
    views: 150,
    comments: 12,
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'TypeScript 高级技巧',
    category: 'TypeScript',
    tags: ['TypeScript', '编程'],
    views: 89,
    comments: 5,
    status: 'draft',
    createdAt: '2024-01-14',
  },
  {
    id: 3,
    title: 'Element Plus 使用指南',
    category: 'UI框架',
    tags: ['Element', 'UI'],
    views: 234,
    comments: 18,
    status: 'published',
    createdAt: '2024-01-13',
  },
  {
    id: 4,
    title: 'React 18 新特性解析',
    category: '前端开发',
    tags: ['React', 'JavaScript'],
    views: 189,
    comments: 25,
    status: 'published',
    createdAt: '2024-01-12',
  },
  {
    id: 5,
    title: 'Node.js 性能优化',
    category: '后端开发',
    tags: ['Node.js', '性能优化'],
    views: 156,
    comments: 8,
    status: 'draft',
    createdAt: '2024-01-11',
  },
  {
    id: 6,
    title: 'CSS Grid 布局实战',
    category: 'CSS',
    tags: ['CSS', '布局'],
    views: 321,
    comments: 34,
    status: 'published',
    createdAt: '2024-01-10',
  },
  {
    id: 7,
    title: 'Python 数据分析入门',
    category: 'Python',
    tags: ['Python', '数据分析'],
    views: 267,
    comments: 19,
    status: 'published',
    createdAt: '2024-01-09',
  },
  {
    id: 8,
    title: 'Docker 容器化部署指南',
    category: 'DevOps',
    tags: ['Docker', '容器化'],
    views: 198,
    comments: 14,
    status: 'draft',
    createdAt: '2024-01-08',
  },
  {
    id: 9,
    title: '小程序开发全攻略',
    category: '小程序',
    tags: ['小程序', '微信'],
    views: 176,
    comments: 11,
    status: 'published',
    createdAt: '2024-01-07',
  },
  {
    id: 10,
    title: 'Git 高级使用技巧',
    category: '开发工具',
    tags: ['Git', '版本控制'],
    views: 145,
    comments: 7,
    status: 'published',
    createdAt: '2024-01-06',
  },
])

// 分页
const currentPage = ref(1)
const pageSize = ref(5)
const loading = ref(false)

// 计算属性：根据搜索条件过滤文章
const filteredArticles = computed(() => {
  let result = [...rawArticleList.value]

  // 按标题搜索
  if (searchForm.title.trim()) {
    const keyword = searchForm.title.toLowerCase()
    result = result.filter((article) => article.title.toLowerCase().includes(keyword))
  }

  // 按状态筛选
  if (searchForm.status) {
    result = result.filter((article) => article.status === searchForm.status)
  }

  return result
})

// 计算属性：分页后的文章列表
const filteredArticleList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
})

// 计算属性：过滤后的总条数
const filteredTotal = computed(() => filteredArticles.value.length)

// 开始编辑文章
const startEdit = (article: Article) => {
  // 取消其他正在编辑的文章
  rawArticleList.value.forEach((item) => {
    if (item.editing && item.id !== article.id) {
      cancelEdit(item)
    }
  })

  article.editing = true
  article.editTitle = article.title
  article.editCategory = article.category
  article.editTags = article.tags.join(', ')
  article.editStatus = article.status
}

// 保存编辑
const saveEdit = (article: Article) => {
  // 检查标题
  const newTitle = article.editTitle ? article.editTitle.trim() : ''
  if (newTitle === '') {
    ElMessage.warning('标题不能为空')
    return
  }

  // 检查分类
  const newCategory = article.editCategory ? article.editCategory.trim() : ''
  if (newCategory === '') {
    ElMessage.warning('分类不能为空')
    return
  }

  // 更新文章信息
  article.title = newTitle
  article.category = newCategory

  // 处理标签
  const tags = article.editTags
    ? article.editTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : []
  article.tags = tags

  // 处理状态
  if (article.editStatus) {
    article.status = article.editStatus
  }

  article.editing = false

  ElMessage.success('文章修改成功')
}

// 取消编辑
const cancelEdit = (article: Article) => {
  article.editing = false
  article.editTitle = undefined
  article.editCategory = undefined
  article.editTags = undefined
  article.editStatus = undefined
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('搜索完成')
}

// 重置搜索
const resetSearch = () => {
  searchForm.title = ''
  searchForm.status = ''
  currentPage.value = 1
  ElMessage.success('已重置搜索条件')
}

// 创建文章
const handleCreate = () => {
  // 生成新ID
  const maxId =
    rawArticleList.value.length > 0 ? Math.max(...rawArticleList.value.map((a) => a.id)) : 0
  const newId = maxId + 1

  // 创建新文章
  const newArticle: Article = {
    id: newId,
    title: '新文章',
    category: '未分类',
    tags: ['新标签'],
    views: 0,
    comments: 0,
    status: 'draft',
    createdAt: new Date().toISOString().split('T')[0] as string, // 使用类型断言
    editing: true,
    editTitle: '新文章',
    editCategory: '未分类',
    editTags: '新标签',
    editStatus: 'draft',
  }

  // 添加到列表开头
  rawArticleList.value.unshift(newArticle)

  // 重置到第一页
  currentPage.value = 1

  ElMessage.success('已创建新文章，请编辑')
}

// 删除文章
const handleDelete = (article: Article) => {
  ElMessageBox.confirm(`确定要删除文章 "${article.title}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 从前端数据中删除
      const index = rawArticleList.value.findIndex((item) => item.id === article.id)
      if (index !== -1) {
        rawArticleList.value.splice(index, 1)

        // 如果当前页没有数据了，且不是第一页，则跳转到前一页
        if (filteredArticleList.value.length === 0 && currentPage.value > 1) {
          currentPage.value = currentPage.value - 1
        }

        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      // 用户取消
    })
}

// 刷新列表
const refreshList = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    ElMessage.success('刷新成功')
  }, 500)
}

// 分页事件
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  // 初始化时加载数据
  refreshList()
})
</script>

<style scoped lang="scss">
.article-management {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-height: calc(100vh - 180px);

  .management-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

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

  .search-bar {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .article-title {
    color: #409eff;
    cursor: default;
  }

  .pagination {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

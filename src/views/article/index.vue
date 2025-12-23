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

    <el-table :data="articleList" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="200">
        <template #default="{ row }">
          <router-link :to="`/article/edit/${row.id}`" class="article-link">
            {{ row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="tags" label="标签" width="150">
        <template #default="{ row }">
          <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 5px">
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="views" label="浏览" width="80" />
      <el-table-column prop="comments" label="评论" width="80" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'

interface Article {
  id: number
  title: string
  category: string
  tags: string[]
  views: number
  comments: number
  status: 'draft' | 'published'
  createdAt: string
}

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  title: '',
  status: '',
})

// 文章列表数据
const articleList = ref<Article[]>([
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
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)
const loading = ref(false)

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  // 这里应该调用API搜索
  console.log('搜索条件:', searchForm)
}

// 重置搜索
const resetSearch = () => {
  searchForm.title = ''
  searchForm.status = ''
  handleSearch()
}

// 创建文章
const handleCreate = () => {
  router.push('/article/create')
}

// 编辑文章
const handleEdit = (article: Article) => {
  router.push(`/article/edit/${article.id}`)
}

// 删除文章
const handleDelete = (article: Article) => {
  ElMessageBox.confirm(`确定要删除文章 "${article.title}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里应该调用API删除
      ElMessage.success('删除成功')
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
  // 重新获取数据
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  // 重新获取数据
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

  .article-link {
    color: #409eff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .pagination {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

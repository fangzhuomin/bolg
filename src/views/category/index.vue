<template>
  <div class="category-manage">
    <div class="manage-header">
      <h1>分类管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          新增分类
        </el-button>
      </div>
    </div>

    <el-table :data="categoryList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="slug" label="标识符" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="articleCount" label="文章数" width="100" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑分类' : '新增分类'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="标识符" prop="slug">
          <el-input v-model="form.slug" placeholder="请输入URL标识符" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const isEdit = ref(false)

// 分类列表数据
const categoryList = ref([
  {
    id: 1,
    name: '前端开发',
    slug: 'frontend',
    description: '前端技术相关',
    articleCount: 15,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: '后端开发',
    slug: 'backend',
    description: '后端技术相关',
    articleCount: 23,
    createdAt: '2024-01-02',
  },
  {
    id: 3,
    name: '数据库',
    slug: 'database',
    description: '数据库技术',
    articleCount: 8,
    createdAt: '2024-01-03',
  },
])

// 表单数据
const form = reactive({
  id: 0,
  name: '',
  slug: '',
  description: '',
})

// 表单规则
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入标识符', trigger: 'blur' }],
}

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(form, { id: 0, name: '', slug: '', description: '' })
  dialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = (row: any) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = () => {
  if (isEdit.value) {
    // 更新逻辑
    const index = categoryList.value.findIndex((item) => item.id === form.id)
    if (index !== -1) {
      categoryList.value[index] = { ...categoryList.value[index], ...form }
    }
    ElMessage.success('更新成功')
  } else {
    // 新增逻辑
    const newCategory = {
      id: categoryList.value.length + 1,
      ...form,
      articleCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    categoryList.value.push(newCategory)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
}

// 删除分类
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除分类 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const index = categoryList.value.findIndex((item) => item.id === row.id)
      if (index !== -1) {
        categoryList.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      // 用户取消
    })
}
</script>

<style scoped lang="scss">
.category-manage {
  background: white;
  padding: 24px;
  border-radius: 8px;

  .manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
  }
}
</style>

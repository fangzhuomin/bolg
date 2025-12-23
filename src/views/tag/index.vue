<template>
  <div class="tag-manage">
    <div class="manage-header">
      <h1>标签管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          新增标签
        </el-button>
      </div>
    </div>

    <div class="tag-cloud">
      <el-tag
        v-for="tag in tagList"
        :key="tag.id"
        :type="tagTypes[tag.id % 5]"
        size="large"
        class="tag-item"
        closable
        @close="handleDelete(tag)"
      >
        {{ tag.name }}
        <span class="tag-count">({{ tag.articleCount }})</span>
      </el-tag>
    </div>

    <!-- 添加/编辑标签对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑标签' : '新增标签'" width="400px">
      <el-form ref="formRef" :model="form">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标签描述（可选）"
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

// 标签类型数组
const tagTypes = ['', 'success', 'info', 'warning', 'danger']

// 标签列表数据
const tagList = ref([
  { id: 1, name: 'Vue', description: 'Vue.js相关', articleCount: 25 },
  { id: 2, name: 'React', description: 'React相关', articleCount: 18 },
  { id: 3, name: 'TypeScript', description: 'TypeScript相关', articleCount: 32 },
  { id: 4, name: 'Node.js', description: 'Node.js相关', articleCount: 15 },
  { id: 5, name: 'Python', description: 'Python相关', articleCount: 28 },
  { id: 6, name: 'Java', description: 'Java相关', articleCount: 22 },
  { id: 7, name: 'Spring Boot', description: 'Spring Boot相关', articleCount: 19 },
  { id: 8, name: 'Docker', description: 'Docker相关', articleCount: 12 },
])

// 表单数据
const form = reactive({
  id: 0,
  name: '',
  description: '',
})

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(form, { id: 0, name: '', description: '' })
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = () => {
  if (isEdit.value) {
    // 更新逻辑
    const index = tagList.value.findIndex((item) => item.id === form.id)
    if (index !== -1) {
      tagList.value[index] = { ...tagList.value[index], ...form }
    }
    ElMessage.success('更新成功')
  } else {
    // 新增逻辑
    const newTag = {
      id: tagList.value.length + 1,
      ...form,
      articleCount: 0,
    }
    tagList.value.push(newTag)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
}

// 删除标签
const handleDelete = (tag: any) => {
  ElMessageBox.confirm(`确定要删除标签 "${tag.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const index = tagList.value.findIndex((item) => item.id === tag.id)
      if (index !== -1) {
        tagList.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      // 用户取消
    })
}
</script>

<style scoped lang="scss">
.tag-manage {
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

  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .tag-item {
    padding: 10px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-3px);
    }

    .tag-count {
      margin-left: 4px;
      font-size: 12px;
      opacity: 0.8;
    }
  }
}
</style>

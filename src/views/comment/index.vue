<template>
  <div class="comment-management">
    <div class="management-header">
      <h1>评论管理</h1>
      <div class="header-actions">
        <el-button @click="refreshList">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <div class="filter-bar">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="文章标题">
          <el-input v-model="filterForm.articleTitle" placeholder="搜索文章标题" clearable />
        </el-form-item>
        <el-form-item label="评论状态">
          <el-select v-model="filterForm.status" placeholder="全部状态">
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="commentList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="articleTitle" label="文章标题" min-width="200" />
      <el-table-column prop="content" label="评论内容" min-width="300">
        <template #default="{ row }">
          <div class="comment-content">{{ row.content }}</div>
          <div class="comment-meta">
            <span class="author">{{ row.author }}</span>
            <span class="time">{{ row.createdAt }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons">
            <!-- 审核操作按钮组 -->
            <div v-if="row.status === 'pending'" class="button-group">
              <el-button size="small" type="success" @click="handleApprove(row)"> 通过 </el-button>
              <el-button size="small" type="danger" @click="handleReject(row)"> 拒绝 </el-button>
            </div>

            <!-- 通用操作按钮组 -->
            <div class="button-group">
              <el-button size="small" @click="handleReply(row)">回复</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
      />
    </div>

    <!-- 回复对话框 -->
    <el-dialog v-model="replyDialogVisible" title="回复评论" width="600px">
      <el-form ref="replyFormRef" :model="replyForm">
        <el-form-item label="回复内容">
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="5"
            placeholder="请输入回复内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="replyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReply">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CommentManagement',
}
</script>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

// 定义评论接口类型
interface Comment {
  id: number
  articleTitle: string
  content: string
  author: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

// 定义状态类型
type CommentStatus = 'pending' | 'approved' | 'rejected'

// 过滤表单
const filterForm = reactive({
  articleTitle: '',
  status: '' as CommentStatus | '',
})

// 获取状态标签类型
const getStatusType = (status: CommentStatus): string => {
  const statusMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  }
  return statusMap[status]
}

// 获取状态显示文本
const getStatusText = (status: CommentStatus): string => {
  const textMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
  }
  return textMap[status]
}

// 评论列表数据
const commentList = ref<Comment[]>([
  {
    id: 1,
    articleTitle: 'Vue 3 入门教程',
    content: '这篇文章写得真好，对我帮助很大！',
    author: '张三',
    status: 'approved',
    createdAt: '2024-01-15 10:30',
  },
  {
    id: 2,
    articleTitle: 'TypeScript 高级技巧',
    content: '期待作者更新更多关于泛型的内容',
    author: '李四',
    status: 'pending',
    createdAt: '2024-01-15 14:20',
  },
  {
    id: 3,
    articleTitle: 'Element Plus 使用指南',
    content: 'UI组件很漂亮，感谢分享',
    author: '王五',
    status: 'rejected',
    createdAt: '2024-01-14 16:45',
  },
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

// 回复对话框
const replyDialogVisible = ref(false)
const replyForm = reactive({
  commentId: 0,
  content: '',
})

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', filterForm)
}

// 重置搜索
const resetSearch = () => {
  filterForm.articleTitle = ''
  filterForm.status = ''
  handleSearch()
}

// 刷新列表
const refreshList = () => {
  ElMessage.success('刷新成功')
}

// 通过评论
const handleApprove = (row: Comment) => {
  row.status = 'approved'
  ElMessage.success('评论已通过')
}

// 拒绝评论
const handleReject = (row: Comment) => {
  row.status = 'rejected'
  ElMessage.success('评论已拒绝')
}

// 回复评论
const handleReply = (row: Comment) => {
  replyForm.commentId = row.id
  replyForm.content = ''
  replyDialogVisible.value = true
}

// 提交回复
const submitReply = () => {
  ElMessage.success('回复成功')
  replyDialogVisible.value = false
}

// 删除评论
const handleDelete = (row: Comment) => {
  ElMessageBox.confirm(`确定要删除这条评论吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const index = commentList.value.findIndex((item) => item.id === row.id)
      if (index !== -1) {
        commentList.value.splice(index, 1)
        total.value -= 1
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      // 用户取消
    })
}
</script>

<style scoped lang="scss">
.comment-management {
  background: white;
  padding: 24px;
  border-radius: 8px;

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
  }

  .filter-bar {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .comment-content {
    margin-bottom: 8px;
    line-height: 1.5;
    word-break: break-word;
  }

  .comment-meta {
    font-size: 12px;
    color: #999;

    .author {
      margin-right: 16px;
    }
  }

  // 操作按钮布局
  .action-buttons {
    display: flex;
    align-items: center;
    gap: 12px;

    .button-group {
      display: flex;
      gap: 8px;

      &:first-child {
        border-right: 1px solid #e8e8e8;
        padding-right: 12px;
      }
    }
  }

  .pagination {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

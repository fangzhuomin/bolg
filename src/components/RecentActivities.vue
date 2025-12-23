<template>
  <el-card shadow="hover" class="activities-card">
    <template #header>
      <div class="card-header">
        <span>最近活动</span>
        <el-button type="primary" text @click="$emit('view-all')">查看全部</el-button>
      </div>
    </template>

    <div class="activities-list">
      <div v-for="activity in activities" :key="activity.id" class="activity-item">
        <div class="activity-avatar">
          <el-avatar :size="36" :src="activity.avatar" />
        </div>
        <div class="activity-content">
          <p class="activity-text">
            <strong>{{ activity.user }}</strong> {{ activity.action }}
            <span v-if="activity.target" class="activity-target">{{ activity.target }}</span>
          </p>
          <span class="activity-time">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
interface Activity {
  id: number
  user: string
  avatar: string
  action: string
  target?: string
  time: string
}

defineProps<{
  activities: Activity[]
}>()

defineEmits<{
  (e: 'view-all'): void
}>()
</script>

<style scoped lang="scss">
.activities-card {
  .activities-list {
    .activity-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .activity-avatar {
        margin-right: 12px;
      }

      .activity-content {
        flex: 1;

        .activity-text {
          margin: 0 0 4px 0;
          font-size: 14px;

          .activity-target {
            color: #1890ff;
            font-weight: 500;
          }
        }

        .activity-time {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>

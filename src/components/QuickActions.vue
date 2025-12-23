<template>
  <el-card shadow="hover" class="quick-actions-card">
    <template #header>
      <div class="card-header">
        <span>快捷操作</span>
        <el-button type="primary" text @click="$emit('view-all')">查看全部</el-button>
      </div>
    </template>

    <el-row :gutter="20">
      <el-col :xs="12" :sm="8" :md="6" v-for="action in actions" :key="action.label">
        <div class="action-item" @click="$emit('action-click', action)">
          <div class="action-icon" :style="{ background: action.color }">
            <component :is="action.icon" :size="24" color="white" />
          </div>
          <span class="action-label">{{ action.label }}</span>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface QuickAction {
  label: string
  icon: Component
  color: string
  path?: string
  action?: string
}

defineProps<{
  actions: QuickAction[]
}>()

defineEmits<{
  (e: 'action-click', action: QuickAction): void
  (e: 'view-all'): void
}>()
</script>

<style scoped lang="scss">
.quick-actions-card {
  margin-bottom: 24px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-3px);

      .action-icon {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .action-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      transition: box-shadow 0.3s;
    }

    .action-label {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>

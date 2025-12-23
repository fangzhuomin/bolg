<template>
  <el-row :gutter="20" class="stats-row">
    <el-col :xs="24" :sm="12" :md="6" v-for="stat in stats" :key="stat.title">
      <el-card shadow="hover" class="stat-card" @click="stat.onClick">
        <div class="stat-content">
          <div class="stat-icon" :style="{ background: stat.color + '20' }">
            <component :is="stat.icon" :color="stat.color" :size="24" />
          </div>
          <div class="stat-info">
            <h3>{{ stat.title }}</h3>
            <p class="stat-number">{{ stat.value }}</p>
            <p class="stat-trend" :class="stat.trendClass" v-if="stat.trend">
              <el-icon v-if="stat.trend > 0"><Top /></el-icon>
              <el-icon v-else><Bottom /></el-icon>
              {{ Math.abs(stat.trend) }}%
            </p>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Top, Bottom } from '@element-plus/icons-vue'
import type { Component } from 'vue'

interface StatItem {
  title: string
  value: number | string
  icon: Component
  color: string
  trend?: number
  trendClass?: string
  onClick?: () => void
}

// 使用 defineProps 但不需要赋值给变量
defineProps<{
  stats: StatItem[]
}>()
</script>

<style scoped lang="scss">
.stats-row {
  margin-bottom: 24px;

  .stat-card {
    border: none;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-info {
        flex: 1;

        h3 {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #666;
          font-weight: normal;
        }

        .stat-number {
          margin: 0 0 4px 0;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .stat-trend {
          margin: 0;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;

          &.positive {
            color: #52c41a;
          }

          &.negative {
            color: #ff4d4f;
          }
        }
      }
    }
  }
}
</style>

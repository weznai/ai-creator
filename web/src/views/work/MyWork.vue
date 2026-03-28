<template>
  <div class="my-work-page">
    <div class="page-header">
      <div class="page-title">
        <div class="icon"><folder-outlined /></div>
        我的作品
      </div>
      <div class="page-actions">
        <a-radio-group v-model:value="activeTab" button-style="solid" @change="handleTabChange">
          <a-radio-button value="image">
            <picture-outlined /> 图片
          </a-radio-button>
          <a-radio-button value="video">
            <video-camera-outlined /> 视频
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <a-spin :spinning="loading">
      <div v-if="works.length > 0" class="work-grid">
        <div v-for="item in works" :key="item.id" class="media-card work-card">
          <div class="media-card-cover">
            <img
              v-if="activeTab === 'image' && item.resultImages?.length"
              :src="item.resultImages[0]"
              :alt="item.prompt"
              loading="lazy"
            />
            <div v-else class="video-placeholder">
              <play-circle-outlined style="font-size: 32px; color: #94a3b8" />
            </div>
            <div class="overlay">
              <div class="overlay-actions">
                <a-button
                  type="text"
                  size="small"
                  class="action-btn"
                  @click.stop="handleDelete(item)"
                >
                  <delete-outlined />
                </a-button>
              </div>
            </div>
            <div class="status-badge" :class="`status-${item.status}`">
              {{ statusMap[item.status] || item.status }}
            </div>
          </div>
          <div class="media-card-body">
            <div class="media-card-title">{{ item.prompt?.slice(0, 30) || '未命名作品' }}</div>
            <div class="media-card-meta">
              <span class="meta-tag">{{ item.modelName || '-' }}</span>
              <span class="meta-tag">{{ item.taskType || '-' }}</span>
            </div>
            <div class="work-time">{{ formatDate(item.createdAt) }}</div>
          </div>
        </div>
      </div>
      <a-empty v-else-if="!loading" description="暂无作品" style="padding: 80px 0" />
    </a-spin>

    <div v-if="total > pageSize" class="load-more">
      <a-button type="primary" ghost :loading="loading" @click="loadMore" :disabled="works.length >= total">
        {{ works.length >= total ? '已加载全部' : '加载更多' }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  FolderOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import { taskApi } from '@api/task';
import dayjs from 'dayjs';

const activeTab = ref('image');
const loading = ref(false);
const works = ref<any[]>([]);
const page = ref(1);
const pageSize = 20;
const total = ref(0);

const statusMap: Record<string, string> = {
  pending: '生成中',
  processing: '处理中',
  success: '已完成',
  failed: '失败',
};

onMounted(() => {
  fetchWorks();
});

const fetchWorks = async (reset = false) => {
  if (reset) {
    page.value = 1;
    works.value = [];
  }
  loading.value = true;
  try {
    const api = activeTab.value === 'image' ? taskApi.getImageTaskList : taskApi.getVideoTaskList;
    const result = await api({ page: page.value, pageSize });
    if (reset) {
      works.value = result.list;
    } else {
      works.value.push(...result.list);
    }
    total.value = result.total;
  } catch {
    // handled
  } finally {
    loading.value = false;
  }
};

const handleTabChange = () => {
  fetchWorks(true);
};

const loadMore = () => {
  page.value++;
  fetchWorks();
};

const handleDelete = (item: any) => {
  message.info('删除功能开发中');
};

const formatDate = (date?: string) => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};
</script>

<style scoped lang="less">
.my-work-page {
  padding: 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.work-card {
  .status-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;

    &.status-success {
      background: rgba(34, 197, 94, 0.15);
      color: #16a34a;
    }

    &.status-pending, &.status-processing {
      background: rgba(22, 119, 255, 0.15);
      color: #1677ff;
    }

    &.status-failed {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }
  }
}

.overlay-actions {
  display: flex;
  gap: 4px;

  .action-btn {
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 6px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(239, 68, 68, 0.7);
      color: #fff;
    }
  }
}

.meta-tag {
  font-size: 12px;
  color: #94a3b8;
}

.work-time {
  font-size: 12px;
  color: #c0c8d4;
  margin-top: 8px;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

.load-more {
  text-align: center;
  margin-top: 32px;
}
</style>

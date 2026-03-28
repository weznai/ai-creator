<template>
  <div class="material-page">
    <div class="page-header">
      <div class="page-title">
        <div class="icon"><appstore-outlined /></div>
        材料库
      </div>
      <div class="page-actions">
        <a-input-search
          v-model:value="keyword"
          placeholder="搜索提示词、场景..."
          style="width: 280px"
          allow-clear
          @search="handleSearch"
        />
        <a-radio-group v-model:value="filterType" button-style="solid" @change="handleSearch">
          <a-radio-button value="">全部</a-radio-button>
          <a-radio-button value="image">图片</a-radio-button>
          <a-radio-button value="video">视频</a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <a-spin :spinning="loading">
      <div v-if="materials.length > 0" class="material-grid">
        <div
          v-for="item in materials"
          :key="item.id"
          class="media-card"
          @click="router.push(`/material/${item.id}`)"
        >
          <div class="media-card-cover">
            <img
              v-if="item.materialType === 'image'"
              :src="item.thumbnailUrl || item.mediaUrl"
              :alt="item.title"
              loading="lazy"
            />
            <div v-else class="video-placeholder">
              <video-camera-outlined style="font-size: 32px; color: #94a3b8" />
            </div>
            <div class="overlay">
              <div class="overlay-actions">
                <a-button
                  type="text"
                  size="small"
                  class="action-btn"
                  @click.stop="handleCollect(item)"
                >
                  <heart-outlined :style="{ color: item.collected ? '#ef4444' : '#fff' }" />
                </a-button>
                <a-button type="text" size="small" class="action-btn">
                  <eye-outlined />
                </a-button>
              </div>
            </div>
            <div v-if="item.materialType === 'video'" class="type-badge video-badge">
              <play-circle-outlined /> 视频
            </div>
          </div>
          <div class="media-card-body">
            <div class="media-card-title">{{ item.title || '未命名' }}</div>
            <div class="media-card-meta">
              <span v-if="item.scene" class="meta-tag">
                <tag-outlined /> {{ item.scene }}
              </span>
              <span class="meta-tag">
                <eye-outlined /> {{ item.viewCount || 0 }}
              </span>
            </div>
            <div v-if="item.prompt" class="media-card-prompt">
              {{ item.prompt }}
            </div>
          </div>
        </div>
      </div>
      <a-empty v-else-if="!loading" description="暂无材料" style="padding: 80px 0" />
    </a-spin>

    <div v-if="pagination.total > pagination.pageSize" class="load-more">
      <a-button
        type="primary"
        ghost
        :loading="loading"
        @click="loadMore"
        :disabled="materials.length >= pagination.total"
      >
        {{ materials.length >= pagination.total ? '已加载全部' : '加载更多' }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  AppstoreOutlined,
  HeartOutlined,
  EyeOutlined,
  TagOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons-vue';
import { materialApi } from '@api/material';
import type { Material } from '@types/material';

const router = useRouter();
const loading = ref(false);
const materials = ref<(Material & { collected?: boolean })[]>([]);
const keyword = ref('');
const filterType = ref('');

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

onMounted(() => {
  fetchMaterials();
});

const fetchMaterials = async (reset = false) => {
  if (reset) {
    pagination.current = 1;
    materials.value = [];
  }
  loading.value = true;
  try {
    const result = await materialApi.getList({
      keyword: keyword.value || undefined,
      type: filterType.value || undefined,
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
    if (reset) {
      materials.value = result.list;
    } else {
      materials.value.push(...result.list);
    }
    pagination.total = result.total;
  } catch {
    // handled
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  fetchMaterials(true);
};

const loadMore = () => {
  pagination.current++;
  fetchMaterials();
};

const handleCollect = (item: Material & { collected?: boolean }) => {
  if (item.collected) {
    materialApi.cancelCollect(item.id).then(() => {
      item.collected = false;
      item.collectCount = Math.max(0, (item.collectCount || 0) - 1);
      message.success('已取消收藏');
    });
  } else {
    materialApi.collect(item.id).then(() => {
      item.collected = true;
      item.collectCount = (item.collectCount || 0) + 1;
      message.success('收藏成功');
    });
  }
};
</script>

<style scoped lang="less">
.material-page {
  padding: 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  .page-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.material-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;

  &.video-badge {
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
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
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
    }
  }
}

.media-card-prompt {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
}

.meta-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
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

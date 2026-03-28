<template>
  <div class="collection-page">
    <div class="page-header">
      <div class="page-title">
        <div class="icon"><heart-outlined /></div>
        我的收藏
      </div>
    </div>

    <a-spin :spinning="loading">
      <div v-if="collections.length > 0" class="collection-grid">
        <div v-for="item in collections" :key="item.id" class="media-card collection-card">
          <div class="media-card-cover" @click="router.push(`/material/${item.id}`)">
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
                  @click.stop="handleRemove(item.id)"
                >
                  <heart-filled style="color: #ef4444" />
                </a-button>
              </div>
            </div>
            <div v-if="item.materialType === 'video'" class="type-badge">
              <play-circle-outlined /> 视频
            </div>
          </div>
          <div class="media-card-body" @click="router.push(`/material/${item.id}`)">
            <div class="media-card-title">{{ item.title || '未命名' }}</div>
            <div class="media-card-meta">
              <span v-if="item.scene" class="meta-tag">
                <tag-outlined /> {{ item.scene }}
              </span>
              <span class="meta-tag">
                <heart-filled style="color: #ef4444" /> {{ item.collectCount || 0 }}
              </span>
            </div>
          </div>
          <div class="card-footer">
            <a-popconfirm title="确定取消收藏？" @confirm="handleRemove(item.id)">
              <a-button type="text" size="small" danger class="remove-btn">
                <close-outlined /> 取消收藏
              </a-button>
            </a-popconfirm>
          </div>
        </div>
      </div>
      <a-empty v-else-if="!loading" description="暂无收藏" style="padding: 80px 0" />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  HeartOutlined,
  HeartFilled,
  TagOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';
import { workApi } from '@api/work';

const router = useRouter();
const loading = ref(false);
const collections = ref<any[]>([]);

onMounted(() => {
  fetchCollections();
});

const fetchCollections = async () => {
  loading.value = true;
  try {
    const result = await workApi.getCollections();
    collections.value = (result as any)?.list || result || [];
  } catch {
    // handled
  } finally {
    loading.value = false;
  }
};

const handleRemove = async (id: any) => {
  try {
    await workApi.removeCollection(String(id));
    message.success('已取消收藏');
    fetchCollections();
  } catch {
    // handled
  }
};
</script>

<style scoped lang="less">
.collection-page {
  padding: 0;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.collection-card {
  .card-footer {
    padding: 0 12px 12px;

    .remove-btn {
      font-size: 12px;
      padding: 0;
      height: 28px;
    }
  }
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
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
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
</style>

<template>
  <div class="detail-page">
    <a-page-header
      title="材料详情"
      @back="router.push('/material')"
      class="detail-header"
    >
      <template #extra>
        <a-space>
          <a-button @click="handleCollect">
            <template #icon>
              <heart-outlined :style="{ color: isCollected ? '#ef4444' : '' }" />
            </template>
            {{ isCollected ? '已收藏' : '收藏' }}
          </a-button>
          <a-button type="primary" @click="handleDownload">
            <template #icon><download-outlined /></template>
            下载
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <div v-if="material" class="detail-layout">
        <div class="preview-section">
          <a-card class="preview-card" :bordered="false">
            <div class="preview-wrapper">
              <img
                v-if="material.materialType === 'image'"
                :src="material.mediaUrl"
                :alt="material.title"
                class="preview-media"
              />
              <div v-else class="preview-video">
                <video-camera-outlined style="font-size: 64px; color: #94a3b8" />
                <p style="margin-top: 12px; color: #94a3b8">视频预览</p>
              </div>
            </div>
          </a-card>
        </div>

        <div class="info-section">
          <a-card class="info-card" :bordered="false">
            <h2 class="detail-title">{{ material.title || '未命名' }}</h2>

            <div class="meta-tags">
              <a-tag v-if="material.materialType" color="blue">
                {{ material.materialType === 'image' ? '图片' : '视频' }}
              </a-tag>
              <a-tag v-if="material.scene" color="purple">
                {{ material.scene }}
              </a-tag>
              <a-tag v-if="material.ecommerceWork" color="orange">
                {{ material.ecommerceWork }}
              </a-tag>
            </div>

            <a-divider style="margin: 16px 0" />

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">尺寸</span>
                <span class="info-value">{{ material.width && material.height ? `${material.width} x ${material.height}` : '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">时长</span>
                <span class="info-value">{{ material.duration ? `${material.duration}s` : '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">浏览</span>
                <span class="info-value">{{ material.viewCount || 0 }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">收藏</span>
                <span class="info-value">{{ material.collectCount || 0 }}</span>
              </div>
              <div v-if="material.modelName" class="info-item">
                <span class="info-label">模型</span>
                <span class="info-value">{{ material.modelName }}</span>
              </div>
              <div v-if="material.address" class="info-item">
                <span class="info-label">地址</span>
                <span class="info-value">{{ material.address }}</span>
              </div>
            </div>

            <div v-if="material.prompt" class="prompt-section">
              <a-divider style="margin: 16px 0" />
              <h4 class="section-title">提示词</h4>
              <div class="prompt-content">{{ material.prompt }}</div>
              <a-button
                type="link"
                size="small"
                class="copy-btn"
                @click="handleCopyPrompt"
              >
                <copy-outlined /> 复制提示词
              </a-button>
            </div>

            <div v-if="material.tags" class="tags-section">
              <a-divider style="margin: 16px 0" />
              <h4 class="section-title">标签</h4>
              <div class="tags-list">
                <a-tag v-for="tag in material.tags.split(',')" :key="tag">
                  {{ tag }}
                </a-tag>
              </div>
            </div>

            <a-divider style="margin: 16px 0" />
            <div class="time-info">
              <span>创建时间：{{ formatDate(material.createdAt) }}</span>
            </div>
          </a-card>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  HeartOutlined,
  DownloadOutlined,
  CopyOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons-vue';
import { materialApi } from '@api/material';
import type { Material } from '@types/material';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const isCollected = ref(false);

const material = ref<Material | null>(null);

onMounted(() => {
  fetchMaterial();
});

const fetchMaterial = async () => {
  loading.value = true;
  try {
    const id = Number(route.params.id);
    const result = await materialApi.getDetail(id);
    material.value = result;
  } catch {
    // handled
  } finally {
    loading.value = false;
  }
};

const formatDate = (date?: string) => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

const handleCollect = () => {
  if (!material.value) return;
  if (isCollected.value) {
    materialApi.cancelCollect(material.value.id).then(() => {
      isCollected.value = false;
      message.success('已取消收藏');
    });
  } else {
    materialApi.collect(material.value.id).then(() => {
      isCollected.value = true;
      message.success('收藏成功');
    });
  }
};

const handleDownload = () => {
  if (material.value?.mediaUrl) {
    window.open(material.value.mediaUrl, '_blank');
  }
};

const handleCopyPrompt = () => {
  if (material.value?.prompt) {
    navigator.clipboard.writeText(material.value.prompt).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  }
};
</script>

<style scoped lang="less">
.detail-page {
  background: #fff;
  border-radius: 10px;
  padding: 0 24px 24px;
}

.detail-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.detail-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.preview-section {
  flex: 1;
  min-width: 0;
}

.preview-card {
  border-radius: 10px;
  overflow: hidden;

  .preview-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    background: #f8fafc;
    border-radius: 8px;
  }

  .preview-media {
    max-width: 100%;
    max-height: 600px;
    border-radius: 8px;
  }

  .preview-video {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }
}

.info-section {
  width: 380px;
  flex-shrink: 0;
}

.info-card {
  border-radius: 10px;

  .detail-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
  }
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .info-label {
      font-size: 12px;
      color: #94a3b8;
    }

    .info-value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 500;
    }
  }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.prompt-section {
  .prompt-content {
    font-size: 14px;
    color: #475569;
    line-height: 1.7;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #f1f5f9;
  }

  .copy-btn {
    padding: 0;
    margin-top: 8px;
    font-size: 13px;
  }
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.time-info {
  font-size: 13px;
  color: #94a3b8;
}

@media (max-width: 900px) {
  .detail-layout {
    flex-direction: column;
  }
  .info-section {
    width: 100%;
  }
}
</style>

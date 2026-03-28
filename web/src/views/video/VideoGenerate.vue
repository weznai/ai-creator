<template>
  <div class="video-generate-page">
    <div class="page-header">
      <div class="page-title">
        <div class="icon"><video-camera-outlined /></div>
        视频生成
      </div>
    </div>

    <div class="generate-layout">
      <div class="result-area">
        <a-card :bordered="false" class="result-card">
          <template #title>
            <div class="result-title">
              <span>生成结果</span>
              <span v-if="generatedVideos.length > 0" class="result-count">
                共 {{ generatedVideos.length }} 个
              </span>
            </div>
          </template>

          <a-spin v-if="loading" class="loading-spinner">
            <div class="loading-content">
              <loading-outlined spin style="font-size: 48px; color: #1677ff" />
              <p class="loading-text">视频生成中，通常需要1-3分钟...</p>
              <a-progress :percent="progress" :show-info="false" status="active" stroke-color="#1677ff" />
            </div>
          </a-spin>

          <div v-else-if="generatedVideos.length > 0" class="video-grid">
            <div v-for="(url, index) in generatedVideos" :key="index" class="video-item">
              <div class="video-preview">
                <play-circle-outlined style="font-size: 48px; color: #fff" />
              </div>
              <div class="video-info">
                <span class="video-label">视频 {{ index + 1 }}</span>
                <a-space>
                  <a-button type="primary" ghost size="small">
                    <play-circle-outlined /> 播放
                  </a-button>
                  <a-button size="small">
                    <download-outlined /> 下载
                  </a-button>
                  <a-button size="small">
                    <save-outlined /> 保存
                  </a-button>
                </a-space>
              </div>
            </div>
          </div>

          <a-empty v-else class="empty-state">
            <template #description>
              <div class="empty-desc">
                <video-camera-outlined style="font-size: 48px; color: #e2e8f0" />
                <p style="margin-top: 16px; color: #94a3b8">配置参数后开始生成视频</p>
              </div>
            </template>
          </a-empty>
        </a-card>
      </div>

      <div class="config-area">
        <a-card :bordered="false" class="config-card">
          <div class="config-section-title">视频配置</div>

          <a-form layout="vertical" @finish="handleGenerate" class="config-form">
            <a-form-item label="选择模型" :rules="[{ required: true, message: '请选择模型' }]">
              <div class="model-grid">
                <div
                  v-for="m in models"
                  :key="m.id"
                  class="model-card"
                  :class="{ active: form.modelId === m.id }"
                  @click="form.modelId = m.id"
                >
                  <div class="model-name">{{ m.name }}</div>
                  <div class="model-desc">{{ m.description }}</div>
                </div>
              </div>
            </a-form-item>

            <a-form-item label="生成方式">
              <a-select v-model:value="form.generateType">
                <a-select-option value="start_end_frame">
                  <div class="option-content">
                    <span class="option-label">参考首尾帧</span>
                    <span class="option-desc">上传起始帧和结束帧图片</span>
                  </div>
                </a-select-option>
                <a-select-option value="multi_frame">
                  <div class="option-content">
                    <span class="option-label">参考多帧</span>
                    <span class="option-desc">上传多个关键帧图片</span>
                  </div>
                </a-select-option>
                <a-select-option value="image_reference">
                  <div class="option-content">
                    <span class="option-label">参考图片</span>
                    <span class="option-desc">上传单张参考图片</span>
                  </div>
                </a-select-option>
                <a-select-option value="image_video_mix">
                  <div class="option-content">
                    <span class="option-label">图片视频混合</span>
                    <span class="option-desc">混合图片和视频素材</span>
                  </div>
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="尺寸配置" :rules="[{ required: true, message: '请选择尺寸' }]">
              <a-select v-model:value="form.sizeId" placeholder="请选择尺寸">
                <a-select-option v-for="s in sizes" :key="s.id" :value="s.id">
                  <div class="size-option">
                    <span class="size-label">{{ s.scene }}</span>
                    <span class="size-detail">{{ s.ratio }} | {{ s.duration }}s</span>
                  </div>
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="生成数量">
              <a-input-number v-model:value="form.generateCount" :min="1" :max="2" />
            </a-form-item>

            <a-form-item
              v-if="['image_reference', 'multi_frame'].includes(form.generateType)"
              label="参考图片"
            >
              <a-upload-dragger
                name="file"
                :max-count="form.generateType === 'image_reference' ? 1 : 6"
                accept="image/*"
                :before-upload="() => false"
                list-type="picture"
              >
                <p class="ant-upload-drag-icon">
                  <inbox-outlined />
                </p>
                <p class="ant-upload-text">拖拽或点击上传</p>
                <p class="ant-upload-hint">支持 JPG/PNG 格式</p>
              </a-upload-dragger>
            </a-form-item>

            <a-form-item
              v-if="['start_end_frame'].includes(form.generateType)"
              label="起始帧"
            >
              <a-upload
                name="file"
                :max-count="1"
                accept="image/*"
                :before-upload="() => false"
                list-type="picture"
              >
                <a-button>
                  <upload-outlined /> 上传起始帧
                </a-button>
              </a-upload>
            </a-form-item>

            <a-form-item
              v-if="['start_end_frame'].includes(form.generateType)"
              label="结束帧"
            >
              <a-upload
                name="file"
                :max-count="1"
                accept="image/*"
                :before-upload="() => false"
                list-type="picture"
              >
                <a-button>
                  <upload-outlined /> 上传结束帧
                </a-button>
              </a-upload>
            </a-form-item>

            <a-form-item
              v-if="['image_video_mix'].includes(form.generateType)"
              label="参考视频"
            >
              <a-upload
                name="file"
                :max-count="1"
                accept="video/*"
                :before-upload="() => false"
              >
                <a-button>
                  <upload-outlined /> 上传视频
                </a-button>
              </a-upload>
            </a-form-item>

            <a-form-item class="submit-item">
              <a-button
                type="primary"
                html-type="submit"
                :loading="loading"
                block
                size="large"
                class="submit-btn"
              >
                <template #icon><thunderbolt-outlined /></template>
                {{ loading ? '生成中...' : '开始生成' }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import {
  VideoCameraOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
  DownloadOutlined,
  SaveOutlined,
  InboxOutlined,
  UploadOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue';
import type { Model, SizeConfig } from '@types/common';

const loading = ref(false);
const progress = ref(0);
const generatedVideos = ref<string[]>([]);

const form = reactive({
  modelId: undefined as number | undefined,
  generateType: 'image_reference',
  sizeId: undefined as number | undefined,
  generateCount: 1,
});

const models = ref<Model[]>([
  { id: 1, name: 'Runway Gen-3', code: 'runway-gen3', provider: 'runway', capabilities: ['image2video'], description: '高质量图生视频', useCases: '电商视频', icon: '' },
  { id: 2, name: 'Pika Labs', code: 'pika', provider: 'pika', capabilities: ['image2video', 'text2video'], description: '快速视频生成', useCases: '短视频创作', icon: '' },
  { id: 3, name: 'Kling', code: 'kling', provider: 'kuaishou', capabilities: ['image2video', 'text2video'], description: '快手视频生成模型', useCases: '电商场景', icon: '' },
]);

const sizes = ref<SizeConfig[]>([
  { id: 1, configType: 'video', scene: '短视频', method: '图生视频', ratio: '9:16', width: 720, height: 1280, duration: 5, description: '竖版短视频' },
  { id: 2, configType: 'video', scene: '横版视频', method: '图生视频', ratio: '16:9', width: 1280, height: 720, duration: 5, description: '横版视频' },
  { id: 3, configType: 'video', scene: '方视频', method: '图生视频', ratio: '1:1', width: 720, height: 720, duration: 5, description: '正方形视频' },
  { id: 4, configType: 'video', scene: '商品展示', method: '图生视频', ratio: '3:4', width: 1080, height: 1440, duration: 10, description: '商品展示视频' },
]);

const handleGenerate = async () => {
  loading.value = true;
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value = Math.min(progress.value + Math.random() * 8, 90);
  }, 500);
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    progress.value = 100;
    generatedVideos.value = ['video1.mp4'];
    message.success('视频生成任务已创建');
  } catch {
    // handled
  } finally {
    clearInterval(timer);
    loading.value = false;
  }
};
</script>

<style scoped lang="less">
.video-generate-page {
  padding: 0;
}

.generate-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.result-area {
  flex: 1;
  min-width: 0;
}

.result-card {
  border-radius: 10px;
  min-height: 500px;

  .result-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .result-count {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 400;
    }
  }
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.loading-content {
  text-align: center;

  .loading-text {
    margin: 16px 0;
    color: #64748b;
    font-size: 15px;
  }
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.video-item {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #fff;

  .video-preview {
    height: 200px;
    background: linear-gradient(135deg, #1e293b, #334155);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background: linear-gradient(135deg, #0f172a, #1e293b);
    }
  }

  .video-info {
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .video-label {
      font-weight: 600;
      color: #1e293b;
    }
  }
}

.empty-state {
  padding: 80px 0;

  .empty-desc {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.config-area {
  width: 420px;
  flex-shrink: 0;
}

.config-card {
  border-radius: 10px;
  position: sticky;
  top: 88px;
}

.config-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.config-form {
  :deep(.ant-input-number) {
    width: 100%;
  }
}

.model-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.model-card {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #91caff;
    background: #f0f5ff;
  }

  &.active {
    border-color: #1677ff;
    background: #e6f4ff;

    .model-name {
      color: #1677ff;
    }
  }

  .model-name {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .model-desc {
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.4;
  }
}

.option-content {
  .option-label {
    font-weight: 500;
  }

  .option-desc {
    display: block;
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
  }
}

.size-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .size-label {
    font-weight: 500;
  }

  .size-detail {
    font-size: 12px;
    color: #94a3b8;
  }
}

.submit-item {
  margin-bottom: 0;
  margin-top: 8px;
}

.submit-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(135deg, #1677ff, #0958d9) !important;
  border: none !important;

  &:hover {
    background: linear-gradient(135deg, #4096ff, #1677ff) !important;
  }
}

@media (max-width: 1024px) {
  .generate-layout {
    flex-direction: column;
  }
  .config-area {
    width: 100%;
  }
}
</style>

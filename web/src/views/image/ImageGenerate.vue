<template>
  <div class="image-generate-page">
    <div class="generate-layout">
      <div class="left-panel">
        <a-card :bordered="false" class="config-card">
          <a-form layout="vertical" @finish="handleGenerate" class="config-form">
            <a-form-item :rules="[{ required: true, message: '请输入提示词' }]">
              <a-textarea
                v-model:value="form.prompt"
                :rows="4"
                placeholder="描述你想要生成的图片内容..."
                show-count
                :maxlength="1000"
              />
            </a-form-item>

            <div class="config-row">
              <div class="config-item">
                <a-select v-model:value="form.taskType" class="config-select-btn">
                  <a-select-option value="text2img">文生图</a-select-option>
                  <a-select-option value="img2img">图生图</a-select-option>
                </a-select>
              </div>

              <div class="config-item">
                <a-popover trigger="click" placement="bottomLeft">
                  <template #content>
                    <div class="model-popover">
                      <div
                        v-for="m in models"
                        :key="m.id"
                        class="model-option"
                        :class="{ active: form.modelId === m.id }"
                        @click="form.modelId = m.id"
                      >
                        <div class="model-option-info">
                          <div class="model-option-name">{{ m.name }}</div>
                          <div class="model-option-desc">{{ m.description }}</div>
                        </div>
                        <div v-if="m.useCases" class="model-option-use">{{ m.useCases }}</div>
                      </div>
                    </div>
                  </template>
                  <a-button class="config-select-btn model-btn">
                    <robot-outlined />
                    {{ selectedModelName || '选择模型' }}
                    <down-outlined />
                  </a-button>
                </a-popover>
              </div>

              <div class="config-item">
                <a-select v-model:value="form.sizeId" placeholder="选择尺寸" class="config-select-btn">
                  <a-select-option v-for="s in sizes" :key="s.id" :value="s.id">
                    {{ s.scene }} ({{ s.ratio }})
                  </a-select-option>
                </a-select>
              </div>

              <div class="config-item">
                <a-input-number v-model:value="form.generateCount" :min="1" :max="4" class="config-select-btn" />
              </div>

              <div class="config-item config-submit">
                <a-button
                  type="primary"
                  html-type="submit"
                  :loading="loading"
                  class="submit-btn"
                >
                  <template #icon><thunderbolt-outlined /></template>
                  {{ loading ? '生成中...' : '开始生成' }}
                </a-button>
              </div>
            </div>

            <a-form-item v-if="form.taskType === 'img2img'">
              <a-upload-dragger
                name="file"
                :max-count="1"
                accept="image/*"
                :before-upload="() => false"
                list-type="picture"
              >
                <p class="ant-upload-drag-icon"><inbox-outlined /></p>
                <p class="ant-upload-text">拖拽或点击上传参考图</p>
              </a-upload-dragger>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card :bordered="false" class="material-card">
          <div class="category-tabs">
            <a-radio-group v-model:value="activeCategory" button-style="solid">
              <a-radio-button value="">全部</a-radio-button>
              <a-radio-button value="电商产品">电商产品</a-radio-button>
              <a-radio-button value="穿着服饰">穿着服饰</a-radio-button>
              <a-radio-button value="化妆养护">化妆养护</a-radio-button>
              <a-radio-button value="食品饮料">食品饮料</a-radio-button>
              <a-radio-button value="玩具">玩具</a-radio-button>
            </a-radio-group>
          </div>
          <a-spin :spinning="materialLoading">
            <div v-if="filteredMaterials.length > 0" class="material-grid">
              <div
                v-for="item in filteredMaterials"
                :key="item.id"
                class="material-item"
              >
                <div class="material-thumb">
                  <img v-if="item.thumbnailUrl || item.mediaUrl" :src="item.thumbnailUrl || item.mediaUrl" :alt="item.title" loading="lazy" />
                  <div v-else class="material-placeholder"><picture-outlined /></div>
                  <div class="material-overlay">
                    <a-button type="text" size="small" class="overlay-btn" @click.stop="handleViewMaterial(item)">
                      <eye-outlined /> 查看
                    </a-button>
                    <a-button type="primary" size="small" class="overlay-btn" @click.stop="fillPrompt(item)">
                      <copy-outlined /> 参考生成
                    </a-button>
                  </div>
                </div>
                <div class="material-info">
                  <div class="material-title">{{ item.title || '未命名' }}</div>
                  <div v-if="item.scene" class="material-scene">{{ item.scene }}</div>
                </div>
              </div>
            </div>
            <a-empty v-else-if="!materialLoading" description="暂无材料" :image-style="{ height: '40px' }" />
          </a-spin>
        </a-card>
      </div>

      <div class="right-panel">
        <a-card :bordered="false" class="work-card">
          <div class="work-section-title">作品展示</div>
          <a-spin :spinning="workLoading">
            <div v-if="works.length > 0" class="work-grid">
              <div v-for="item in works" :key="item.id" class="work-item">
                <div class="work-thumb">
                  <img
                    v-if="item.resultImages?.length"
                    :src="item.resultImages[0]"
                    :alt="item.prompt"
                    loading="lazy"
                  />
                  <div v-else class="work-placeholder"><eye-outlined /></div>
                  <div class="work-status" :class="`status-${item.status}`">
                    {{ statusMap[item.status] || item.status }}
                  </div>
                </div>
                <div class="work-info">
                  <div class="work-prompt">{{ item.prompt?.slice(0, 40) || '未命名作品' }}</div>
                  <div class="work-meta">
                    <span>{{ item.modelName || '-' }}</span>
                    <span>{{ item.taskType || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <a-empty v-else-if="!workLoading" description="暂无作品" :image-style="{ height: '40px' }" />
          </a-spin>
          <div v-if="workTotal > workPageSize" class="load-more">
            <a-button type="link" size="small" :loading="workLoading" @click="loadMoreWorks">
              {{ works.length >= workTotal ? '已加载全部' : '加载更多' }}
            </a-button>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  PictureOutlined,
  RobotOutlined,
  DownOutlined,
  InboxOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  CopyOutlined,
} from '@ant-design/icons-vue';
import { materialApi } from '@api/material';
import { taskApi } from '@api/task';
import type { Model, SizeConfig } from '@types/common';
import type { Material } from '@types/material';

const router = useRouter();
const loading = ref(false);

const form = reactive({
  taskType: 'text2img',
  modelId: undefined as number | undefined,
  sizeId: undefined as number | undefined,
  generateCount: 1,
  prompt: '',
});

const models = ref<Model[]>([
  { id: 1, name: 'DALL-E 3', code: 'dall-e-3', provider: 'openai', capabilities: ['text2img'], description: '高质量文生图模型', useCases: '电商主图', icon: '' },
  { id: 2, name: 'Stable Diffusion XL', code: 'sdxl', provider: 'replicate', capabilities: ['text2img', 'img2img'], description: '开源高质量图像生成', useCases: '电商详情页', icon: '' },
  { id: 3, name: 'Midjourney', code: 'midjourney', provider: 'discord', capabilities: ['text2img'], description: '艺术风格图像生成', useCases: '创意设计', icon: '' },
]);

const sizes = ref<SizeConfig[]>([
  { id: 1, configType: 'image', scene: '电商主图', method: '文生图', ratio: '1:1', width: 800, height: 800, description: '正方形主图' },
  { id: 2, configType: 'image', scene: '详情页', method: '文生图', ratio: '3:4', width: 750, height: 1000, description: '竖版详情' },
  { id: 3, configType: 'image', scene: '横版海报', method: '文生图', ratio: '16:9', width: 1920, height: 1080, description: '宽屏海报' },
  { id: 4, configType: 'image', scene: '小红书', method: '文生图', ratio: '3:4', width: 1080, height: 1440, description: '社交媒体' },
]);

const selectedModelName = computed(() => {
  const m = models.value.find((m) => m.id === form.modelId);
  return m?.name || '';
});

const activeCategory = ref('');
const materialLoading = ref(false);
const materials = ref<Material[]>([]);

const filteredMaterials = computed(() => {
  if (!activeCategory.value) return materials.value;
  return materials.value.filter((m) => m.scene === activeCategory.value);
});

const workLoading = ref(false);
const works = ref<any[]>([]);
const workPage = ref(1);
const workPageSize = 20;
const workTotal = ref(0);

const statusMap: Record<string, string> = {
  pending: '生成中',
  processing: '处理中',
  success: '已完成',
  failed: '失败',
};

onMounted(() => {
  fetchMaterials();
  fetchWorks();
});

const fetchMaterials = async () => {
  materialLoading.value = true;
  try {
    const result = await materialApi.getList({ page: 1, pageSize: 50 });
    materials.value = result.list;
  } catch {
    // handled
  } finally {
    materialLoading.value = false;
  }
};

const handleViewMaterial = (item: Material) => {
  router.push(`/material/${item.id}`);
};

const fillPrompt = (item: Material) => {
  if (item.prompt) {
    form.prompt = item.prompt;
    message.success('已填入提示词');
  }
};

const fetchWorks = async (reset = false) => {
  if (reset) {
    workPage.value = 1;
    works.value = [];
  }
  workLoading.value = true;
  try {
    const result = await taskApi.getImageTaskList({ page: workPage.value, pageSize: workPageSize });
    if (reset) {
      works.value = result.list;
    } else {
      works.value.push(...result.list);
    }
    workTotal.value = result.total;
  } catch {
    // handled
  } finally {
    workLoading.value = false;
  }
};

const loadMoreWorks = () => {
  workPage.value++;
  fetchWorks();
};

const handleGenerate = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    message.success('生成成功');
    fetchWorks(true);
  } catch {
    // handled
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="less">
.image-generate-page {
  padding: 0;
}

.generate-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.left-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-panel {
  width: 360px;
  flex-shrink: 0;
}

.config-card {
  border-radius: 10px;
}

.config-form {
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }

  :deep(.ant-form-item:last-child) {
    margin-bottom: 0;
  }
}

.config-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.config-item {
  flex: 1;
  min-width: 0;
}

.config-select-btn {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;

  :deep(.ant-select-selector) {
    height: 36px !important;
    border-radius: 8px;
  }

  :deep(.ant-select-selection-item),
  :deep(.ant-select-selection-placeholder) {
    line-height: 34px !important;
  }
}

.config-submit {
  flex: none;
  width: auto;
}

.model-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  height: 36px;
  border-radius: 8px;
}

.model-popover {
  width: 280px;
  max-height: 320px;
  overflow-y: auto;
}

.model-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f0f5ff;
  }

  &.active {
    background: #e6f4ff;

    .model-option-name {
      color: #1677ff;
    }
  }

  .model-option-info {
    flex: 1;
    min-width: 0;
  }

  .model-option-name {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 2px;
  }

  .model-option-desc {
    font-size: 11px;
    color: #94a3b8;
  }

  .model-option-use {
    font-size: 11px;
    color: #1677ff;
    background: #e6f4ff;
    padding: 2px 8px;
    border-radius: 4px;
    white-space: nowrap;
    margin-left: 8px;
  }
}

.submit-btn {
  height: 36px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #1677ff, #0958d9) !important;
  border: none !important;
  white-space: nowrap;

  &:hover {
    background: linear-gradient(135deg, #4096ff, #1677ff) !important;
  }
}

.material-card {
  border-radius: 10px;
}

.work-section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.category-tabs {
  margin-bottom: 20px;

  :deep(.ant-radio-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  :deep(.ant-radio-button-wrapper) {
    height: 38px;
    line-height: 36px;
    padding: 0 20px;
    font-size: 14px;
    border-radius: 8px !important;
    border: none !important;

    &::before {
      display: none;
    }
  }
}

.material-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.material-item {
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;

  &:hover {
    border-color: #91caff;
    box-shadow: 0 4px 12px rgba(22, 119, 255, 0.15);

    .material-overlay {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .material-thumb {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    background: #f8fafc;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .material-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent);
    display: flex;
    justify-content: center;
    gap: 8px;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.3s;
  }

  .overlay-btn {
    color: #fff !important;
    border-radius: 6px;
    font-size: 12px;
    height: 30px;

    &.ant-btn-primary {
      background: rgba(22, 119, 255, 0.85) !important;
      border: none !important;
    }

    &:not(.ant-btn-primary) {
      background: rgba(255, 255, 255, 0.2) !important;
      backdrop-filter: blur(4px);
    }
  }

  .material-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c0c8d4;
    font-size: 32px;
  }

  .material-info {
    padding: 10px 12px;

    .material-title {
      font-size: 13px;
      font-weight: 500;
      color: #1e293b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .material-scene {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 4px;
    }
  }
}

.work-card {
  border-radius: 10px;
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 112px);
  overflow-y: auto;
}

.work-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.work-item {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;

  &:hover {
    border-color: #91caff;
    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);
  }

  .work-thumb {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    background: #f8fafc;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .work-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c0c8d4;
    font-size: 24px;
  }

  .work-status {
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 10px;
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

  .work-info {
    padding: 8px;

    .work-prompt {
      font-size: 12px;
      font-weight: 500;
      color: #1e293b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .work-meta {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
      display: flex;
      gap: 8px;
    }
  }
}

.load-more {
  text-align: center;
  margin-top: 16px;
}

@media (max-width: 1200px) {
  .generate-layout {
    flex-direction: column;
  }
  .right-panel {
    width: 100%;
  }
  .material-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<template>
  <div class="profile-page">
    <div class="page-header">
      <div class="page-title">
        <div class="icon"><user-outlined /></div>
        个人中心
      </div>
    </div>

    <div class="profile-layout">
      <div class="profile-sidebar">
        <a-card class="profile-card">
          <div class="avatar-section">
            <a-avatar :size="88" :src="userStore.user?.avatar" class="avatar">
              <template #icon><user-outlined style="font-size: 36px" /></template>
            </a-avatar>
            <div class="user-brief">
              <div class="user-nickname">{{ userStore.nickname || '未设置昵称' }}</div>
              <div class="user-no">{{ userStore.user?.userNo }}</div>
            </div>
          </div>
          <a-divider style="margin: 16px 0" />
          <div class="info-list">
            <div class="info-item">
              <mobile-outlined class="info-icon" />
              <span class="info-label">手机号</span>
              <span class="info-value">{{ userStore.user?.phone || '未绑定' }}</span>
            </div>
            <div class="info-item">
              <calendar-outlined class="info-icon" />
              <span class="info-label">注册时间</span>
              <span class="info-value">{{ formatDate(userStore.user?.createdAt) }}</span>
            </div>
          </div>
        </a-card>
      </div>

      <div class="profile-main">
        <a-card title="基本信息" class="form-card">
          <a-form :model="form" @finish="handleSaveProfile" layout="vertical" class="profile-form">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="昵称" name="nickname" :rules="[{ required: true, message: '请输入昵称' }, { min: 2, max: 20, message: '昵称长度为2-20个字符' }]">
                  <a-input v-model:value="form.nickname" placeholder="请输入昵称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="头像URL">
                  <a-input v-model:value="form.avatar" placeholder="请输入头像图片地址" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="saving">保存修改</a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card title="修改密码" class="form-card" style="margin-top: 16px">
          <a-form :model="passwordForm" @finish="handleChangePassword" layout="vertical" class="profile-form">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="原密码" name="oldPassword" :rules="[{ required: true, message: '请输入原密码' }]">
                  <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入原密码" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码至少6位' }]">
                  <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="确认新密码" name="confirmPassword" :rules="[{ required: true, message: '请确认新密码' }]">
                  <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="changingPassword">修改密码</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined, MobileOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@stores/user';
import { authApi } from '@api/auth';
import dayjs from 'dayjs';

const userStore = useUserStore();
const saving = ref(false);
const changingPassword = ref(false);

const form = reactive({
  nickname: '',
  avatar: '',
});

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

onMounted(() => {
  if (userStore.user) {
    form.nickname = userStore.user.nickname || '';
    form.avatar = userStore.user.avatar || '';
  }
});

const formatDate = (date?: string) => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

const handleSaveProfile = async () => {
  saving.value = true;
  try {
    const result = await authApi.userApi.updateProfile({ nickname: form.nickname, avatar: form.avatar });
    userStore.updateUser(result as any);
    message.success('保存成功');
  } catch {
    // handled
  } finally {
    saving.value = false;
  }
};

const handleChangePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('两次输入的密码不一致');
    return;
  }
  changingPassword.value = true;
  try {
    await authApi.userApi.updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });
    message.success('密码修改成功');
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch {
    // handled
  } finally {
    changingPassword.value = false;
  }
};
</script>

<style scoped lang="less">
.profile-page {
  padding: 0;
}

.profile-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.profile-sidebar {
  width: 320px;
  flex-shrink: 0;
}

.profile-card {
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    .avatar {
      background: linear-gradient(135deg, #1677ff, #69b1ff);
    }
  }

  .user-brief {
    text-align: center;

    .user-nickname {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }

    .user-no {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 4px;
    }
  }

  .info-list {
    .info-item {
      display: flex;
      align-items: center;
      padding: 10px 0;

      & + .info-item {
        border-top: 1px solid #f1f5f9;
      }

      .info-icon {
        font-size: 16px;
        color: #1677ff;
        margin-right: 10px;
        width: 20px;
        text-align: center;
      }

      .info-label {
        font-size: 14px;
        color: #64748b;
        width: 72px;
        flex-shrink: 0;
      }

      .info-value {
        font-size: 14px;
        color: #1e293b;
        font-weight: 500;
      }
    }
  }
}

.profile-main {
  flex: 1;
  min-width: 0;
}

.form-card {
  border-radius: 10px;
}

.profile-form {
  max-width: 600px;
}
</style>

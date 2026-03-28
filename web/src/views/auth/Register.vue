<template>
  <div class="register-container">
    <div class="register-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
    <div class="register-box">
      <div class="register-header">
        <div class="logo-icon">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#lg)" />
            <path d="M8 14C8 10.6863 10.6863 8 14 8C17.3137 8 20 10.6863 20 14C20 17.3137 17.3137 20 14 20" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="14" cy="14" r="3" fill="white"/>
            <defs><linearGradient id="lg" x1="0" y1="0" x2="28" y2="28"><stop stop-color="#1677ff"/><stop offset="1" stop-color="#69b1ff"/></linearGradient></defs>
          </svg>
        </div>
        <h1>注册账号</h1>
        <p class="subtitle">加入AI创作平台，开启智能创作之旅</p>
      </div>

      <a-form :model="form" @finish="handleRegister" layout="vertical" class="register-form">
        <a-form-item
          name="phone"
          :rules="[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]"
        >
          <a-input v-model:value="form.phone" placeholder="请输入手机号" size="large">
            <template #prefix>
              <mobile-outlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]"
        >
          <a-input-password v-model:value="form.password" placeholder="请设置密码（至少6位）" size="large">
            <template #prefix>
              <lock-outlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
          <a-input v-model:value="form.code" placeholder="请输入验证码" size="large">
            <template #prefix>
              <mail-outlined class="input-icon" />
            </template>
            <template #suffix>
              <a-button
                type="link"
                class="code-btn"
                :disabled="countdown > 0"
                @click="handleSendCode"
              >
                {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
              </a-button>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block size="large" class="submit-btn">
            注册
          </a-button>
        </a-form-item>
      </a-form>

      <div class="footer">
        已有账号？ <router-link to="/login" class="link">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { MobileOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue';
import { authApi } from '@api/auth';

const router = useRouter();
const loading = ref(false);
const countdown = ref(0);

const form = reactive({
  phone: '',
  password: '',
  code: '',
});

const handleRegister = async () => {
  loading.value = true;
  try {
    await authApi.register({
      phone: form.phone,
      password: form.password,
      code: form.code,
    });
    message.success('注册成功，请登录');
    router.push('/login');
  } finally {
    loading.value = false;
  }
};

const handleSendCode = async () => {
  if (!form.phone || !/^1[3-9]\d{9}$/.test(form.phone)) {
    message.error('请输入正确的手机号');
    return;
  }
  try {
    await authApi.sendCode({ phone: form.phone, type: 1 });
    message.success('验证码已发送');
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) clearInterval(timer);
    }, 1000);
  } catch {
    // handled
  }
};
</script>

<style scoped lang="less">
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0ff;
  position: relative;
  overflow: hidden;
}

.register-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;

  .bg-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
  }

  .circle-1 {
    width: 400px;
    height: 400px;
    background: #0958d9;
    top: -100px;
    left: -50px;
  }

  .circle-2 {
    width: 300px;
    height: 300px;
    background: #1677ff;
    bottom: -50px;
    right: -50px;
  }

  .circle-3 {
    width: 200px;
    height: 200px;
    background: #91caff;
    top: 40%;
    right: 30%;
  }
}

.register-box {
  width: 420px;
  padding: 40px 36px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(22, 119, 255, 0.15);
  position: relative;
  z-index: 1;
}

.register-header {
  text-align: center;
  margin-bottom: 28px;

  .logo-icon {
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 6px;
  }

  .subtitle {
    color: #94a3b8;
    font-size: 14px;
  }
}

.register-form {
  .input-icon {
    color: #94a3b8;
  }

  .code-btn {
    font-size: 13px;
    padding: 0;
  }
}

.submit-btn {
  height: 46px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(135deg, #1677ff, #0958d9) !important;
  border: none !important;
  margin-top: 8px;

  &:hover {
    background: linear-gradient(135deg, #4096ff, #1677ff) !important;
  }
}

.footer {
  text-align: center;
  margin-top: 20px;
  color: #94a3b8;
  font-size: 14px;

  .link {
    color: #1677ff;
    font-weight: 500;

    &:hover {
      color: #4096ff;
    }
  }
}
</style>

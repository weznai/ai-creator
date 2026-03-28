<template>
  <a-layout class="layout">
    <a-layout-sider
      :width="240"
      theme="light"
      class="sider"
    >
      <div class="logo">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#logo-gradient)" />
            <path d="M8 14C8 10.6863 10.6863 8 14 8C17.3137 8 20 10.6863 20 14C20 17.3137 17.3137 20 14 20" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="14" cy="14" r="3" fill="white"/>
            <defs>
              <linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28">
                <stop stop-color="#1677ff"/>
                <stop offset="1" stop-color="#69b1ff"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">AI创作平台</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
        class="nav-menu"
      />
    </a-layout-sider>
    <a-layout class="main-layout">
      <a-layout-header class="header">
        <div class="header-left">
        </div>
        <div class="header-right">
          <a-dropdown>
            <div class="user-info">
              <a-avatar :size="34" :src="userStore.user?.avatar" class="user-avatar">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span class="nickname">{{ userStore.nickname }}</span>
              <down-outlined class="arrow" />
            </div>
            <template #overlay>
              <a-menu class="user-dropdown">
                <a-menu-item key="profile" @click="router.push('/profile')">
                  <user-outlined /> 个人中心
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout" class="logout-item">
                  <logout-outlined /> 退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  AppstoreOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FolderOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  BorderOutlined,
  IdcardOutlined,
} from '@ant-design/icons-vue';
import { useUserStore } from '@stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const selectedKeys = computed(() => [route.path]);

const menuItems = [
  {
    type: 'group',
    label: h('span', { class: 'menu-group-title' }, [
      h(BorderOutlined, { style: 'color: #1677ff; margin-right: 6px' }),
      '创造',
    ]),
    children: [
      {
        key: '/material',
        icon: () => h(AppstoreOutlined, { style: 'color: #f59e0b' }),
        label: '材料库',
      },
      {
        key: '/image/generate',
        icon: () => h(PictureOutlined, { style: 'color: #f59e0b' }),
        label: '生成图片',
      },
      {
        key: '/video/generate',
        icon: () => h(VideoCameraOutlined, { style: 'color: #f59e0b' }),
        label: '生成视频',
      },
      {
        key: '/work',
        icon: () => h(FolderOutlined, { style: 'color: #f59e0b' }),
        label: '作品',
      },
    ],
  },
  {
    type: 'group',
    label: h('span', { class: 'menu-group-title' }, [
      h(IdcardOutlined, { style: 'color: #1677ff; margin-right: 6px' }),
      '个人中心',
    ]),
    children: [
      {
        key: '/profile',
        icon: () => h(UserOutlined, { style: 'color: #f59e0b' }),
        label: '个人中心',
      },
    ],
  },
];

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key);
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style lang="less" scoped>
.layout {
  min-height: 100vh;
}

.sider {
  border-right: 1px solid #e2e8f0;
  background: #fff !important;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;

  .logo-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #1677ff, #69b1ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    white-space: nowrap;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.nav-menu {
  border-right: none !important;
  padding: 8px;
  margin-top: 8px;

  :deep(.ant-menu-item-group-title) {
    padding: 20px 0 8px 12px;
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: 1px;
  }

  :deep(.ant-menu-item) {
    height: 48px;
    line-height: 48px;
    margin: 2px 0;
    border-radius: 8px !important;
    color: #64748b;
    font-weight: 500;
    transition: all 0.2s;

    .anticon {
      font-size: 19px;
    }

    &:hover {
      color: #f59e0b;
      background: #e6f4ff;
    }

    &.ant-menu-item-selected {
      color: #f59e0b;
      background: linear-gradient(135deg, #e6f4ff, #f0f5ff);

      &::after {
        display: none;
      }
    }
  }
}

.main-layout {
  margin-left: 240px;
  transition: margin-left 0.3s;
  background: transparent;
}

.header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  line-height: 64px;
  position: sticky;
  top: 0;
  z-index: 9;
  border-bottom: none;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 10px;
  transition: background 0.2s;

  &:hover {
    background: #f1f5f9;
  }

  .user-avatar {
    background: linear-gradient(135deg, #1677ff, #69b1ff);
  }

  .nickname {
    font-size: 15px;
    font-weight: 500;
    color: #1e293b;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .arrow {
    font-size: 12px;
    color: #94a3b8;
  }
}

.user-dropdown {
  min-width: 160px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  padding: 4px;

  .logout-item {
    color: #ef4444 !important;

    &:hover {
      background: #fef2f2 !important;
    }
  }
}

.content {
  margin: 24px;
  min-height: calc(100vh - 112px);
}
</style>

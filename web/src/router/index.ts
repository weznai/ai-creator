import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@stores/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@views/auth/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@views/auth/Register.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@components/layout/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/material',
      },
      {
        path: 'material',
        name: 'MaterialList',
        component: () => import('@views/material/MaterialList.vue'),
      },
      {
        path: 'material/:id',
        name: 'MaterialDetail',
        component: () => import('@views/material/MaterialDetail.vue'),
      },
      {
        path: 'image/generate',
        name: 'ImageGenerate',
        component: () => import('@views/image/ImageGenerate.vue'),
      },
      {
        path: 'video/generate',
        name: 'VideoGenerate',
        component: () => import('@views/video/VideoGenerate.vue'),
      },
      {
        path: 'work',
        name: 'MyWork',
        component: () => import('@views/work/MyWork.vue'),
      },
      {
        path: 'collection',
        name: 'MyCollection',
        component: () => import('@views/work/MyCollection.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@views/auth/Profile.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth !== false && !userStore.isLogin) {
    next('/login');
  } else {
    next();
  }
});

export default router;

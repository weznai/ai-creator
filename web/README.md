# AI内容创作平台 - 前端

基于 React + TypeScript + Vite + Ant Design 的前端项目。

## 项目结构

```
web/
├── src/
│   ├── main.tsx                 # 入口文件
│   ├── App.tsx                  # 根组件
│   │
│   ├── components/              # 组件
│   │   ├── common/              # 公共组件
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── ...
│   │   └── layout/              # 布局组件
│   │       ├── Layout.tsx
│   │       └── Layout.module.less
│   │
│   ├── pages/                   # 页面
│   │   ├── auth/                # 认证页面
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Profile.tsx
│   │   ├── material/            # 材料库页面
│   │   │   ├── MaterialList.tsx
│   │   │   └── MaterialDetail.tsx
│   │   ├── image/               # 图片生成页面
│   │   │   └── ImageGenerate.tsx
│   │   ├── video/               # 视频生成页面
│   │   │   └── VideoGenerate.tsx
│   │   ├── work/                # 作品管理页面
│   │   │   ├── MyWork.tsx
│   │   │   └── MyCollection.tsx
│   │   └── admin/               # 后台管理页面
│   │
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   └── useRequest.ts
│   │
│   ├── services/                # API 服务
│   │   ├── request.ts           # Axios 封装
│   │   └── api.ts               # API 接口
│   │
│   ├── stores/                  # 状态管理
│   │   └── user.store.ts        # 用户状态
│   │
│   ├── types/                   # TypeScript 类型
│   │   ├── user.ts
│   │   ├── material.ts
│   │   ├── task.ts
│   │   └── common.ts
│   │
│   ├── utils/                   # 工具函数
│   │   ├── format.ts
│   │   └── storage.ts
│   │
│   ├── styles/                  # 全局样式
│   │   └── global.less
│   │
│   └── assets/                  # 静态资源
│       ├── images/
│       └── icons/
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 技术栈

| 技术 | 说明 |
|------|------|
| React 18 | 前端框架 |
| TypeScript | 类型支持 |
| Vite | 构建工具 |
| Ant Design 5 | UI 组件库 |
| Zustand | 状态管理 |
| Axios | HTTP 请求 |
| React Router | 路由管理 |
| Less | CSS 预处理器 |

## 分层说明

### Pages（页面层）
- 页面级组件
- 负责页面布局和业务逻辑组合

### Components（组件层）
- 可复用的 UI 组件
- 分为 common（通用）和 layout（布局）两类

### Services（服务层）
- API 请求封装
- 统一请求/响应处理

### Stores（状态层）
- 全局状态管理
- 使用 Zustand

### Hooks（钩子层）
- 自定义 React Hooks
- 复用逻辑

### Types（类型层）
- TypeScript 类型定义
- 接口数据类型

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check
```

## 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| /login | Login | 登录页 |
| /register | Register | 注册页 |
| /material | MaterialList | 材料库列表 |
| /material/:id | MaterialDetail | 材料详情 |
| /image/generate | ImageGenerate | 图片生成 |
| /video/generate | VideoGenerate | 视频生成 |
| /work | MyWork | 我的作品 |
| /collection | MyCollection | 我的收藏 |
| /profile | Profile | 个人中心 |

## 代理配置

开发环境下，API 请求会代理到后端服务：

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

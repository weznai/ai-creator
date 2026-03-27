# AI内容创作平台 - 后端服务

基于 NestJS 的 AI 内容创作平台后端服务。

## 项目结构

```
server/
├── src/
│   ├── main.ts                      # 应用入口
│   ├── app.module.ts                # 根模块
│   │
│   ├── modules/                     # 业务模块
│   │   ├── auth/                    # 认证模块
│   │   │   ├── dto/                 # 数据传输对象
│   │   │   │   ├── send-code.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── index.ts
│   │   │   ├── auth.controller.ts   # 控制器
│   │   │   ├── auth.service.ts      # 服务层
│   │   │   ├── auth.module.ts       # 模块定义
│   │   │   └── index.ts
│   │   │
│   │   ├── user/                    # 用户模块
│   │   │   ├── dto/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.module.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── material/                # 材料库模块
│   │   │   ├── dto/
│   │   │   ├── material.controller.ts
│   │   │   ├── material.service.ts
│   │   │   ├── material.module.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── image-task/              # 图片生成任务模块
│   │   │   ├── dto/
│   │   │   ├── image-task.controller.ts
│   │   │   ├── image-task.service.ts
│   │   │   ├── image-task.module.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── video-task/              # 视频生成任务模块
│   │   ├── work/                    # 作品管理模块
│   │   └── admin/                   # 后台管理模块
│   │
│   ├── common/                      # 公共模块
│   │   ├── middleware/              # 中间件
│   │   ├── decorators/              # 装饰器
│   │   ├── filters/                 # 过滤器
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/                  # 守卫
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/            # 拦截器
│   │   │   └── transform.interceptor.ts
│   │   └── pipes/                   # 管道
│   │
│   ├── config/                      # 配置
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── jwt.config.ts
│   │
│   ├── database/                    # 数据库
│   │   ├── entities/                # 实体
│   │   │   ├── user.entity.ts
│   │   │   ├── material.entity.ts
│   │   │   ├── size-config.entity.ts
│   │   │   └── image-task.entity.ts
│   │   ├── migrations/              # 迁移
│   │   └── seeds/                   # 种子数据
│   │
│   ├── queue/                       # 消息队列
│   │   ├── image.queue.ts
│   │   └── video.queue.ts
│   │
│   ├── services/                    # 外部服务
│   │   ├── ai/                      # AI服务
│   │   │   ├── openai.service.ts
│   │   │   └── dashscope.service.ts
│   │   ├── storage/                 # 存储服务
│   │   │   └── oss.service.ts
│   │   └── sms/                     # 短信服务
│   │       └── sms.service.ts
│   │
│   └── utils/                       # 工具类
│       └── user-no.util.ts
│
├── test/                            # 测试
├── package.json
├── tsconfig.json
└── .env.example
```

## 分层说明

### Controller（控制器层）
- 处理 HTTP 请求
- 参数校验
- 调用 Service 层
- 返回响应

### Service（服务层）
- 业务逻辑处理
- 事务管理
- 调用 Repository 或外部服务

### Repository（数据访问层）
- 由 TypeORM 提供
- 数据库 CRUD 操作

### DTO（数据传输对象）
- 定义接口输入输出结构
- 参数校验规则

### Entity（实体）
- 数据库表映射
- 字段定义

## 模块说明

| 模块 | 说明 |
|------|------|
| auth | 认证：验证码、注册、登录 |
| user | 用户：个人信息、密码修改 |
| material | 材料库：图片/视频材料管理 |
| image-task | 图片生成：任务创建、状态查询 |
| video-task | 视频生成：任务创建、状态查询 |
| work | 作品：我的作品、分类、收藏 |
| admin | 后台管理：模型、尺寸、用户管理 |

## 快速开始

```bash
# 安装依赖
npm install

# 复制配置文件
cp .env.example .env

# 启动开发服务
npm run dev
```

## API 路径

| 模块 | 路径前缀 |
|------|---------|
| 认证 | /api/auth |
| 用户 | /api/user |
| 材料库 | /api/materials |
| 图片任务 | /api/image-tasks |
| 视频任务 | /api/video-tasks |
| 作品 | /api/works |
| 后台 | /api/admin |

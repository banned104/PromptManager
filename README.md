# Prompt Manager

一个基于 **Vue 3 + Nuxt 3 + TypeScript + SQLite** 的图片 Prompt 管理器，支持 Prompt 保存、模糊搜索、图片上传与展示，并使用 **Naive UI** 与 **Tailwind CSS** 实现现代化界面。

## 技术栈

| 层        | 主要技术 |
|-----------|----------|
| 前端 UI   | Vue 3 · Nuxt 3 · Naive UI · Tailwind CSS |
| 业务逻辑   | TypeScript · Composition API |
| 数据持久化 | Prisma ORM · SQLite |
| 构建工具   | Vite (Nuxt 内建) |

## 目录结构概览

```
├── app/                # Nuxt 入口(保持默认)
├── assets/             # 静态样式与资源
├── components/         # 全局/局部组件
│   └── PromptCard.vue  # Prompt 展示卡片
├── layouts/            # 布局组件 (默认 layout 已集成 n-message-provider)
├── pages/              # 业务页面 (CRUD、搜索)
├── plugins/            # 客户端插件 (Naive UI SSR 样式注入)
├── prisma/             # Prisma schema & 数据库文件
├── server/api/         # Nitro API 路由 (REST 风格)
├── tailwind.config.js  # Tailwind 配置
├── nuxt.config.ts      # Nuxt 全局配置
└── README.md           # 当前文档
```

## 核心架构说明

1. **页面渲染**  
   Nuxt 采用 SSR / SSG，默认开启 `ssr: true`，既保证首屏速度又利于 SEO。

2. **组件通信**  
   主要使用 `defineProps` + `emit`，必要时使用 Pinia／Provide-Inject（当前项目暂未使用 Pinia）。

3. **消息提示**  
   在 `layouts/default.vue` 中包裹 `<n-message-provider>`，各页面可通过 `useMessage()` 触发成功/失败提示。

4. **数据层**  
   `Prisma` 负责模型定义与数据库迁移，`/server/api` 目录下的 Route Handler 直接使用 Prisma Client 进行 CRUD。

5. **文件上传**  
   通过 `@multipart/form-data` 解析后保存到 `public/uploads`，数据库中仅存储相对路径。

## 本地开发

```bash
# 安装依赖
pnpm install        # 推荐使用 pnpm，也可使用 npm/yarn/bun

# 启动开发服务器
pnpm dev            # http://localhost:3000
```

> 初次运行会自动生成 `prisma/dev.db` 数据库文件。

### 常用脚本

| 命令             | 说明                              |
|------------------|-----------------------------------|
| `pnpm dev`       | 启动本地开发服务器 (热更新)        |
| `pnpm build`     | 构建生产包                         |
| `pnpm preview`   | 预览生产包 (本地 SSR)             |
| `pnpm prisma`    | Prisma CLI，例如 `pnpm prisma studio` 查看数据 |

## 数据库迁移

```bash
# 修改 prisma/schema.prisma 后
pnpm prisma migrate dev --name <migration-name>
```

## 环境变量

```
# .env
DATABASE_URL="file:./prisma/dev.db"
```

> 若切换到生产环境，可将 `DATABASE_URL` 指向外部 SQLite 文件或其他数据库，并在 `prisma/schema.prisma` 中调整 provider。

## 部署

1. 执行 `pnpm build` 生成 `.output`。  
2. 产物符合 [Nitro preset](https://nitro.unjs.io/) 规范，可部署到 Node 服务器、Docker、Vercel、Netlify 等平台。  
3. 生产环境需执行 `node .output/server/index.mjs` 启动。

---

欢迎提出 Issue 与 PR，一起完善功能！

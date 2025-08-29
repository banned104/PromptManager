# Prompt Manager

一个基于 **Vue 3 + Nuxt 3 + TypeScript + SQLite** 的图片 Prompt 管理器，支持 Prompt 保存、模糊搜索、图片上传与展示，并使用 **Naive UI** 与 **Tailwind CSS** 实现现代化界面。

<img src=".assets/202508300506413.png" alt="image-20250830050641175" style="zoom:50%;" />

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

## TODO




基于你现有的 Vue + Nuxt.js + TypeScript + SQLite 的 Prompt 管理器项目，我建议以下功能扩展来提升易用性和稳定性：

## 🚀 核心功能增强

### 1. 智能搜索与分类
- **语义搜索**：集成向量数据库（如 Chroma），支持基于语义相似度的搜索
- **智能标签**：自动从 Prompt 内容中提取关键词生成标签
- **分类管理**：支持自定义分类和层级结构
- **收藏夹**：快速访问常用 Prompt

### 2. 批量操作与导入导出
- **批量导入**：支持从 CSV、JSON 格式批量导入 Prompt
- **批量编辑**：选中多个 Prompt 进行批量标签修改
- **导出功能**：支持导出为多种格式（JSON、CSV、Markdown）
- **备份恢复**：一键备份和恢复数据

## 💡 易用性提升

### 3. 用户体验优化
- **快捷键支持**：常用操作的键盘快捷键
- **拖拽上传**：支持拖拽图片直接上传
- **预览模式**：Prompt 效果预览（如果是 AI 绘画 Prompt）
- **历史记录**：搜索历史和使用频率统计
- **暗黑模式**：支持主题切换

### 4. 协作与分享
- **分享链接**：生成 Prompt 分享链接
- **模板库**：内置常用 Prompt 模板
- **社区功能**：用户可以分享和发现优质 Prompt
- **版本控制**：Prompt 的修改历史追踪

## 🛡️ 稳定性与性能

### 5. 数据安全与备份
- **自动备份**：定时自动备份数据库
- **数据验证**：输入数据的格式验证和清理
- **错误恢复**：操作失败时的回滚机制
- **数据迁移**：支持从其他 Prompt 管理工具迁移

### 6. 性能优化
- **虚拟滚动**：大量数据时的性能优化
- **图片懒加载**：优化图片加载性能
- **缓存策略**：合理的前端缓存机制
- **分页加载**：避免一次性加载过多数据

## 🔧 技术架构增强

### 7. 系统监控与日志
- **错误监控**：集成 Sentry 等错误追踪工具
- **性能监控**：页面加载时间和用户行为分析
- **操作日志**：记录用户的关键操作
- **健康检查**：系统状态监控接口

### 8. 扩展性设计
- **插件系统**：支持第三方插件扩展功能
- **API 接口**：提供 RESTful API 供其他工具调用
- **Webhook 支持**：与其他系统集成的回调机制
- **多数据库支持**：除 SQLite 外支持 PostgreSQL、MySQL

## 🎯 高级功能

### 9. AI 集成
- **Prompt 优化建议**：AI 分析并提供 Prompt 改进建议
- **自动标签生成**：基于内容自动生成相关标签
- **相似 Prompt 推荐**：基于用户行为推荐相关 Prompt
- **质量评分**：AI 评估 Prompt 的质量和效果

### 10. 移动端支持
- **PWA 支持**：渐进式 Web 应用，支持离线使用
- **响应式设计**：完美适配移动设备
- **触摸优化**：针对触摸操作的界面优化

## 📊 数据分析

### 11. 统计与分析
- **使用统计**：Prompt 使用频率和效果统计
- **趋势分析**：热门标签和 Prompt 趋势
- **用户行为分析**：搜索模式和使用习惯分析

## 🔒 安全性

### 12. 安全增强
- **用户认证**：支持多种登录方式（OAuth、JWT）
- **权限管理**：细粒度的权限控制
- **数据加密**：敏感数据的加密存储
- **访问控制**：IP 白名单和访问频率限制

---

**实施建议**：
1. **优先级排序**：先实现核心功能增强（搜索、批量操作）
2. **渐进式开发**：采用敏捷开发，小步快跑
3. **用户反馈**：及时收集用户反馈，调整功能优先级
4. **性能优先**：在添加新功能时始终考虑性能影响
5. **代码质量**：保持代码的可维护性和可测试性

这些功能扩展都遵循 "Less is More" 的哲学，每个功能都有明确的价值和用途，避免功能冗余，确保系统的简洁性和高效性。
        

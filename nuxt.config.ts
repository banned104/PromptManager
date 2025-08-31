// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  // 禁用开发工具以减少内存占用
  devtools: { enabled: false },
  
  // 禁用SSR，使用SPA模式
  ssr: false,
  
  // 源代码目录配置
  srcDir: '.',
  
  // 别名配置
  alias: {
    'assets': fileURLToPath(new URL('./assets', import.meta.url))
  },
  
  // CSS 配置
  css: [
    'assets/css/main.css'
  ],
  
  // 模块配置
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],
  
  // 构建配置
  build: {
    transpile: [
      'naive-ui',
      'vueuc',
      '@juggle/resize-observer'
    ]
  },
  
  // Vite 配置
  vite: {
    plugins: [tsconfigPaths()],
    optimizeDeps: {
      include: [
        'naive-ui',
        '@vicons/ionicons5'
      ]
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'naive-ui': ['naive-ui'],
            'icons': ['@vicons/ionicons5']
          }
        }
      }
    }
  },
  
  // 图片优化配置
  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  },
  
  // 运行时配置
  runtimeConfig: {
    // 私有配置（仅在服务端可用）
    databaseUrl: process.env.DATABASE_URL,
    
    // 公共配置（客户端和服务端都可用）
    public: {
      apiBase: '/api'
    }
  },
  
  // 应用配置
  app: {
    head: {
      title: 'Prompt 管理器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '一个功能强大的 Prompt 管理工具，支持图片上传和模糊搜索' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // 性能优化
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: false
  },
  
  // 开发服务器配置
  devServer: {
    port: 3000
  },
  
  // 兼容性配置
  compatibilityDate: '2024-04-03'
})

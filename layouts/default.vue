<template>
  <n-message-provider>
    <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-6">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              Prompt 管理器
            </NuxtLink>
          </div>
          
          <!-- 导航菜单 -->
          <div class="flex items-center space-x-4">
            <NuxtLink 
              to="/" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              首页
            </NuxtLink>
            
            <!-- NSFW 开关 -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">NSFW:</span>
              <n-switch 
                v-model:value="nsfwEnabled" 
                size="small"
                @update:value="updateNsfwSetting"
              />
            </div>
            
            <NuxtLink 
              to="/create" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              新建 Prompt
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- 主要内容区域 -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- 页脚 -->
    <footer class="bg-white border-t mt-auto">
      <div class="container mx-auto px-6 py-4">
        <div class="text-center text-sm text-gray-500">
          © 2024 Prompt 管理器. 使用 Vue 3 + Nuxt.js + TypeScript + SQLite 构建
        </div>
      </div>
    </footer>
  </div>
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NMessageProvider, NSwitch } from 'naive-ui'

// NSFW 开关状态
const nsfwEnabled = ref(false)

// 从 localStorage 恢复 NSFW 设置
onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedNsfwSetting = localStorage.getItem('civitai-nsfw-enabled')
    if (savedNsfwSetting !== null) {
      nsfwEnabled.value = savedNsfwSetting === 'true'
    }
  }
})

// 更新 NSFW 设置
const updateNsfwSetting = (value: boolean) => {
  nsfwEnabled.value = value
  if (typeof window !== 'undefined') {
    localStorage.setItem('civitai-nsfw-enabled', value.toString())
    console.log(`🔧 NSFW 设置已更新: ${value ? '启用' : '禁用'}`)
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('nsfwSettingChanged', {
      detail: { enabled: value }
    }))
  }
}

// 页面元数据
useHead({
  titleTemplate: '%s - Prompt 管理器',
  meta: [
    { name: 'description', content: '一个功能强大的 Prompt 管理工具，支持图片上传和模糊搜索' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>

<style>
/* 全局样式 */
html {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f9fafb;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式容器 */
.container {
  max-width: 1200px;
}

/* 卡片阴影效果 */
.card-shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.15s ease-in-out;
}

.card-shadow:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 加载动画 */
.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* 文本截断 */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-truncate-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.text-truncate-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
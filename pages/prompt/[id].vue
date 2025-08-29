<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- 加载状态 -->
    <div v-if="pending" class="flex justify-center py-12">
      <n-spin size="large" />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-12">
      <n-result status="404" title="404" description="Prompt 不存在">
        <template #footer>
          <n-button @click="navigateTo('/')">返回首页</n-button>
        </template>
      </n-result>
    </div>

    <!-- 内容展示 -->
    <div v-else-if="promptData?.data && typeof promptData.data === 'object' && !Array.isArray(promptData.data)">
      <!-- 面包屑导航 -->
      <div class="mb-6">
        <n-breadcrumb>
          <n-breadcrumb-item @click="navigateTo('/')">首页</n-breadcrumb-item>
          <n-breadcrumb-item>Prompt 详情</n-breadcrumb-item>
        </n-breadcrumb>
      </div>

      <n-card>
        <!-- 标题和操作按钮 -->
        <div class="flex justify-between items-start mb-6">
          <h1 class="text-3xl font-bold text-gray-800">{{ (promptData.data as {title: string}).title }}</h1>
          
          <n-space>
            <n-button @click="navigateTo(`/edit/${(promptData.data as {id: number}).id}`)">
              <template #icon>
                <n-icon :component="EditIcon" />
              </template>
              编辑
            </n-button>
            
            <n-popconfirm
              @positive-click="handleDelete"
              negative-text="取消"
              positive-text="确认删除"
            >
              <template #trigger>
                <n-button type="error">
                  <template #icon>
                    <n-icon :component="DeleteIcon" />
                  </template>
                  删除
                </n-button>
              </template>
              确定要删除这个 Prompt 吗？
            </n-popconfirm>
          </n-space>
        </div>

        <!-- 图片展示 -->
        <div v-if="(promptData.data as {imagePath: string | null}).imagePath" class="mb-6">
          <img 
            :src="(promptData.data as {imagePath: string | null}).imagePath || undefined" 
            :alt="(promptData.data as {title: string}).title"
            class="max-w-full h-auto rounded-lg shadow-md"
            @error="handleImageError"
          />
        </div>

        <!-- 内容 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">内容</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <pre class="whitespace-pre-wrap text-gray-800 font-mono text-sm">{{ (promptData.data as {content: string}).content }}</pre>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="parsedTags.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">标签</h3>
          <n-space>
            <n-tag 
              v-for="tag in parsedTags" 
              :key="tag"
              type="info"
            >
              {{ tag }}
            </n-tag>
          </n-space>
        </div>

        <!-- 时间信息 -->
        <div class="border-t pt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span class="font-medium">创建时间：</span>
              {{ formatDate((promptData.data as {createdAt: string}).createdAt) }}
            </div>
            <div>
              <span class="font-medium">更新时间：</span>
              {{ formatDate((promptData.data as {updatedAt: string}).updatedAt) }}
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NCard,
  NButton,
  NSpace,
  NIcon,
  NTag,
  NSpin,
  NResult,
  NBreadcrumb,
  NBreadcrumbItem,
  NPopconfirm,
  useMessage
} from 'naive-ui'
import { Create as EditIcon, Trash as DeleteIcon } from '@vicons/ionicons5'

// 获取路由参数
const route = useRoute()
const message = useMessage()
const promptId = route.params.id as string

// 获取数据
const { data: promptData, pending, error } = await useFetch(`/api/prompts/${promptId}`)

// 计算属性
const parsedTags = computed(() => {
  if (!promptData.value?.data || typeof promptData.value.data === 'object' && Array.isArray(promptData.value.data)) return []
  const data = promptData.value.data as {tags: string | null}
  if (!data.tags) return []
  try {
    return JSON.parse(data.tags as string)
  } catch {
    return []
  }
})

// 方法
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const handleDelete = async () => {
  try {
    await $fetch(`/api/prompts/${promptId}`, {
      method: 'DELETE' as any
    })
    message.success('删除成功')
    navigateTo('/')
  } catch (error) {
    message.error('删除失败')
  }
}

// 页面元数据
useHead({
  title: computed(() => 
    promptData.value?.data && typeof promptData.value.data === 'object' && !Array.isArray(promptData.value.data) ? 
    `${(promptData.value.data as {title: string}).title} - Prompt 管理器` : 
    'Prompt 详情 - Prompt 管理器'
  )
})
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
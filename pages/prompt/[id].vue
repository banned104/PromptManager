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
        <div v-if="displayImages.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">图片</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="(imagePath, index) in displayImages" 
              :key="index"
              class="relative group"
            >
              <img 
                :src="imagePath" 
                :alt="`${(promptData.data as {title: string}).title} - 图片 ${index + 1}`"
                class="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                @error="handleImageError"
                @click="openImagePreview(imagePath)"
              />
            </div>
          </div>
        </div>

        <!-- 内容 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">内容</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <!-- 如果内容包含 Markdown 格式，则渲染为 Markdown -->
            <div 
              v-if="isMarkdownContent"
              class="prose prose-sm max-w-none text-gray-800"
              v-html="renderedContent"
            ></div>
            <!-- 否则使用高亮文本组件 -->
            <HighlightableText 
              v-else
              :text="(promptData.data as {content: string}).content" 
              :highlights="parsedHighlights"
              :editable="false"
              class="whitespace-pre-wrap text-gray-800 font-mono text-sm"
            />
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

    <!-- 图片预览模态框 -->
    <n-modal
      v-model:show="showImagePreview"
      preset="card"
      class="w-[90vw] max-w-4xl"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <span>图片预览 ({{ currentImageIndex + 1 }} / {{ displayImages.length }})</span>
          <n-button quaternary circle @click="closeImagePreview">
            <template #icon>
              <n-icon :component="DeleteIcon" />
            </template>
          </n-button>
        </div>
      </template>
      
      <div class="relative">
        <img 
          :src="previewImageUrl" 
          :alt="`预览图片 ${currentImageIndex + 1}`"
          class="w-full h-auto max-h-[70vh] object-contain rounded-lg"
          @error="handleImageError"
        />
        
        <!-- 导航按钮 -->
        <div v-if="displayImages.length > 1" class="absolute inset-y-0 left-0 flex items-center">
          <n-button
            v-if="currentImageIndex > 0"
            circle
            size="large"
            class="ml-4 bg-black/50 text-white hover:bg-black/70"
            @click="previousImage"
          >
            <template #icon>
              <n-icon :component="ChevronBackIcon" />
            </template>
          </n-button>
        </div>
        
        <div v-if="displayImages.length > 1" class="absolute inset-y-0 right-0 flex items-center">
          <n-button
            v-if="currentImageIndex < displayImages.length - 1"
            circle
            size="large"
            class="mr-4 bg-black/50 text-white hover:bg-black/70"
            @click="nextImage"
          >
            <template #icon>
              <n-icon :component="ChevronForwardIcon" />
            </template>
          </n-button>
        </div>
      </div>
      
      <!-- 缩略图导航 -->
      <div v-if="displayImages.length > 1" class="mt-4">
        <div class="flex justify-center space-x-2 overflow-x-auto pb-2">
          <img
            v-for="(imagePath, index) in displayImages"
            :key="index"
            :src="imagePath"
            :alt="`缩略图 ${index + 1}`"
            class="w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all"
            :class="{
              'border-blue-500': index === currentImageIndex,
              'border-gray-300 hover:border-gray-400': index !== currentImageIndex
            }"
            @click="currentImageIndex = index; previewImageUrl = imagePath"
            @error="handleImageError"
          />
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
  NModal,
  useMessage
} from 'naive-ui'
import { Create as EditIcon, Trash as DeleteIcon, ChevronBack as ChevronBackIcon, ChevronForward as ChevronForwardIcon } from '@vicons/ionicons5'
import { marked } from 'marked'
import HighlightableText from '~/components/HighlightableText.vue'

interface Highlight {
  id: string
  start: number
  end: number
  text: string
  color: string
}

// 获取路由参数
const route = useRoute()
const message = useMessage()
const promptId = route.params.id as string

// 图片预览相关
const showImagePreview = ref(false)
const currentImageIndex = ref(0)
const previewImageUrl = ref('')

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

// 处理多图片显示
const displayImages = computed(() => {
  if (!promptData.value?.data || typeof promptData.value.data === 'object' && Array.isArray(promptData.value.data)) return []
  const data = promptData.value.data as {imagePath: string | null, images: string | null}
  
  let imageList: string[] = []
  
  // 优先使用新的 images 字段
  if (data.images) {
    try {
      const parsedImages = JSON.parse(data.images)
      if (Array.isArray(parsedImages)) {
        imageList = parsedImages.filter(img => img && typeof img === 'string')
      }
    } catch {
      // 如果解析失败，忽略
    }
  }
  
  // 如果没有 images 数据，回退到 imagePath（向后兼容）
  if (imageList.length === 0 && data.imagePath) {
    imageList = [data.imagePath]
  }
  
  return imageList
})

// 判断内容是否为 Markdown 格式
const isMarkdownContent = computed(() => {
  if (!promptData.value?.data || typeof promptData.value.data === 'object' && Array.isArray(promptData.value.data)) return false
  const data = promptData.value.data as {content: string, tags: string | null}
  
  // 检查是否包含 Civitai 标签（从 Civitai 获取的内容通常是 Markdown）
  let tags: string[] = []
  if (data.tags) {
    try {
      tags = JSON.parse(data.tags)
    } catch {
      tags = []
    }
  }
  
  const hasCivitaiTag = tags.some(tag => tag.toLowerCase() === 'civitai')
  
  // 检查内容是否包含 Markdown 语法
  const content = data.content || ''
  const hasMarkdownSyntax = /^#{1,6}\s|^\*\*.*\*\*|\*.*\*|^\-\s|^\d+\.\s|^\>|```|`.*`|\[.*\]\(.*\)/m.test(content)
  
  return hasCivitaiTag || hasMarkdownSyntax
})

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!promptData.value?.data || typeof promptData.value.data === 'object' && Array.isArray(promptData.value.data)) return ''
  const data = promptData.value.data as {content: string}
  
  try {
    // 配置 marked 选项
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false
    })
    
    return marked(data.content)
  } catch (error) {
    console.error('Markdown 渲染失败:', error)
    return data.content.replace(/\n/g, '<br>')
  }
})

// 解析高亮数据
const parsedHighlights = computed(() => {
  if (!promptData.value?.data || typeof promptData.value.data === 'object' && Array.isArray(promptData.value.data)) return []
  const data = promptData.value.data as {highlights: string | null}
  if (!data.highlights) return []
  try {
    return JSON.parse(data.highlights as string) as Highlight[]
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

// 图片预览相关方法
const openImagePreview = (imagePath: string) => {
  const index = displayImages.value.findIndex(img => img === imagePath)
  currentImageIndex.value = index >= 0 ? index : 0
  previewImageUrl.value = imagePath
  showImagePreview.value = true
}

const closeImagePreview = () => {
  showImagePreview.value = false
  previewImageUrl.value = ''
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
    previewImageUrl.value = displayImages.value[currentImageIndex.value]
  }
}

const nextImage = () => {
  if (currentImageIndex.value < displayImages.value.length - 1) {
    currentImageIndex.value++
    previewImageUrl.value = displayImages.value[currentImageIndex.value]
  }
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
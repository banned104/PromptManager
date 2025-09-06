<template>
  <teleport to="body">
    <div
      v-if="visible"
      ref="floatingWindow"
      class="fixed z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
        width: expanded ? '600px' : '400px',
        minHeight: expanded ? '500px' : '200px'
      }"
    >
      <!-- 标题栏 -->
      <div
        ref="titleBar"
        class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg cursor-move select-none"
        @mousedown="startDrag"
      >
        <div class="flex items-center space-x-2">
          <n-icon size="20">
            <CloudDownloadIcon />
          </n-icon>
          <span class="font-medium">Civitai LORA</span>
        </div>
        <div class="flex items-center space-x-2">
          <n-button
            v-if="expanded"
            size="small"
            quaternary
            @click="toggleExpanded"
            class="text-white hover:bg-white/20"
          >
            <template #icon>
              <n-icon><ChevronUpIcon /></n-icon>
            </template>
          </n-button>
          <n-button
            size="small"
            quaternary
            @click="closeWindow"
            class="text-white hover:bg-white/20"
          >
            <template #icon>
              <n-icon><CloseIcon /></n-icon>
            </template>
          </n-button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        <!-- URL 输入区域 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Civitai 模型链接
          </label>
          <div class="flex space-x-2">
            <n-input
              v-model:value="inputUrl"
              placeholder="请输入 Civitai 模型页面链接，如：https://civitai.com/models/12345"
              :disabled="loading"
              @keyup.enter="fetchModelInfo"
              class="flex-1"
            />
            <n-button
              type="primary"
              :loading="loading"
              :disabled="!inputUrl.trim() || !isValidUrl"
              @click="fetchModelInfo"
            >
              获取信息
            </n-button>
          </div>
          <div v-if="!isValidUrl && inputUrl.trim()" class="text-xs text-red-500">
            请输入有效的 Civitai 模型链接
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div class="flex items-center space-x-2">
            <n-icon size="16" class="text-red-500">
              <AlertCircleIcon />
            </n-icon>
            <span class="text-sm text-red-700 dark:text-red-300">{{ error }}</span>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <n-spin size="large" />
          <span class="ml-3 text-gray-600 dark:text-gray-400">正在获取模型信息...</span>
        </div>

        <!-- 模型信息展示 -->
        <div v-if="modelData && !loading" class="space-y-4">
          <!-- 基本信息 -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ modelData.name }}
            </h3>
            <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>类型: {{ modelData.type }}</span>
              <span>创建者: {{ modelData.creator.username }}</span>
              <span>下载: {{ formatNumber(modelData.stats.downloadCount) }}</span>
              <span>评分: {{ modelData.stats.rating.toFixed(1) }}</span>
            </div>
          </div>

          <!-- 展开内容 -->
          <div v-if="!expanded" class="text-center">
            <n-button @click="toggleExpanded" type="primary" ghost>
              <template #icon>
                <n-icon><ChevronDownIcon /></n-icon>
              </template>
              展开查看详细信息
            </n-button>
          </div>

          <div v-else class="space-y-4">
            <!-- 描述 -->
            <div v-if="modelData.description">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">描述</h4>
              <div 
                class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-md"
                v-html="formatDescription(modelData.description)"
              ></div>
            </div>

            <!-- 训练词汇 -->
            <div v-if="trainedWords.length > 0">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">训练词汇</h4>
              <div class="flex flex-wrap gap-2">
                <n-tag
                  v-for="word in trainedWords"
                  :key="word"
                  type="info"
                  size="small"
                  class="cursor-pointer"
                  @click="copyToClipboard(word)"
                >
                  {{ word }}
                </n-tag>
              </div>
            </div>

            <!-- 标签 -->
            <div v-if="modelData.tags.length > 0">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">标签</h4>
              <div class="flex flex-wrap gap-2">
                <n-tag
                  v-for="tag in modelData.tags.slice(0, 10)"
                  :key="tag"
                  size="small"
                  class="cursor-pointer"
                  @click="copyToClipboard(tag)"
                >
                  {{ tag }}
                </n-tag>
              </div>
            </div>

            <!-- 图片展示 -->
            <div v-if="primaryImage">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">预览图片</h4>
              <div class="relative group">
                <img
                  :src="primaryImage"
                  :alt="modelData.name"
                  class="w-full h-48 object-cover rounded-md cursor-pointer"
                  @click="copyImageToClipboard"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md flex items-center justify-center">
                  <n-button
                    class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    type="primary"
                    @click="copyImageToClipboard"
                  >
                    <template #icon>
                      <n-icon><CopyIcon /></n-icon>
                    </template>
                    复制图片
                  </n-button>
                </div>
              </div>
            </div>

            <!-- 版本信息 -->
            <div v-if="modelData.modelVersions.length > 0">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">最新版本</h4>
              <div class="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm">
                <div class="space-y-1">
                  <div><strong>版本名称:</strong> {{ modelData.modelVersions[0].name }}</div>
                  <div><strong>基础模型:</strong> {{ modelData.modelVersions[0].baseModel }}</div>
                  <div><strong>下载次数:</strong> {{ formatNumber(modelData.modelVersions[0].stats.downloadCount) }}</div>
                </div>
              </div>
            </div>

            <!-- 保存按钮 -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <n-button
                type="primary"
                size="large"
                block
                :loading="saving"
                @click="saveToPrompts"
                class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <template #icon>
                  <n-icon><SaveIcon /></n-icon>
                </template>
                保存为 Prompt 卡片
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NInput, NButton, NIcon, NSpin, NTag, useMessage } from 'naive-ui'
import { 
  CloudDownload as CloudDownloadIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  Close as CloseIcon,
  AlertCircle as AlertCircleIcon,
  Copy as CopyIcon,
  Save as SaveIcon
} from '@vicons/ionicons5'
import type { CivitaiModel, FloatingWindowPosition } from '~/types/civitai'
import { getCivitaiModelInfo, validateCivitaiUrl, getPrimaryImage, getTrainedWords } from '~/utils/civitai'

// Props
interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// 响应式数据
const floatingWindow = ref<HTMLElement>()
const titleBar = ref<HTMLElement>()
const position = ref<FloatingWindowPosition>({ x: 100, y: 100 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const expanded = ref(false)
const inputUrl = ref('')
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const modelData = ref<CivitaiModel | null>(null)
const message = useMessage()

// 计算属性
const isValidUrl = computed(() => {
  return inputUrl.value.trim() ? validateCivitaiUrl(inputUrl.value.trim()) : true
})

const primaryImage = computed(() => {
  return modelData.value ? getPrimaryImage(modelData.value) : null
})

const trainedWords = computed(() => {
  return modelData.value ? getTrainedWords(modelData.value) : []
})

// 拖拽功能
const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  dragOffset.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  }
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  event.preventDefault()
}

const handleDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  const newX = event.clientX - dragOffset.value.x
  const newY = event.clientY - dragOffset.value.y
  
  // 限制在视窗内
  const maxX = window.innerWidth - (expanded.value ? 600 : 400)
  const maxY = window.innerHeight - 200
  
  position.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  
  // 保存位置到 localStorage
  localStorage.setItem('civitai-lora-position', JSON.stringify(position.value))
}

// 窗口控制
const closeWindow = () => {
  emit('update:visible', false)
}

const toggleExpanded = () => {
  expanded.value = !expanded.value
  // 保存展开状态
  localStorage.setItem('civitai-lora-expanded', expanded.value.toString())
}

// 获取模型信息
const fetchModelInfo = async () => {
  if (!inputUrl.value.trim() || !isValidUrl.value) return
  
  loading.value = true
  error.value = null
  modelData.value = null
  
  try {
    const data = await getCivitaiModelInfo(inputUrl.value.trim())
    modelData.value = data
    if (!expanded.value) {
      expanded.value = true
    }
    message.success('模型信息获取成功')
  } catch (err: any) {
    error.value = err.message || '获取模型信息失败'
    message.error(error.value)
  } finally {
    loading.value = false
  }
}

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDescription = (description: string): string => {
  // 简单的 HTML 清理和格式化，不再限制长度
  return description
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    message.success(`已复制: ${text}`)
  } catch (err) {
    message.error('复制失败')
  }
}

const copyImageToClipboard = async () => {
  if (!primaryImage.value) return
  
  try {
    const response = await fetch(primaryImage.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ])
    message.success('图片已复制到剪贴板')
  } catch (err) {
    // 如果复制图片失败，尝试复制图片链接
    try {
      await navigator.clipboard.writeText(primaryImage.value)
      message.success('图片链接已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }
}

// 保存为Prompt卡片
const saveToPrompts = async () => {
  if (!modelData.value) return
  
  saving.value = true
  
  try {
    // 构建Prompt内容
    const content = buildPromptContent(modelData.value)
    
    // 构建标签数组，包含Civitai标签
    const tags = ['Civitai', ...modelData.value.tags.slice(0, 8)] // 限制标签数量
    
    // 调用API保存
    const response = await $fetch('/api/prompts', {
      method: 'POST',
      body: {
        title: modelData.value.name,
        content: content,
        imagePath: primaryImage.value || null,
        tags: tags
      }
    })
    
    if (response.success) {
      message.success('LORA信息已保存为Prompt卡片！')
      // 清空当前数据
      modelData.value = null
      inputUrl.value = ''
      expanded.value = false
    }
  } catch (error: any) {
    console.error('保存失败:', error)
    message.error(error.data?.statusMessage || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 构建Prompt内容
const buildPromptContent = (model: CivitaiModel): string => {
  let content = ''
  
  // 添加Details部分（重要信息）
  content += `**模型详情:**\n`
  content += `- 名称: ${model.name}\n`
  content += `- 类型: ${model.type}\n`
  content += `- 创建者: ${model.creator.username}\n`
  content += `- 评分: ${model.stats.rating.toFixed(1)} (${formatNumber(model.stats.downloadCount)} 下载)\n`
  
  // 添加最新版本信息
  if (model.modelVersions.length > 0) {
    const version = model.modelVersions[0]
    content += `- 版本: ${version.name}\n`
    content += `- 基础模型: ${version.baseModel}\n`
  }
  
  // 添加训练词汇
  const words = getTrainedWords(model)
  if (words.length > 0) {
    content += `\n**训练词汇:** ${words.join(', ')}\n`
  }
  
  // 添加描述（不再限制长度）
  if (model.description) {
    const cleanDescription = model.description
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim()
    
    if (cleanDescription) {
      content += `\n**描述:**\n`
      content += cleanDescription
    }
  }
  
  // 添加原始链接
  content += `\n\n**原始链接:** ${inputUrl.value}`
  
  return content
}

// 生命周期
onMounted(() => {
  // 恢复位置和状态
  const savedPosition = localStorage.getItem('civitai-lora-position')
  if (savedPosition) {
    try {
      position.value = JSON.parse(savedPosition)
    } catch {
      // 忽略解析错误
    }
  }
  
  const savedExpanded = localStorage.getItem('civitai-lora-expanded')
  if (savedExpanded) {
    expanded.value = savedExpanded === 'true'
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.cursor-move {
  cursor: move;
}

.select-none {
  user-select: none;
}
</style>
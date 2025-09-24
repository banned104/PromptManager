<template>
  <teleport to="body">
    <div
      v-if="visible"
      ref="floatingWindow"
      class="fixed z-[9999] bg-white rounded-lg shadow-2xl border border-gray-300 resize-none overflow-hidden"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
        width: windowSize.width + 'px',
        height: windowSize.height + 'px',
        minWidth: '400px',
        minHeight: '300px',
        maxWidth: '90vw',
        maxHeight: '90vh'
      }"
    >
      <!-- 标题栏 -->
      <div
        ref="titleBar"
        class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-100 text-gray-800 rounded-t-lg cursor-move select-none border-b border-gray-200"
        @mousedown="startDrag"
      >
        <div class="flex items-center space-x-2">
          <n-icon size="20" class="text-blue-600">
            <CloudDownloadIcon />
          </n-icon>
          <span class="font-semibold text-gray-800">Civitai LORA 获取工具</span>
        </div>
        <div class="flex items-center space-x-2">
          <n-button
            size="small"
            circle
            quaternary
            @click="toggleExpanded"
            class="text-gray-600 hover:bg-gray-200"
          >
            <template #icon>
              <n-icon><ChevronUpIcon v-if="expanded" /><ChevronDownIcon v-else /></n-icon>
            </template>
          </n-button>
          <n-button
            size="small"
            circle
            quaternary
            @click="closeWindow"
            class="text-gray-600 hover:bg-gray-200"
          >
            <template #icon>
              <n-icon><CloseIcon /></n-icon>
            </template>
          </n-button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-4 space-y-4 flex-1 overflow-y-auto" :style="{ height: (windowSize.height - 120) + 'px' }">
        <!-- URL 输入区域 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">
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
            
            <n-button
              v-if="modelData"
              type="warning"
              :loading="loading"
              @click="forceRefresh"
              class="bg-orange-500 hover:bg-orange-600"
            >
              <template #icon>
                <n-icon><CloudDownloadIcon /></n-icon>
              </template>
              强制刷新
            </n-button>
          </div>
          <div v-if="!isValidUrl && inputUrl.trim()" class="text-xs text-red-500">
            请输入有效的 Civitai 模型链接
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
          <div class="flex items-center">
            <n-icon class="text-red-500 mr-2">
              <AlertCircleIcon />
            </n-icon>
            <span class="text-sm text-red-700">{{ error }}</span>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <n-spin size="large" />
          <span class="ml-3 text-gray-600">正在获取模型信息...</span>
        </div>

        <!-- 模型信息展示 -->
        <div v-if="modelData && !loading" class="space-y-4">
          <!-- 基本信息 -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ modelData.name }}
            </h3>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
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
              <h4 class="font-medium text-gray-900 mb-2">描述</h4>
              <div 
                class="text-sm text-gray-700 bg-gray-50 p-3 rounded-md prose prose-sm max-w-none"
                v-html="renderedMarkdown"
              ></div>
            </div>

            <!-- 训练词汇 -->
            <div v-if="trainedWords.length > 0">
              <h4 class="font-medium text-gray-900 mb-2">训练词汇</h4>
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
              <h4 class="font-medium text-gray-900 mb-2">标签</h4>
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

            <!-- 图片展示和参数 -->
            <div v-if="modelData.allImages && modelData.allImages.length > 0">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                示例图片和参数 ({{ modelData.allImages.length }} 张)
              </h4>
              
              <!-- 图片网格展示 -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600">点击图片查看参数，勾选图片进行保存</span>
                  <div class="flex space-x-2">
                    <n-button size="tiny" @click="selectAllImages">
                      全选 ({{ selectedImageIds.size }}/{{ modelData.allImages.length }})
                    </n-button>
                    <n-button size="tiny" @click="clearImageSelection">
                      清空选择
                    </n-button>
                  </div>
                </div>
                
                <div class="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  <div
                    v-for="(image, index) in modelData.allImages"
                    :key="image.id"
                    class="relative group cursor-pointer"
                    @click="selectedImageIndex = index"
                  >
                    <!-- 图片 -->
                    <img
                      :src="image.url"
                      :alt="`示例图片 ${index + 1}`"
                      class="w-full h-16 object-cover rounded border-2 transition-all"
                      :class="{
                        'border-blue-500 ring-2 ring-blue-200': index === selectedImageIndex,
                        'border-gray-300 hover:border-gray-400': index !== selectedImageIndex
                      }"
                    />
                    
                    <!-- 选择复选框 -->
                    <div 
                      class="absolute top-1 right-1 w-4 h-4 rounded border-2 bg-white flex items-center justify-center transition-all"
                      :class="{
                        'border-green-500 bg-green-500': selectedImageIds.has(image.id),
                        'border-gray-400 hover:border-gray-600': !selectedImageIds.has(image.id)
                      }"
                      @click.stop="toggleImageSelection(image.id)"
                    >
                      <div v-if="selectedImageIds.has(image.id)" class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    
                    <!-- 参数指示器 -->
                    <div v-if="image.params?.prompt" class="absolute bottom-1 left-1">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 当前选中的图片 -->
              <div class="relative group mb-4">
                <img
                  :src="currentSelectedImage?.url"
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
              
              <!-- 图片参数信息 -->
              <div v-if="currentImageParams" class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <h5 class="font-medium text-blue-900 dark:text-blue-100 mb-2">生成参数</h5>
                <div class="space-y-2 text-sm">
                  <div v-if="currentImageParams.prompt" class="space-y-1">
                    <div class="font-medium text-blue-800 dark:text-blue-200">正向提示词:</div>
                    <div class="bg-white dark:bg-gray-800 p-2 rounded text-gray-700 dark:text-gray-300 font-mono text-xs break-all">
                      {{ currentImageParams.prompt }}
                    </div>
                    <n-button size="tiny" @click="copyToClipboard(currentImageParams.prompt)">
                      <template #icon><n-icon><CopyIcon /></n-icon></template>
                      复制提示词
                    </n-button>
                  </div>
                  
                  <div v-if="currentImageParams.negativePrompt" class="space-y-1">
                    <div class="font-medium text-blue-800 dark:text-blue-200">负向提示词:</div>
                    <div class="bg-white dark:bg-gray-800 p-2 rounded text-gray-700 dark:text-gray-300 font-mono text-xs break-all">
                      {{ currentImageParams.negativePrompt }}
                    </div>
                    <n-button size="tiny" @click="copyToClipboard(currentImageParams.negativePrompt)">
                      <template #icon><n-icon><CopyIcon /></n-icon></template>
                      复制负向提示词
                    </n-button>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div v-if="currentImageParams.steps">
                      <span class="font-medium">步数:</span> {{ currentImageParams.steps }}
                    </div>
                    <div v-if="currentImageParams.cfgScale">
                      <span class="font-medium">CFG:</span> {{ currentImageParams.cfgScale }}
                    </div>
                    <div v-if="currentImageParams.sampler">
                      <span class="font-medium">采样器:</span> {{ currentImageParams.sampler }}
                    </div>
                    <div v-if="currentImageParams.seed">
                      <span class="font-medium">种子:</span> {{ currentImageParams.seed }}
                    </div>
                    <div>
                      <span class="font-medium">尺寸:</span> {{ currentImageParams.size }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 回退：如果没有获取到图片参数，显示原有的图片 -->
            <div v-else-if="primaryImage">
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

            <!-- 保存选项和按钮 -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <!-- 选择状态 -->
               <div class="text-sm">
                 <div class="text-gray-600 dark:text-gray-400 mb-2">当前状态:</div>
                 <div class="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
                   📋 已选择 {{ selectedImageIds.size }} 张图片<br>
                   🖼️ 当前查看: 第 {{ selectedImageIndex + 1 }} 张<br>
                   📝 有参数的图片: {{ modelData.allImages?.filter(img => img.params?.prompt).length || 0 }} 张
                 </div>
               </div>
              
              <!-- 快速复制按钮 -->
               <div v-if="currentImageParams" class="flex space-x-2">
                 <n-button
                   size="small"
                   @click="copyToClipboard(currentImageParams.prompt)"
                 >
                   <template #icon>
                     <n-icon><CopyIcon /></n-icon>
                   </template>
                   复制当前提示词
                 </n-button>
                 
                 <n-button
                   size="small"
                   @click="copyCurrentParams"
                 >
                   <template #icon>
                     <n-icon><CopyIcon /></n-icon>
                   </template>
                   复制当前参数
                 </n-button>
               </div>
              
              <!-- 主保存按钮 -->
              <n-button
                type="primary"
                size="large"
                block
                :disabled="!modelData"
                @click="openSaveDialog"
                class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                :class="{ 'opacity-50 cursor-not-allowed': !modelData }"
              >
                <template #icon>
                  <n-icon><SaveIcon /></n-icon>
                </template>
                <span v-if="!modelData">请先获取模型信息</span>
                <span v-else-if="selectedImageIds.size === 0">保存模型信息 (无图片)</span>
                <span v-else>保存选中内容 ({{ selectedImageIds.size }} 张图片)</span>
              </n-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 调整大小手柄 -->
      <div 
        class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-300 hover:bg-gray-400 transition-colors"
        @mousedown="startResize"
        style="clip-path: polygon(100% 0%, 0% 100%, 100% 100%)"
      ></div>
    </div>

    <!-- 保存内容选择对话框 -->
    <n-modal
      v-model:show="showSaveDialog"
      preset="card"
      title="选择保存内容"
      class="w-[90vw] max-w-4xl"
      :bordered="false"
      size="huge"
    >
      <div class="space-y-4">
        <!-- 选中的图片预览 -->
        <div>
          <h4 class="font-medium mb-2">选中的图片 ({{ selectedImages.length }} 张)</h4>
          <div class="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
            <div
              v-for="image in selectedImages"
              :key="image.id"
              class="relative group"
            >
              <img
                :src="image.url"
                :alt="`选中图片`"
                class="w-full h-16 object-cover rounded border"
              />
              <div class="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <!-- 保存选项 -->
        <div class="space-y-3">
          <h4 class="font-medium">保存选项</h4>
          
          <n-radio-group v-model:value="saveOption" name="saveOption">
            <n-space vertical>
              <n-radio value="complete">
                <div class="flex flex-col">
                  <span class="font-medium">完整模型信息 ⭐ 推荐</span>
                  <span class="text-sm text-gray-500">包含模型描述、图片和参数（即使无图片也可保存）</span>
                </div>
              </n-radio>
              
              <n-radio value="prompts-only" :disabled="selectedImages.filter(img => img.params?.prompt).length === 0">
                <div class="flex flex-col">
                  <span class="font-medium">仅提示词集合</span>
                  <span class="text-sm text-gray-500">只保存有提示词的图片参数（需要有效提示词）</span>
                </div>
              </n-radio>
              
              <n-radio value="separate" :disabled="selectedImages.filter(img => img.params?.prompt).length === 0">
                <div class="flex flex-col">
                  <span class="font-medium">分别保存</span>
                  <span class="text-sm text-gray-500">每张有参数的图片单独保存为一个 Prompt</span>
                </div>
              </n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <!-- 预览保存内容 -->
        <div v-if="saveOption" class="bg-gray-50 p-3 rounded">
          <h5 class="font-medium mb-2">保存预览</h5>
          <div class="text-sm text-gray-600">
            <div v-if="saveOption === 'complete'">
              将创建 1 个 Prompt，包含模型完整信息
              <span v-if="selectedImages.length > 0">和 {{ selectedImages.length }} 张图片</span>
              <span v-else>（无图片）</span>
            </div>
            <div v-else-if="saveOption === 'prompts-only'">
              <span v-if="selectedImages.filter(img => img.params?.prompt).length > 0">
                将创建 1 个 Prompt，包含 {{ selectedImages.filter(img => img.params?.prompt).length }} 个有效提示词
              </span>
              <span v-else class="text-red-500">
                无有效提示词，请选择其他保存方式
              </span>
            </div>
            <div v-else-if="saveOption === 'separate'">
              <span v-if="selectedImages.filter(img => img.params?.prompt).length > 0">
                将创建 {{ selectedImages.filter(img => img.params?.prompt).length }} 个 Prompt，每个包含一张图片和对应参数
              </span>
              <span v-else class="text-red-500">
                无有效提示词，请选择其他保存方式
              </span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <n-button @click="showSaveDialog = false">取消</n-button>
          <n-button
            type="primary"
            :loading="saving"
            :disabled="!saveOption || !modelData || ((saveOption === 'prompts-only' || saveOption === 'separate') && selectedImages.length === 0)"
            @click="executeSave"
          >
            <span v-if="saving">保存中...</span>
            <span v-else-if="!saveOption">请选择保存方式</span>
            <span v-else-if="!modelData">模型数据不存在</span>
            <span v-else-if="(saveOption === 'prompts-only' || saveOption === 'separate') && selectedImages.length === 0">该模式需要选中图片</span>
            <span v-else-if="saveOption === 'complete'">保存完整模型 ({{ selectedImages.length }} 张图片)</span>
            <span v-else>确认保存 ({{ selectedImages.length }} 张)</span>
          </n-button>
        </div>
      </template>
    </n-modal>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { NInput, NButton, NIcon, NSpin, NTag, NModal, NRadioGroup, NRadio, NSpace, useMessage } from 'naive-ui'
import { 
  CloudDownload as CloudDownloadIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  Close as CloseIcon,
  AlertCircle as AlertCircleIcon,
  Copy as CopyIcon,
  Save as SaveIcon
} from '@vicons/ionicons5'
import { marked } from 'marked'
import type { CivitaiModel, CivitaiModelWithImages, CivitaiImageWithParams, FloatingWindowPosition } from '~/types/civitai'
import { getCivitaiModelWithImages, validateCivitaiUrl, getPrimaryImage, getTrainedWords } from '~/utils/civitai'

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
const windowSize = ref({ width: 600, height: 500 })
const isDragging = ref(false)
const isResizing = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const resizeStartPos = ref({ x: 0, y: 0 })
const resizeStartSize = ref({ width: 0, height: 0 })
const expanded = ref(false)
const inputUrl = ref('')
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const modelData = ref<CivitaiModelWithImages | null>(null)
const selectedImageIndex = ref(0)
const selectedImageIds = ref<Set<number>>(new Set())
const showSaveDialog = ref(false)
const saveOption = ref<'complete' | 'prompts-only' | 'separate'>('complete')
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

// 渲染 Markdown 内容
const renderedMarkdown = computed(() => {
  if (!modelData.value?.description) return ''
  
  try {
    // 配置 marked 选项
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false // 注意：在生产环境中可能需要启用sanitize
    })
    
    // 渲染 Markdown
    return marked(modelData.value.description)
  } catch (error) {
    console.error('Markdown 渲染失败:', error)
    // 如果渲染失败，回退到纯文本显示
    return modelData.value.description.replace(/\n/g, '<br>')
  }
})

// 当前选中的图片
const currentSelectedImage = computed(() => {
  if (!modelData.value?.allImages || modelData.value.allImages.length === 0) return null
  return modelData.value.allImages[selectedImageIndex.value] || modelData.value.allImages[0]
})

// 当前选中图片的参数
const currentImageParams = computed(() => {
  return currentSelectedImage.value?.params || null
})

// 选中的图片列表
const selectedImages = computed(() => {
  if (!modelData.value?.allImages) return []
  return modelData.value.allImages.filter(image => selectedImageIds.value.has(image.id))
})

// 监听组件显示状态变化
watch(() => props.visible, (newVisible, oldVisible) => {
  if (newVisible && !oldVisible) {
    // 组件从隐藏变为显示时，清除旧数据
    console.log('🔄 CivitaiLora 组件打开，清除旧数据')
    modelData.value = null
    inputUrl.value = ''
    selectedImageIds.value.clear()
    selectedImageIndex.value = 0
    error.value = null
    showSaveDialog.value = false
  }
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

// 调整大小功能
const startResize = (event: MouseEvent) => {
  isResizing.value = true
  resizeStartPos.value = { x: event.clientX, y: event.clientY }
  resizeStartSize.value = { ...windowSize.value }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  event.preventDefault()
  event.stopPropagation()
}

const handleResize = (event: MouseEvent) => {
  if (!isResizing.value) return
  
  const deltaX = event.clientX - resizeStartPos.value.x
  const deltaY = event.clientY - resizeStartPos.value.y
  
  const newWidth = Math.max(400, Math.min(window.innerWidth * 0.9, resizeStartSize.value.width + deltaX))
  const newHeight = Math.max(300, Math.min(window.innerHeight * 0.9, resizeStartSize.value.height + deltaY))
  
  windowSize.value = { width: newWidth, height: newHeight }
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  
  // 保存窗口大小到 localStorage
  localStorage.setItem('civitai-lora-size', JSON.stringify(windowSize.value))
}

// 窗口控制
const closeWindow = () => {
  // 清除当前数据，避免下次打开时显示旧数据
  modelData.value = null
  inputUrl.value = ''
  selectedImageIds.value.clear()
  selectedImageIndex.value = 0
  error.value = null
  emit('update:visible', false)
}

const toggleExpanded = () => {
  expanded.value = !expanded.value
  // 保存展开状态
  localStorage.setItem('civitai-lora-expanded', expanded.value.toString())
}

// 获取模型信息
const fetchModelInfo = async (forceRefresh = false) => {
  if (!inputUrl.value.trim() || !isValidUrl.value) {
    error.value = '请输入有效的 Civitai 模型链接'
    return
  }
  
  loading.value = true
  error.value = null
  modelData.value = null
  
  try {
    // 如果是强制刷新，先清除相关缓存
    if (forceRefresh) {
      clearAllCaches()
    }
    
    const data = await getCivitaiModelWithImages(inputUrl.value.trim())
    modelData.value = data
    selectedImageIndex.value = 0 // 重置选中的图片索引
    selectedImageIds.value.clear() // 清空图片选择
    
    // 自动选中所有图片（特别是单张图片的情况）
    if (data?.allImages && data.allImages.length > 0) {
      console.log(`🖼️ 自动选中 ${data.allImages.length} 张图片`)
      selectedImageIds.value.clear() // 先清空
      data.allImages.forEach(image => {
        selectedImageIds.value.add(image.id)
        console.log(`✅ 选中图片 ID: ${image.id}`)
      })
      console.log(`📋 当前选中图片数量: ${selectedImageIds.value.size}`)
    }
    
    if (!expanded.value) {
      expanded.value = true
    }
    message.success(`模型信息获取成功${data?.allImages ? `，包含 ${data.allImages.length} 张图片` : ''}${forceRefresh ? ' (已清除缓存)' : ''}`)
  } catch (err: any) {
    error.value = err.message || '获取模型信息失败'
    message.error(error.value)
  } finally {
    loading.value = false
  }
}

// 强制刷新
const forceRefresh = () => {
  fetchModelInfo(true)
}

// 清除所有相关缓存
const clearAllCaches = () => {
  console.log('🧹 清除所有 Civitai 相关缓存...')
  
  if (typeof window !== 'undefined') {
    // 1. 清除可能的 Service Worker 缓存
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.update()
        })
      })
    }
    
    // 2. 清除相关的 localStorage 数据（保留位置和展开状态）
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.includes('civitai') && !key.includes('position') && !key.includes('expanded')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => {
      console.log(`🗑️ 删除 localStorage 键: ${key}`)
      localStorage.removeItem(key)
    })
    
    // 3. 清除可能的 sessionStorage 数据
    const sessionKeysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.includes('civitai')) {
        sessionKeysToRemove.push(key)
      }
    }
    sessionKeysToRemove.forEach(key => {
      console.log(`🗑️ 删除 sessionStorage 键: ${key}`)
      sessionStorage.removeItem(key)
    })
    
    // 4. 尝试清除 Nuxt 的缓存
    if (window.$nuxt) {
      try {
        // 清除 Nuxt 的数据缓存
        window.$nuxt.$router.go(0) // 这会重新加载页面，但我们不想这样做
      } catch (e) {
        // 忽略错误
      }
    }
  }
  
  console.log('✅ 缓存清除完成')
}

// 图片选择相关方法
const toggleImageSelection = (imageId: number) => {
  console.log(`🔄 切换图片选择状态: ${imageId}`)
  if (selectedImageIds.value.has(imageId)) {
    selectedImageIds.value.delete(imageId)
    console.log(`❌ 取消选择图片: ${imageId}`)
  } else {
    selectedImageIds.value.add(imageId)
    console.log(`✅ 选择图片: ${imageId}`)
  }
  console.log(`📋 当前选中图片数量: ${selectedImageIds.value.size}`)
}

const selectAllImages = () => {
  if (!modelData.value?.allImages) return
  selectedImageIds.value.clear()
  modelData.value.allImages.forEach(image => {
    selectedImageIds.value.add(image.id)
  })
}

const clearImageSelection = () => {
  selectedImageIds.value.clear()
}

const openSaveDialog = () => {
  console.log(`🔍 检查保存条件...`)
  console.log(`📋 选中图片数量: ${selectedImageIds.value.size}`)
  console.log(`📊 模型数据存在: ${!!modelData.value}`)
  console.log(`🖼️ 选中的图片:`, Array.from(selectedImageIds.value))
  
  if (!modelData.value) {
    message.warning('模型数据不存在，请重新获取模型信息')
    return
  }
  
  // 如果没有图片，默认选择"完整模型"保存方式
  if (selectedImageIds.value.size === 0) {
    console.log('⚠️ 没有选中图片，将默认使用完整模型保存方式')
    saveOption.value = 'complete'
  }
  
  console.log(`✅ 打开保存对话框`)
  showSaveDialog.value = true
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



const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    message.success(`已复制: ${text}`)
  } catch (err) {
    message.error('复制失败')
  }
}

const copyImageToClipboard = async () => {
  const imageUrl = currentSelectedImage.value?.url || primaryImage.value
  if (!imageUrl) return
  
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ])
    message.success('图片已复制到剪贴板')
  } catch (err) {
    // 如果复制图片失败，尝试复制图片链接
    try {
      await navigator.clipboard.writeText(imageUrl)
      message.success('图片链接已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }
}

// 执行保存操作
const executeSave = async () => {
  console.log('🚀 开始执行保存操作...')
  console.log(`📊 模型数据存在: ${!!modelData.value}`)
  console.log(`🖼️ 选中图片数量: ${selectedImages.value.length}`)
  console.log(`💾 保存选项: ${saveOption.value}`)
  
  if (!modelData.value) {
    console.error('❌ 模型数据不存在')
    message.error('模型数据不存在，请重新获取模型信息')
    return
  }
  
  // 对于"仅保存提示词"和"分别保存"模式，需要有图片参数
  if ((saveOption.value === 'prompts-only' || saveOption.value === 'separate') && selectedImages.value.length === 0) {
    console.error('❌ 该保存模式需要选中图片')
    message.error('该保存模式需要选中图片')
    return
  }
  
  saving.value = true
  
  try {
    if (saveOption.value === 'complete') {
      await saveCompleteModel()
    } else if (saveOption.value === 'prompts-only') {
      await savePromptsOnly()
    } else if (saveOption.value === 'separate') {
      await saveSeparatePrompts()
    }
    
    showSaveDialog.value = false
     selectedImageIds.value.clear()
     // 清除当前数据，避免下次使用时显示旧数据
     modelData.value = null
     inputUrl.value = ''
     expanded.value = false
     message.success('保存成功！')
     window.postMessage({ type: 'CIVITAI_PROMPT_SAVED' }, '*')
  } catch (error: any) {
    console.error('保存失败:', error)
    message.error(error.data?.statusMessage || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 保存完整模型信息
 const saveCompleteModel = async () => {
   if (!modelData.value) return
   
   console.log('💾 保存完整模型信息...')
   console.log(`📊 模型数据:`, modelData.value.name)
   console.log(`🖼️ 选中图片数量: ${selectedImages.value.length}`)
   
   const content = buildCompletePromptContent(modelData.value, selectedImages.value)
   const tags = ['Civitai', ...modelData.value.tags.slice(0, 8)]
   const imageUrls = selectedImages.value.map(img => img.url)
   
   console.log(`📝 内容长度: ${content.length}`)
   console.log(`🏷️ 标签: ${JSON.stringify(tags)}`)
   console.log(`🖼️ 图片URLs: ${JSON.stringify(imageUrls)}`)
   
   await $fetch('/api/prompts', {
     method: 'POST',
     body: {
       title: modelData.value.name,
       content: content,
       imagePath: imageUrls[0] || null, // 向后兼容
       images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null, // 多图片字段，转为JSON字符串
       tags: JSON.stringify(tags) // 确保标签是JSON字符串
     }
   })
   
   console.log('✅ 完整模型信息保存成功')
 }

// 仅保存提示词集合
 const savePromptsOnly = async () => {
   if (!modelData.value) return
   
   const validImages = selectedImages.value.filter(img => img.params?.prompt)
   if (validImages.length === 0) {
     throw new Error('没有找到有效的提示词')
   }
   
   let content = `# ${modelData.value.name} - 提示词集合\n\n`
   
   validImages.forEach((image, index) => {
     if (image.params?.prompt) {
       content += `## 提示词 ${index + 1}\n\n`
       content += `\`\`\`\n${image.params.prompt}\`\`\`\n\n`
       
       if (image.params.negativePrompt) {
         content += `**负向提示词:**\n\`\`\`\n${image.params.negativePrompt}\`\`\`\n\n`
       }
       
       content += `**参数:** 步数: ${image.params.steps || 'N/A'}, CFG: ${image.params.cfgScale || 'N/A'}, 采样器: ${image.params.sampler || 'N/A'}\n\n`
       content += `---\n\n`
     }
   })
   
   const tags = ['Civitai', 'Prompts', ...modelData.value.tags.slice(0, 6)]
   const imageUrls = validImages.map(img => img.url)
   
   await $fetch('/api/prompts', {
     method: 'POST',
     body: {
       title: `${modelData.value.name} - 提示词集合`,
       content: content,
       imagePath: imageUrls[0] || null, // 向后兼容
       images: imageUrls.length > 0 ? imageUrls : null, // 多图片字段
       tags: tags
     }
   })
 }

// 分别保存每张图片
const saveSeparatePrompts = async () => {
  if (!modelData.value) return
  
  const validImages = selectedImages.value.filter(img => img.params?.prompt)
  if (validImages.length === 0) {
    throw new Error('没有找到有效的提示词')
  }
  
  for (let i = 0; i < validImages.length; i++) {
    const image = validImages[i]
    if (!image.params?.prompt) continue
    
    let content = `# ${modelData.value.name} - 图片 ${i + 1}\n\n`
    content += `**正向提示词:**\n\`\`\`\n${image.params.prompt}\`\`\`\n\n`
    
    if (image.params.negativePrompt) {
      content += `**负向提示词:**\n\`\`\`\n${image.params.negativePrompt}\`\`\`\n\n`
    }
    
    content += `**技术参数:**\n`
    if (image.params.steps) content += `- 步数: ${image.params.steps}\n`
    if (image.params.cfgScale) content += `- CFG Scale: ${image.params.cfgScale}\n`
    if (image.params.sampler) content += `- 采样器: ${image.params.sampler}\n`
    if (image.params.seed) content += `- 种子: ${image.params.seed}\n`
    content += `- 图片尺寸: ${image.params.size}\n\n`
    
    const tags = ['Civitai', 'Prompt', ...modelData.value.tags.slice(0, 6)]
    
    await $fetch('/api/prompts', {
      method: 'POST',
      body: {
        title: `${modelData.value.name} - 图片 ${i + 1}`,
        content: content,
        imagePath: image.url,
        tags: tags
      }
    })
  }
}

// 复制当前图片的参数
 const copyCurrentParams = async () => {
   if (!currentImageParams.value) return
   
   const params = currentImageParams.value
   let paramText = ''
   
   if (params.prompt) {
     paramText += `正向提示词: ${params.prompt}\n\n`
   }
   
   if (params.negativePrompt) {
     paramText += `负向提示词: ${params.negativePrompt}\n\n`
   }
   
   paramText += '技术参数:\n'
   if (params.steps) paramText += `步数: ${params.steps}\n`
   if (params.cfgScale) paramText += `CFG Scale: ${params.cfgScale}\n`
   if (params.sampler) paramText += `采样器: ${params.sampler}\n`
   if (params.seed) paramText += `种子: ${params.seed}\n`
   paramText += `尺寸: ${params.size}\n`
   
   try {
     await navigator.clipboard.writeText(paramText)
     message.success('当前图片参数已复制到剪贴板')
   } catch {
     message.error('复制失败')
   }
 }

// 构建完整的Prompt内容
const buildCompletePromptContent = (model: CivitaiModelWithImages, images: CivitaiImageWithParams[]): string => {
  let content = ''
  
  // 添加模型基本信息作为 Markdown 头部
  content += `# ${model.name}\n\n`
  content += `> **类型:** ${model.type} | **创建者:** ${model.creator.username} | **评分:** ${model.stats.rating.toFixed(1)} ⭐ (${formatNumber(model.stats.downloadCount)} 下载)\n\n`
  
  // 添加最新版本信息
  if (model.modelVersions.length > 0) {
    const version = model.modelVersions[0]
    content += `**版本信息:**\n`
    content += `- 版本名称: ${version.name}\n`
    content += `- 基础模型: ${version.baseModel}\n\n`
  }
  
  // 添加训练词汇
  const words = getTrainedWords(model)
  if (words.length > 0) {
    content += `**训练词汇:** \`${words.join('`, `')}\`\n\n`
  }
  
  // 添加选中图片信息
  if (images.length > 0) {
    content += `## 图片信息 (${images.length} 张)\n\n`
    
    // 有参数的图片
    const validImages = images.filter(img => img.params?.prompt)
    if (validImages.length > 0) {
      content += `### 生成参数 (${validImages.length} 张有参数图片)\n\n`
      
      validImages.forEach((image, index) => {
        content += `#### 图片 ${index + 1}\n\n`
        content += `**正向提示词:**\n\`\`\`\n${image.params.prompt}\n\`\`\`\n\n`
        
        if (image.params.negativePrompt) {
          content += `**负向提示词:**\n\`\`\`\n${image.params.negativePrompt}\n\`\`\`\n\n`
        }
        
        content += `**技术参数:**\n`
        if (image.params.steps) content += `- 步数: ${image.params.steps}\n`
        if (image.params.cfgScale) content += `- CFG Scale: ${image.params.cfgScale}\n`
        if (image.params.sampler) content += `- 采样器: ${image.params.sampler}\n`
        if (image.params.seed) content += `- 种子: ${image.params.seed}\n`
        content += `- 图片尺寸: ${image.params.size}\n\n`
        content += `---\n\n`
      })
    }
    
    // 没有参数的图片
    const imagesWithoutParams = images.filter(img => !img.params?.prompt)
    if (imagesWithoutParams.length > 0) {
      content += `### 其他图片 (${imagesWithoutParams.length} 张)\n\n`
      imagesWithoutParams.forEach((image, index) => {
        content += `- 图片 ${index + 1}: ${image.width}x${image.height}\n`
      })
      content += `\n`
    }
  } else {
    content += `## 图片信息\n\n`
    content += `暂无图片信息\n\n`
  }
  
  // 保存原始的 Markdown 描述内容
  if (model.description) {
    content += `## 模型描述\n\n`
    content += model.description // 保持原始 Markdown 格式
    content += `\n\n`
  }
  
  // 添加原始链接
  content += `---\n\n`
  content += `**原始链接:** [${model.name} - Civitai](${inputUrl.value})\n`
  
  return content
}

// 生命周期
onMounted(() => {
  // 清除旧的模型数据，确保每次打开都是干净的状态
  modelData.value = null
  inputUrl.value = ''
  selectedImageIds.value.clear()
  selectedImageIndex.value = 0
  error.value = null
  
  // 恢复位置、大小和状态
  const savedPosition = localStorage.getItem('civitai-lora-position')
  if (savedPosition) {
    try {
      position.value = JSON.parse(savedPosition)
    } catch {
      // 忽略解析错误
    }
  }
  
  const savedSize = localStorage.getItem('civitai-lora-size')
  if (savedSize) {
    try {
      windowSize.value = JSON.parse(savedSize)
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
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
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
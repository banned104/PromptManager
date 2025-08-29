<template>
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Prompt 管理器</h1>
      
      <!-- 工具栏 -->
      <div class="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm border">
        <div class="flex gap-2">
          <n-button
            :type="sortOrder === 'desc' ? 'primary' : 'default'"
            @click="toggleSortOrder"
            size="small"
          >
            <template #icon>
              <n-icon :component="sortOrder === 'desc' ? TimeIcon : TimeReverseIcon" />
            </template>
            {{ sortOrder === 'desc' ? '最新优先' : '最旧优先' }}
          </n-button>
          
          <n-button
            :type="showFavoritesOnly ? 'warning' : 'default'"
            @click="toggleFavoritesFilter"
            size="small"
          >
            <template #icon>
              <n-icon :component="StarIcon" />
            </template>
            {{ showFavoritesOnly ? '显示全部' : '筛选收藏' }}
          </n-button>
          
          <!-- 导入导出按钮组 -->
          <div class="flex items-center gap-1 ml-2">
            <n-button
              @click="handleImport"
              size="small"
              type="tertiary"
              :loading="importLoading"
            >
              <template #icon>
                <n-icon :component="ImportIcon" />
              </template>
              导入
            </n-button>
            <span class="text-gray-400 text-sm">/</span>
            <n-button
              @click="handleExport"
              size="small"
              type="tertiary"
              :loading="exportLoading"
            >
              <template #icon>
                <n-icon :component="ExportIcon" />
              </template>
              导出
            </n-button>
          </div>
        </div>
        
        <div class="text-sm text-gray-500">
          共 {{ totalCount }} 个 Prompt
        </div>
      </div>
      
      <!-- 搜索栏 -->
      <div class="flex gap-4 mb-4">
        <n-input
          v-model:value="searchQuery"
          placeholder="搜索 Prompts..."
          clearable
          @input="handleSearch"
          class="flex-1"
        >
          <template #prefix>
            <n-icon :component="SearchIcon" />
          </template>
        </n-input>
        
        <n-button type="primary" @click="navigateTo('/create')">
          <template #icon>
            <n-icon :component="AddIcon" />
          </template>
          新建 Prompt
        </n-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="pending" class="flex justify-center py-8">
      <n-spin size="large" />
    </div>

    <!-- Prompt 列表 -->
    <div v-else-if="displayPrompts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PromptCard
        v-for="prompt in displayPrompts"
        :key="prompt.id"
        :prompt="prompt"
        @edit="handleEdit"
        @delete="handleDelete"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <n-empty description="暂无 Prompts">
        <template #extra>
          <n-button type="primary" @click="navigateTo('/create')">
            创建第一个 Prompt
          </n-button>
        </template>
      </n-empty>
    </div>

    <!-- 返回顶部按钮 -->
    <transition name="fade">
      <div 
        v-show="showBackToTop" 
        class="fixed bottom-6 right-6 z-50"
      >
        <n-button
          circle
          size="large"
          type="primary"
          @click="scrollToTop"
          class="shadow-lg"
        >
          <template #icon>
            <n-icon><ChevronUpIcon /></n-icon>
          </template>
        </n-button>
      </div>
    </transition>
    
    <!-- 格式选择对话框 -->
    <n-modal 
      v-model:show="showFormatModal" 
      preset="dialog" 
      title="选择导出格式"
      positive-text="确认导出"
      negative-text="取消"
      @positive-click="confirmFormatSelection"
      @negative-click="cancelFormatSelection"
    >
      <n-space vertical size="large">
        <div class="text-gray-600">
          请选择要导出的文件格式：
        </div>
        
        <n-radio-group v-model:value="selectedFormat" name="format">
          <n-space vertical>
            <n-radio value="json">
              <div class="flex flex-col">
                <span class="font-medium">JSON 格式</span>
                <span class="text-sm text-gray-500">结构化数据，便于程序处理和再次导入</span>
              </div>
            </n-radio>
            <n-radio value="markdown">
              <div class="flex flex-col">
                <span class="font-medium">Markdown 格式</span>
                <span class="text-sm text-gray-500">文档格式，便于阅读和分享</span>
              </div>
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-space>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NInput, NButton, NIcon, NSpin, NEmpty, NModal, NCard, NRadioGroup, NRadio, NSpace, useMessage } from 'naive-ui'
import { SearchOutline as SearchIcon, Add as AddIcon, Time as TimeIcon, TimeOutline as TimeReverseIcon, Star as StarIcon, ChevronUp as ChevronUpIcon, CloudDownload as ImportIcon, CloudUpload as ExportIcon, Close as CloseIcon } from '@vicons/ionicons5'

// 类型定义
interface Prompt {
  id: number
  title: string
  content: string
  imagePath?: string
  tags?: string
  isFavorited: boolean
  createdAt: string
  updatedAt: string
}

// 响应式数据
const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('desc') // 默认最新优先
const showFavoritesOnly = ref(false) // 是否只显示收藏
const showBackToTop = ref(false) // 是否显示返回顶部按钮
const importLoading = ref(false) // 导入加载状态
const exportLoading = ref(false) // 导出加载状态
const showFormatModal = ref(false) // 显示格式选择对话框
const selectedFormat = ref<'json' | 'markdown'>('json') // 选中的格式
const message = useMessage()

// 格式选择对话框的Promise resolver
let formatDialogResolver: ((value: string | null) => void) | null = null

// 获取数据
const { data: promptsData, pending, refresh } = await useFetch<{success: boolean, data: Prompt[]}>('/api/prompts')

// 计算属性
const displayPrompts = computed(() => {
  if (!promptsData.value?.data) return []
  
  let filteredPrompts = promptsData.value.data
  
  // 收藏过滤
  if (showFavoritesOnly.value) {
    filteredPrompts = filteredPrompts.filter(prompt => prompt.isFavorited)
  }
  
  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filteredPrompts = filteredPrompts.filter(prompt => 
      prompt.title.toLowerCase().includes(query) ||
      prompt.content.toLowerCase().includes(query) ||
      (prompt.tags && prompt.tags.toLowerCase().includes(query))
    )
  }
  
  // 时间排序
  return [...filteredPrompts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
})

const totalCount = computed(() => {
  if (showFavoritesOnly.value) {
    return promptsData.value?.data?.filter(prompt => prompt.isFavorited).length || 0
  }
  return promptsData.value?.data?.length || 0
})

// 方法
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const toggleFavoritesFilter = () => {
  showFavoritesOnly.value = !showFavoritesOnly.value
}

const handleToggleFavorite = async (prompt: Prompt) => {
  try {
    const response = await $fetch<{success: boolean, data: Prompt, message: string}>(`/api/prompts/${prompt.id}/favorite`, {
      method: 'POST'
    })
    
    if (response.success) {
      message.success(response.message)
      // 更新本地数据
      if (promptsData.value?.data) {
        const index = promptsData.value.data.findIndex(p => p.id === prompt.id)
        if (index !== -1) {
          promptsData.value.data[index].isFavorited = response.data.isFavorited
        }
      }
    }
  } catch (error) {
    message.error('操作失败，请重试')
    console.error('切换收藏状态失败:', error)
  }
}

// 返回顶部相关方法
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleEdit = (prompt: Prompt) => {
  navigateTo(`/edit/${prompt.id}`)
}

const handleDelete = async (prompt: Prompt) => {
  try {
    await $fetch(`/api/prompts/${prompt.id}`, {
      method: 'DELETE'
    })
    message.success('删除成功')
    refresh()
  } catch (error) {
    message.error('删除失败')
  }
}

// 导入导出相关方法
const handleImport = () => {
  // 创建文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.md,.markdown'
  input.style.display = 'none'
  
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    // 验证文件类型
    const allowedExtensions = ['.json', '.md', '.markdown']
    const fileName = file.name.toLowerCase()
    const isValidFile = allowedExtensions.some(ext => fileName.endsWith(ext))
    
    if (!isValidFile) {
      message.error('请选择 JSON 或 Markdown 格式的文件')
      return
    }
    
    importLoading.value = true
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('skipDuplicates', 'true')
      formData.append('updateExisting', 'false')
      
      const response = await $fetch<{
        success: boolean
        message: string
        data?: {
          imported: number
          skipped: number
          updated: number
          total: number
        }
        errors?: string[]
        warnings?: string[]
      }>('/api/import', {
        method: 'POST',
        body: formData
      })
      
      if (response.success) {
        message.success(response.message)
        if (response.warnings && response.warnings.length > 0) {
          response.warnings.forEach(warning => {
            message.warning(warning)
          })
        }
        // 刷新数据
        refresh()
      } else {
        message.error(response.message)
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach(error => {
            message.error(error)
          })
        }
      }
    } catch (error: any) {
      console.error('导入失败:', error)
      message.error(error.data?.message || '导入失败，请重试')
    } finally {
      importLoading.value = false
      // 清理文件输入
      document.body.removeChild(input)
    }
  }
  
  // 添加到DOM并触发点击
  document.body.appendChild(input)
  input.click()
}

const handleExport = async () => {
  if (!promptsData.value?.data || promptsData.value.data.length === 0) {
    message.warning('没有可导出的数据')
    return
  }
  
  // 显示格式选择对话框
  const format = await showFormatDialog()
  if (!format) return
  
  exportLoading.value = true
  
  try {
    const params = new URLSearchParams({
      format,
      includeImages: 'true',
      pretty: 'true'
    })
    
    const response = await fetch(`/api/export?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('导出失败')
    }
    
    // 获取文件名
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = `prompts-export-${new Date().toISOString().split('T')[0]}.${format}`
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }
    
    // 下载文件
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    message.success(`成功导出 ${promptsData.value.data.length} 个 Prompt`)
  } catch (error: any) {
    console.error('导出失败:', error)
    message.error('导出失败，请重试')
  } finally {
    exportLoading.value = false
  }
}

// 显示格式选择对话框
const showFormatDialog = (): Promise<string | null> => {
  return new Promise((resolve) => {
    formatDialogResolver = resolve
    selectedFormat.value = 'json'
    showFormatModal.value = true
  })
}

// 确认格式选择
const confirmFormatSelection = () => {
  showFormatModal.value = false
  if (formatDialogResolver) {
    formatDialogResolver(selectedFormat.value)
    formatDialogResolver = null
  }
}

// 取消格式选择
const cancelFormatSelection = () => {
  showFormatModal.value = false
  if (formatDialogResolver) {
    formatDialogResolver(null)
    formatDialogResolver = null
  }
}

// 页面元数据
useHead({
  title: 'Prompt 管理器'
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
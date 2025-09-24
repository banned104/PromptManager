<template>
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Prompt 管理器</h1>
      
      <!-- Tab 标签页 -->
      <div class="mb-4">
        <n-tabs v-model:value="activeTab" type="line" @update:value="handleTabChange">
          <n-tab-pane name="manual" tab="手动创建">
            <template #tab>
              <div class="flex items-center space-x-2">
                <n-icon :component="AddIcon" />
                <span>手动创建 ({{ manualPrompts.length }})</span>
              </div>
            </template>
          </n-tab-pane>
          <n-tab-pane name="civitai" tab="Civitai 获取">
            <template #tab>
              <div class="flex items-center space-x-2">
                <n-icon :component="CloudDownloadIcon" />
                <span>Civitai 获取 ({{ civitaiPrompts.length }})</span>
              </div>
            </template>
          </n-tab-pane>
        </n-tabs>
      </div>
      
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

          <!-- 标签筛选按钮 -->
          <n-button
            :type="selectedTags.length > 0 ? 'info' : 'default'"
            @click="toggleTagFilter"
            size="small"
          >
            <template #icon>
              <n-icon :component="TagIcon" />
            </template>
            {{ selectedTags.length > 0 ? `标签 (${selectedTags.length})` : '标签筛选' }}
          </n-button>
          
          <!-- Civitai LORA 按钮 -->
          <n-button
            :type="showCivitaiLora ? 'primary' : 'default'"
            @click="toggleCivitaiLora"
            size="small"
          >
            <template #icon>
              <n-icon :component="CloudDownloadIcon" />
            </template>
            Civitai LORA
          </n-button>
          
          <!-- 数据库刷新按钮 -->
          <n-button
            @click="handleDatabaseRefresh"
            size="small"
            type="tertiary"
            :loading="refreshLoading"
            title="重新读取数据库"
          >
            <template #icon>
              <n-icon :component="RefreshIcon" />
            </template>
            刷新
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
          
          <!-- 数据库管理按钮 -->
          <n-button
            @click="navigateTo('/admin')"
            size="small"
            type="tertiary"
            title="数据库管理"
          >
            <template #icon>
              <n-icon :component="DatabaseIcon" />
            </template>
            数据库
          </n-button>
        </div>
        
        <div class="text-sm text-gray-500">
          共 {{ filteredPrompts.length }} 个 Prompt
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
    <div v-if="loading && allPrompts.length === 0" class="flex justify-center py-8">
      <n-spin size="large" />
    </div>

    <!-- Prompt 列表 -->
    <div v-else-if="filteredPrompts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PromptCard
        v-for="prompt in filteredPrompts"
        :key="prompt.id"
        :prompt="prompt"
        @edit="handleEdit"
        @delete="handleDelete"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredPrompts.length === 0 && !loading" class="text-center py-12">
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
                 <span class="text-sm text-gray-500">文档格式，便于阅读和分享（仅文本）</span>
               </div>
             </n-radio>
             <n-radio value="markdown-zip">
               <div class="flex flex-col">
                 <span class="font-medium">Markdown ZIP 格式</span>
                 <span class="text-sm text-gray-500">包含Markdown文档和相关图片的压缩包</span>
               </div>
             </n-radio>
           </n-space>
         </n-radio-group>
      </n-space>
    </n-modal>

    <!-- 标签筛选浮窗 -->
    <TagFilter
      v-model:visible="showTagFilter"
      @filter-change="handleTagFilterChange"
    />
    
    <!-- Civitai LORA 浮窗 -->
    <CivitaiLora v-model:visible="showCivitaiLora" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { NInput, NButton, NIcon, NSpin, NEmpty, NModal, NCard, NRadioGroup, NRadio, NSpace, NTabs, NTabPane, useMessage } from 'naive-ui'
import { SearchOutline as SearchIcon, Add as AddIcon, Time as TimeIcon, TimeOutline as TimeReverseIcon, Star as StarIcon, ChevronUp as ChevronUpIcon, CloudDownload as ImportIcon, CloudUpload as ExportIcon, Close as CloseIcon, PricetagOutline as TagIcon, CloudDownload as CloudDownloadIcon, Refresh as RefreshIcon, Server as DatabaseIcon } from '@vicons/ionicons5'
import { useCache } from '~/composables/useCache'
import CivitaiLora from '~/components/CivitaiLora.vue'

// 类型定义
interface Prompt {
  id: number
  title: string
  content: string
  imagePath?: string
  images?: string  // 新增：多图片字段（JSON格式）
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
const refreshLoading = ref(false) // 刷新加载状态
const showFormatModal = ref(false) // 显示格式选择对话框
const selectedFormat = ref<'json' | 'markdown' | 'markdown-zip'>('json') // 选中的格式
const showTagFilter = ref(false) // 是否显示标签筛选浮窗
const selectedTags = ref<string[]>([]) // 选中的标签
const showCivitaiLora = ref(false) // 是否显示Civitai LORA浮窗
const activeTab = ref<'manual' | 'civitai'>('manual') // 当前激活的标签页
const message = useMessage()
const { cachedFetch, invalidateCache } = useCache()

// 数据相关
const allPrompts = ref<Prompt[]>([])
const loading = ref(false)

// 格式选择对话框的Promise resolver
let formatDialogResolver: ((value: string | null) => void) | null = null

// 防抖搜索
const debouncedSearch = ref('')
let searchTimeout: NodeJS.Timeout | null = null

// 计算属性 - 按标签分类
const manualPrompts = computed(() => {
  return allPrompts.value.filter(prompt => {
    if (!prompt.tags) return true
    
    let promptTags: string[] = []
    try {
      promptTags = typeof prompt.tags === 'string' 
        ? JSON.parse(prompt.tags) 
        : prompt.tags
    } catch {
      promptTags = typeof prompt.tags === 'string' 
        ? prompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []
    }
    
    // 不包含Civitai标签的为手动创建
    return !promptTags.some(tag => tag.toLowerCase() === 'civitai')
  })
})

const civitaiPrompts = computed(() => {
  return allPrompts.value.filter(prompt => {
    if (!prompt.tags) return false
    
    let promptTags: string[] = []
    try {
      promptTags = typeof prompt.tags === 'string' 
        ? JSON.parse(prompt.tags) 
        : prompt.tags
    } catch {
      promptTags = typeof prompt.tags === 'string' 
        ? prompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []
    }
    
    // 包含Civitai标签的为Civitai获取
    return promptTags.some(tag => tag.toLowerCase() === 'civitai')
  })
})

// 计算属性 - 客户端筛选
const filteredPrompts = computed(() => {
  // 根据当前标签页选择数据源
  let prompts = activeTab.value === 'manual' ? manualPrompts.value : civitaiPrompts.value
  
  // 搜索筛选
  if (debouncedSearch.value) {
    const searchLower = debouncedSearch.value.toLowerCase()
    prompts = prompts.filter(prompt => 
      prompt.title.toLowerCase().includes(searchLower) ||
      prompt.content.toLowerCase().includes(searchLower) ||
      (prompt.tags && (
        (typeof prompt.tags === 'string' ? prompt.tags : JSON.stringify(prompt.tags))
          .toLowerCase().includes(searchLower)
      ))
    )
  }
  
  // 收藏筛选
  if (showFavoritesOnly.value) {
    prompts = prompts.filter(prompt => prompt.isFavorited)
  }
  
  // 标签筛选
  if (selectedTags.value.length > 0) {
    prompts = prompts.filter(prompt => {
      if (!prompt.tags) return false
      
      let promptTags: string[] = []
      try {
        promptTags = typeof prompt.tags === 'string' 
          ? JSON.parse(prompt.tags) 
          : prompt.tags
      } catch {
        promptTags = typeof prompt.tags === 'string' 
          ? prompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : []
      }
      
      // 检查是否包含所有选中的标签
      return selectedTags.value.every(tag => 
        promptTags.some(promptTag => promptTag.toLowerCase() === tag.toLowerCase())
      )
    })
  }
  
  return prompts
})

// 获取数据
const fetchPrompts = async (forceRefresh = false) => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const params = {
      search: debouncedSearch.value,
      favorites: showFavoritesOnly.value.toString(),
      sort: sortOrder.value
    }
    
    console.log(`🔄 获取Prompts数据 (强制刷新: ${forceRefresh})...`)
    
    const response = await cachedFetch<{
       success: boolean
       data: Prompt[]
     }>('/api/prompts', { 
       params, 
       ttl: 5 * 60 * 1000,
       force: forceRefresh 
     })
    
    if (response.success) {
      allPrompts.value = response.data
      console.log(`✅ 获取到 ${response.data.length} 条记录`)
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    message.error('获取数据失败，请重试')
  } finally {
    loading.value = false
  }
}

// 重置并重新加载数据
const resetAndFetch = async () => {
  await fetchPrompts()
}

// 方法
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = searchQuery.value
    resetAndFetch()
  }, 300)
}

const toggleSortOrder = async () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  await resetAndFetch()
}

const toggleFavoritesFilter = async () => {
  showFavoritesOnly.value = !showFavoritesOnly.value
  await resetAndFetch()
}

// 标签筛选相关方法
const toggleTagFilter = () => {
  showTagFilter.value = !showTagFilter.value
}

const handleTagFilterChange = async (tags: string[]) => {
  selectedTags.value = tags
  await resetAndFetch()
}

// Tab切换处理
const handleTabChange = (value: 'manual' | 'civitai') => {
  activeTab.value = value
}

// Civitai LORA按钮处理
const toggleCivitaiLora = () => {
  showCivitaiLora.value = !showCivitaiLora.value
}

// 处理Civitai保存事件
const handleCivitaiSaved = () => {
  // 清除缓存并重新获取数据
  invalidateCache('prompts')
  fetchPrompts()
  // 切换到Civitai标签页显示新保存的内容
  activeTab.value = 'civitai'
}

const handleToggleFavorite = async (prompt: Prompt) => {
  // 乐观更新：立即更新本地状态
  const index = allPrompts.value.findIndex(p => p.id === prompt.id)
  if (index === -1) return
  
  const originalState = allPrompts.value[index].isFavorited
  allPrompts.value[index].isFavorited = !originalState
  
  try {
    const response = await $fetch<{success: boolean, data: Prompt, message: string}>(`/api/prompts/${prompt.id}/favorite`, {
      method: 'POST'
    })
    
    if (response.success) {
      message.success(response.message)
      // 确保状态与服务器返回的一致
      allPrompts.value[index].isFavorited = response.data.isFavorited
      // 清除相关缓存
      invalidateCache('prompts')
    } else {
      // 请求成功但操作失败，恢复原始状态
      allPrompts.value[index].isFavorited = originalState
    }
  } catch (error) {
    // 请求失败，恢复原始状态
    allPrompts.value[index].isFavorited = originalState
    message.error('操作失败，请重试')
    console.error('切换收藏状态失败:', error)
  }
}

// 监听滚动事件，显示返回顶部按钮
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  showBackToTop.value = scrollTop > 300
}

// 返回顶部相关方法
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 生命周期
onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  // 添加消息监听器
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'CIVITAI_PROMPT_SAVED') {
      handleCivitaiSaved()
    }
  })
  
  // 检查是否需要强制刷新
  const route = useRoute()
  const shouldRefresh = route.query.refresh === 'true'
  
  if (shouldRefresh) {
    // 清除缓存并强制刷新数据
    invalidateCache('prompts')
    await fetchPrompts()
    // 数据加载完成后再清除URL参数
    await nextTick()
    await navigateTo('/', { replace: true })
  } else {
    await fetchPrompts()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 移除消息监听器
  window.removeEventListener('message', (event) => {
    if (event.data?.type === 'CIVITAI_PROMPT_SAVED') {
      handleCivitaiSaved()
    }
  })
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

const handleEdit = (prompt: Prompt) => {
  navigateTo(`/edit/${prompt.id}`)
}

const handleDelete = async (prompt: Prompt) => {
  // 乐观更新：立即从本地状态中移除
  const originalPrompts = [...allPrompts.value]
  allPrompts.value = allPrompts.value.filter(p => p.id !== prompt.id)
  
  try {
    await $fetch(`/api/prompts/${prompt.id}`, {
      method: 'DELETE'
    })
    message.success('删除成功')
    invalidateCache('prompts')
    // 删除成功后重新读取数据库以确保数据同步
    await fetchPrompts()
  } catch (error) {
    // 删除失败，恢复原始状态
    allPrompts.value = originalPrompts
    message.error('删除失败')
  }
}

// 导入导出相关方法
const handleImport = () => {
  // 创建文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.md,.markdown,.zip'
  input.style.display = 'none'
  
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    // 验证文件类型
    const allowedExtensions = ['.json', '.md', '.markdown', '.zip']
    const fileName = file.name.toLowerCase()
    const isValidFile = allowedExtensions.some(ext => fileName.endsWith(ext))
    
    if (!isValidFile) {
      message.error('请选择 JSON、Markdown 或 ZIP 格式的文件')
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
        // 清除缓存并刷新数据
        invalidateCache('prompts')
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
  if (!allPrompts.value || allPrompts.value.length === 0) {
    message.warning('没有可导出的数据')
    return
  }
  
  // 显示格式选择对话框
  const format = await showFormatDialog()
  if (!format) return
  
  exportLoading.value = true
  
  try {
      const timestamp = new Date().toISOString().split('T')[0]

      if (format === 'markdown-zip') {
        // 使用后端API导出ZIP格式
        const url = `/api/export?format=markdown&zipFormat=true&includeImages=true`
        const a = document.createElement('a')
        a.href = url
        a.download = `prompts-${timestamp}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        message.success(`成功导出 ${allPrompts.value.length} 个 Prompt 的ZIP文件`)
      } else {
        // 处理其他格式
        let content: string
        let filename: string
        let mimeType: string

        switch (format) {
          case 'json':
            content = JSON.stringify(allPrompts.value, null, 2)
            filename = `prompts-${timestamp}.json`
            mimeType = 'application/json'
            break
          
          case 'markdown':
            content = allPrompts.value.map((prompt: Prompt) => {
              let md = `# ${prompt.title}\n\n`
              md += `**内容:** ${prompt.content}\n\n`
              
              // 解析标签（支持字符串和数组格式）
              let tags: string[] = []
              if (prompt.tags) {
                try {
                  // 尝试解析JSON格式的标签
                  const parsedTags = JSON.parse(prompt.tags)
                  tags = Array.isArray(parsedTags) ? parsedTags : [prompt.tags]
                } catch {
                  // 如果不是JSON，按字符串处理
                  tags = typeof prompt.tags === 'string' ? prompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
                }
              }
              
              if (tags.length > 0) {
                md += `**标签:** ${tags.join(', ')}\n\n`
              }
              if (prompt.imagePath) {
                md += `**图片:** ${prompt.imagePath}\n\n`
              }
              md += `**创建时间:** ${new Date(prompt.createdAt).toLocaleString()}\n\n`
              md += '---\n\n'
              return md
            }).join('')
            filename = `prompts-${timestamp}.md`
            mimeType = 'text/markdown'
            break
          
          default:
            throw new Error('不支持的导出格式')
        }

        // 创建并下载文件
        const blob = new Blob([content], { type: mimeType })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
      
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



// 刷新数据函数
const refresh = async () => {
  invalidateCache('prompts')
  await resetAndFetch()
}

// 数据库刷新功能
const handleDatabaseRefresh = async () => {
  refreshLoading.value = true
  try {
    console.log('🔄 开始数据库刷新...')
    
    // 调用数据库刷新API
    const timestamp = Date.now()
    const response = await $fetch<{ success: boolean; message: string }>(`/api/database/refresh?_t=${timestamp}`, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (response.success) {
      message.success(response.message)
      console.log('✅ 数据库刷新成功')
      
      // 清除所有缓存并强制重新获取数据
      invalidateCache() // 清除所有缓存
      await fetchPrompts(true) // 强制刷新
    }
  } catch (error) {
    console.error('数据库刷新失败:', error)
    message.error('数据库刷新失败，请重试')
  } finally {
    refreshLoading.value = false
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
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NButton, NIcon, NSpin, NEmpty, useMessage } from 'naive-ui'
import { SearchOutline as SearchIcon, Add as AddIcon, Time as TimeIcon, TimeOutline as TimeReverseIcon, Star as StarIcon } from '@vicons/ionicons5'

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
const message = useMessage()

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

// 页面元数据
useHead({
  title: 'Prompt 管理器'
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
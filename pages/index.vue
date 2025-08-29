<template>
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Prompt 管理器</h1>
      
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
import { SearchOutline as SearchIcon, Add as AddIcon } from '@vicons/ionicons5'

// 类型定义
interface Prompt {
  id: number
  title: string
  content: string
  imagePath?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

// 响应式数据
const searchQuery = ref('')
const message = useMessage()

// 获取数据
const { data: promptsData, pending, refresh } = await useFetch<{success: boolean, data: Prompt[]}>('/api/prompts')

// 计算属性
const displayPrompts = computed(() => {
  if (!promptsData.value?.data) return []
  
  if (!searchQuery.value.trim()) {
    return promptsData.value.data
  }
  
  const query = searchQuery.value.toLowerCase()
  return promptsData.value.data.filter(prompt => 
    prompt.title.toLowerCase().includes(query) ||
    prompt.content.toLowerCase().includes(query) ||
    (prompt.tags && prompt.tags.toLowerCase().includes(query))
  )
})

// 方法
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
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
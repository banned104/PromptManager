<template>
  <n-card class="prompt-card" hoverable>
    <!-- 图片展示 -->
    <div v-if="prompt.imagePath" class="mb-4">
      <img 
        :src="prompt.imagePath" 
        :alt="prompt.title"
        class="w-full h-48 object-cover rounded-lg"
        @error="handleImageError"
      />
    </div>
    
    <!-- 标题 -->
    <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
      {{ prompt.title }}
    </h3>
    
    <!-- 内容预览 -->
    <p class="text-gray-600 text-sm mb-4 line-clamp-3">
      {{ prompt.content }}
    </p>
    
    <!-- 标签 -->
    <div v-if="parsedTags.length > 0" class="mb-4">
      <n-space>
        <n-tag 
          v-for="tag in parsedTags" 
          :key="tag"
          size="small"
          type="info"
        >
          {{ tag }}
        </n-tag>
      </n-space>
    </div>
    
    <!-- 时间信息 -->
    <div class="text-xs text-gray-400 mb-4">
      创建时间: {{ formatDate(prompt.createdAt) }}
    </div>
    
    <!-- 操作按钮 -->
    <div class="flex justify-between items-center">
      <n-button-group>
        <n-button size="small" @click="viewDetail">
          <template #icon>
            <n-icon :component="EyeIcon" />
          </template>
          查看
        </n-button>
        
        <n-button size="small" @click="$emit('edit', prompt)">
          <template #icon>
            <n-icon :component="EditIcon" />
          </template>
          编辑
        </n-button>
      </n-button-group>
      
      <n-popconfirm
        @positive-click="$emit('delete', prompt)"
        negative-text="取消"
        positive-text="确认删除"
      >
        <template #trigger>
          <n-button size="small" type="error" quaternary>
            <template #icon>
              <n-icon :component="DeleteIcon" />
            </template>
          </n-button>
        </template>
        确定要删除这个 Prompt 吗？
      </n-popconfirm>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTag, NSpace, NButton, NButtonGroup, NIcon, NPopconfirm } from 'naive-ui'
import { Eye as EyeIcon, Create as EditIcon, Trash as DeleteIcon } from '@vicons/ionicons5'

// Props
interface Prompt {
  id: number
  title: string
  content: string
  imagePath?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

const props = defineProps<{
  prompt: Prompt
}>()

// Emits
defineEmits<{
  edit: [prompt: Prompt]
  delete: [prompt: Prompt]
}>()

// 计算属性
const parsedTags = computed(() => {
  if (!props.prompt.tags) return []
  try {
    return JSON.parse(props.prompt.tags)
  } catch {
    return []
  }
})

// 方法
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const viewDetail = () => {
  navigateTo(`/prompt/${props.prompt.id}`)
}
</script>

<style scoped>
.prompt-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
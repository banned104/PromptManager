<template>
  <n-card class="prompt-card" hoverable>
    <!-- 收藏按钮 -->
    <div class="absolute top-2 right-2 z-10">
      <n-button
        size="small"
        circle
        :type="prompt.isFavorited ? 'warning' : 'default'"
        :class="{
          'bg-yellow-400 text-white hover:bg-yellow-500': prompt.isFavorited,
          'bg-white/80 text-gray-600 hover:bg-yellow-100': !prompt.isFavorited
        }"
        @click="$emit('toggleFavorite', prompt)"
      >
        <template #icon>
          <n-icon 
            :component="prompt.isFavorited ? StarIcon : StarOutlineIcon" 
            :class="{
              'text-white': prompt.isFavorited,
              'text-gray-600': !prompt.isFavorited
            }"
          />
        </template>
      </n-button>
    </div>
    <!-- 图片展示 -->
    <div v-if="prompt.imagePath" class="mb-4">
      <NuxtImg 
        :src="prompt.imagePath" 
        :alt="prompt.title"
        class="w-full h-48 object-cover rounded-lg"
        loading="lazy"
        placeholder
        quality="80"
        format="webp"
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
    <div class="flex justify-between text-xs text-gray-400 mb-4">
      <span>创建: {{ formatDate(prompt.createdAt) }}</span>
      <span v-if="prompt.updatedAt !== prompt.createdAt" class="text-gray-300">
        更新: {{ formatDate(prompt.updatedAt) }}
      </span>
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
import { Eye as EyeIcon, Create as EditIcon, Trash as DeleteIcon, Star as StarIcon, StarOutline as StarOutlineIcon } from '@vicons/ionicons5'

// Props
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

const props = defineProps<{
  prompt: Prompt
}>()

// Emits
defineEmits<{
  edit: [prompt: Prompt]
  delete: [prompt: Prompt]
  toggleFavorite: [prompt: Prompt]
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
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    })
  }
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
  position: relative;
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
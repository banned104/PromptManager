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
        @click.stop="$emit('toggleFavorite', prompt)"
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

    <!-- 可点击内容区域（点击跳转到详情页） -->
    <NuxtLink :to="`/prompt/${prompt.id}`" class="card-link">
      <!-- 图片展示 -->
      <div v-if="displayImages.length > 0" class="mb-4 relative">
        <!-- 单图片显示（保持原有样式） -->
        <div v-if="displayImages.length === 1" class="relative">
          <NuxtImg 
            :src="displayImages[0]" 
            :alt="prompt.title"
            :class="[
              'w-full h-48 object-cover rounded-lg transition-all duration-300',
              { 'blur-lg': shouldBlur }
            ]"
            loading="lazy"
            placeholder
            quality="80"
            format="webp"
            @error="handleImageError"
          />
          <!-- NSFW遮罩 -->
          <div 
            v-if="shouldBlur" 
            class="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center"
          >
            <div class="text-white text-center">
              <div class="text-lg font-semibold mb-1">🔞</div>
              <div class="text-sm">NSFW内容已隐藏</div>
              <div class="text-xs opacity-75">请在设置中开启NSFW开关</div>
            </div>
          </div>
        </div>
        
        <!-- 多图片网格显示 -->
        <div v-else class="images-grid relative">
          <div 
            v-for="(image, index) in displayImages.slice(0, 4)" 
            :key="index"
            class="image-grid-item"
            :class="{
              'col-span-2': displayImages.length === 2 && index < 2,
              'main-image': index === 0 && displayImages.length > 2
            }"
          >
            <NuxtImg 
              :src="image" 
              :alt="`${prompt.title} - 图片 ${index + 1}`"
              :class="[
                'w-full h-full object-cover rounded-lg transition-all duration-300',
                { 'blur-lg': shouldBlur }
              ]"
              loading="lazy"
              placeholder
              quality="80"
              format="webp"
              @error="handleImageError"
            />
            
            <!-- 更多图片指示器 -->
            <div 
              v-if="index === 3 && displayImages.length > 4"
              class="more-images-overlay"
            >
              <span class="more-count">+{{ displayImages.length - 4 }}</span>
            </div>
          </div>
          
          <!-- 多图片NSFW遮罩 -->
          <div 
            v-if="shouldBlur" 
            class="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center z-10"
          >
            <div class="text-white text-center">
              <div class="text-lg font-semibold mb-1">🔞</div>
              <div class="text-sm">NSFW内容已隐藏</div>
              <div class="text-xs opacity-75">请在设置中开启NSFW开关</div>
            </div>
          </div>
        </div>
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
    </NuxtLink>
    
    <!-- 操作按钮 -->
    <div class="flex justify-between items-center">
      <n-button size="small" @click="$emit('edit', prompt)">
        <template #icon>
          <n-icon :component="EditIcon" />
        </template>
        编辑
      </n-button>
      
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { NCard, NTag, NSpace, NButton, NIcon, NPopconfirm } from 'naive-ui'
import { Create as EditIcon, Trash as DeleteIcon, Star as StarIcon, StarOutline as StarOutlineIcon } from '@vicons/ionicons5'

// Props
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

const props = defineProps<{
  prompt: Prompt
}>()

// Emits
defineEmits<{
  edit: [prompt: Prompt]
  delete: [prompt: Prompt]
  toggleFavorite: [prompt: Prompt]
}>()

// NSFW状态管理
const nsfwEnabled = ref(true)

// 监听localStorage变化
const updateNsfwState = () => {
  const stored = localStorage.getItem('civitai-nsfw-enabled')
  nsfwEnabled.value = stored === 'true'
}

// 监听自定义NSFW状态变化事件
const handleNsfwChange = (event: CustomEvent) => {
  nsfwEnabled.value = event.detail.enabled
}

// 计算属性
const parsedTags = computed(() => {
  if (!props.prompt.tags) return []
  
  try {
    // 尝试解析JSON格式的标签
    const tags = JSON.parse(props.prompt.tags)
    return Array.isArray(tags) ? tags : []
  } catch {
    // 如果不是JSON，按逗号分割
    return props.prompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
  }
})

// 检查是否包含NSFW标签
const hasNsfwTag = computed(() => {
  return parsedTags.value.some(tag => 
    tag.toLowerCase().includes('nsfw') || 
    tag.toLowerCase().includes('adult') ||
    tag.toLowerCase().includes('explicit')
  )
})

// 是否应该模糊显示
const shouldBlur = computed(() => {
  return hasNsfwTag.value && !nsfwEnabled.value
})

// 处理多图片显示（向后兼容）
const displayImages = computed(() => {
  const images: string[] = []
  
  // 优先使用新的 images 字段
  if (props.prompt.images) {
    try {
      const parsedImages = JSON.parse(props.prompt.images)
      if (Array.isArray(parsedImages)) {
        images.push(...parsedImages.filter(img => img))
      }
    } catch {
      // 如果解析失败，忽略
    }
  }
  
  // 向后兼容：如果没有新字段或新字段为空，使用旧的 imagePath
  if (images.length === 0 && props.prompt.imagePath) {
    images.push(props.prompt.imagePath)
  }
  
  return images
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

// 生命周期钩子
onMounted(() => {
  updateNsfwState()
  window.addEventListener('storage', updateNsfwState)
  window.addEventListener('nsfwSettingChanged', handleNsfwChange as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('storage', updateNsfwState)
  window.removeEventListener('nsfwSettingChanged', handleNsfwChange as EventListener)
})
</script>

<style scoped>
.prompt-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 卡片内容链接区域 */
.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.card-link:hover h3 {
  color: #4f46e5;
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

/* 多图片网格样式 */
.images-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  height: 192px; /* 保持与单图片相同的高度 */
  border-radius: 8px;
  overflow: hidden;
}

.image-grid-item {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

/* 两张图片时每张占一半 */
.image-grid-item.col-span-2 {
  grid-column: span 1;
}

/* 三张或更多图片时，第一张占主要位置 */
.image-grid-item.main-image {
  grid-row: span 2;
}

.more-images-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.more-count {
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
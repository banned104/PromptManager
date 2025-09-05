<template>
  <div
    v-if="visible"
    ref="tagFilterRef"
    class="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
    :style="{ top: position.y + 'px', left: position.x + 'px', minWidth: '200px' }"
  >
    <!-- 拖拽手柄 -->
    <div
      ref="dragHandleRef"
      class="cursor-move pb-2 mb-2 border-b border-gray-200 flex items-center justify-between"
      @mousedown="startDrag"
    >
      <span class="text-sm font-medium text-gray-700">标签筛选</span>
      <button
        @click="close"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 标签列表 -->
    <div class="space-y-2 max-h-64 overflow-y-auto">
      <div v-if="loading" class="text-center text-gray-500 text-sm py-4">
        加载中...
      </div>
      <div v-else-if="allTags.length === 0" class="text-center text-gray-500 text-sm py-4">
        暂无标签
      </div>
      <div
        v-else
        v-for="tag in allTags"
        :key="tag"
        class="flex items-center justify-between group"
      >
        <button
          @click="toggleTag(tag)"
          :class="[
            'px-3 py-1 text-xs rounded-full transition-all duration-200',
            selectedTags.includes(tag)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ tag }}
        </button>
        <button
          v-if="selectedTags.includes(tag)"
          @click="removeTag(tag)"
          class="ml-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 清除所有 -->
    <div v-if="selectedTags.length > 0" class="mt-3 pt-2 border-t border-gray-200">
      <button
        @click="clearAll"
        class="w-full text-xs text-red-500 hover:text-red-700 transition-colors"
      >
        清除所有筛选
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'filter-change', tags: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tagFilterRef = ref<HTMLElement>()
const dragHandleRef = ref<HTMLElement>()
const position = ref({ x: 100, y: 100 })
const selectedTags = ref<string[]>([])
const isDragging = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })
const allTags = ref<string[]>([])
const loading = ref(false)

// 获取所有标签
const fetchAllTags = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/tags')
    if (response.success) {
      allTags.value = response.tags.map((item: any) => item.tag)
    }
  } catch (error) {
    console.error('获取标签失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换标签选择
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  emit('filter-change', selectedTags.value)
}

// 移除单个标签
const removeTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
    emit('filter-change', selectedTags.value)
  }
}

// 清除所有标签
const clearAll = () => {
  selectedTags.value = []
  emit('filter-change', selectedTags.value)
}

// 关闭浮窗
const close = () => {
  emit('update:visible', false)
}

// 拖拽功能
const startDrag = (event: MouseEvent) => {
  if (!tagFilterRef.value) return
  
  isDragging.value = true
  dragStartPos.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  }
  
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  
  // 防止文本选择
  event.preventDefault()
}

const handleDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  position.value = {
    x: event.clientX - dragStartPos.value.x,
    y: event.clientY - dragStartPos.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 组件挂载时获取标签
onMounted(() => {
  fetchAllTags()
})

// 清理事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.fixed {
  position: fixed;
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.border {
  border-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.p-4 {
  padding: 1rem;
}

.z-50 {
  z-index: 50;
}

.cursor-move {
  cursor: move;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.font-medium {
  font-weight: 500;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-600 {
  color: #4b5563;
}

.text-red-500 {
  color: #ef4444;
}

.text-red-700 {
  color: #b91c1c;
}

.hover\:text-gray-600:hover {
  color: #4b5563;
}

.hover\:text-red-700:hover {
  color: #b91c1c;
}

.transition-colors {
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}

.max-h-64 {
  max-height: 16rem;
}

.overflow-y-auto {
  overflow-y: auto;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.ml-2 {
  margin-left: 0.5rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.pt-2 {
  padding-top: 0.5rem;
}

.pb-2 {
  padding-bottom: 0.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.border-b {
  border-bottom-width: 1px;
}

.border-t {
  border-top-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.w-full {
  width: 100%;
}

.w-3 {
  width: 0.75rem;
}

.h-3 {
  height: 0.75rem;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.fill-none {
  fill: none;
}

.stroke-current {
  stroke: currentColor;
}
</style>
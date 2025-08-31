<template>
  <div class="highlightable-text-container">
    <!-- 工具栏 -->
    <div v-if="editable" class="highlight-toolbar mb-4 p-3 bg-gray-50 rounded-lg border">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-gray-700">高亮工具:</span>
          
          <!-- 颜色选择器 -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-600">颜色:</span>
            <div class="flex gap-1">
              <button
                v-for="color in highlightColors"
                :key="color.name"
                :class="[
                  'w-6 h-6 rounded border-2 transition-all duration-200 hover:scale-110',
                  selectedColor === color.name ? 'border-gray-800 shadow-md' : 'border-gray-300'
                ]"
                :style="{ backgroundColor: color.value }"
                @click="selectedColor = color.name"
                :title="color.label"
              />
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <n-button-group size="small">
            <n-button 
              @click="addHighlight" 
              :disabled="!hasSelection"
              type="primary"
            >
              <template #icon>
                <n-icon :component="ColorPaletteIcon" />
              </template>
              添加高亮
            </n-button>
            
            <n-button 
              @click="removeHighlight" 
              :disabled="!hasSelection"
              type="warning"
            >
              <template #icon>
                <n-icon :component="RemoveIcon" />
              </template>
              移除高亮
            </n-button>
          </n-button-group>
        </div>
        
        <div class="flex items-center gap-2">
          <n-button 
            @click="clearAllHighlights" 
            :disabled="highlights.length === 0"
            size="small"
            type="error"
            quaternary
          >
            <template #icon>
              <n-icon :component="TrashIcon" />
            </template>
            清除所有
          </n-button>
          
          <span class="text-xs text-gray-500">
            已高亮: {{ highlights.length }} 处
          </span>
        </div>
      </div>
    </div>
    
    <!-- 文本显示区域 -->
    <div 
      ref="textContainer"
      class="text-display-area"
      :class="{
        'cursor-text': editable,
        'select-text': editable,
        'bg-gray-50 p-4 rounded-lg border': true
      }"
      @mouseup="handleTextSelection"
      @keyup="handleTextSelection"
      v-html="renderedText"
    />
    
    <!-- 高亮列表 -->
    <div v-if="editable && highlights.length > 0" class="highlight-list mt-4">
      <h4 class="text-sm font-medium text-gray-700 mb-2">高亮列表:</h4>
      <div class="space-y-2">
        <div 
          v-for="(highlight, index) in highlights"
          :key="index"
          class="flex items-center justify-between p-2 bg-white rounded border hover:shadow-sm transition-shadow"
        >
          <div class="flex items-center gap-2 flex-1">
            <div 
              class="w-4 h-4 rounded border"
              :style="{ backgroundColor: getColorValue(highlight.color) }"
            />
            <span class="text-sm text-gray-800 truncate flex-1" :title="highlight.text">
              "{{ highlight.text.length > 50 ? highlight.text.substring(0, 50) + '...' : highlight.text }}"
            </span>
          </div>
          
          <n-button 
            @click="removeHighlightByIndex(index)"
            size="tiny"
            type="error"
            quaternary
            circle
          >
            <template #icon>
              <n-icon :component="CloseIcon" />
            </template>
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { NButton, NButtonGroup, NIcon } from 'naive-ui'
import { 
  ColorPalette as ColorPaletteIcon, 
  Remove as RemoveIcon, 
  Trash as TrashIcon,
  Close as CloseIcon 
} from '@vicons/ionicons5'

// 类型定义
interface Highlight {
  start: number
  end: number
  text: string
  color: string
  id: string
}

interface HighlightColor {
  name: string
  label: string
  value: string
}

// Props
interface Props {
  text: string
  highlights?: Highlight[]
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  highlights: () => [],
  editable: false
})

// Emits
const emit = defineEmits<{
  'update:highlights': [highlights: Highlight[]]
}>()

// 响应式数据
const textContainer = ref<HTMLElement>()
const selectedColor = ref('yellow')
const hasSelection = ref(false)
const currentSelection = ref<{ start: number; end: number; text: string } | null>(null)

// 高亮颜色配置
const highlightColors: HighlightColor[] = [
  { name: 'yellow', label: '黄色', value: '#fef08a' },
  { name: 'green', label: '绿色', value: '#bbf7d0' },
  { name: 'blue', label: '蓝色', value: '#bfdbfe' },
  { name: 'pink', label: '粉色', value: '#fbcfe8' },
  { name: 'purple', label: '紫色', value: '#ddd6fe' },
  { name: 'orange', label: '橙色', value: '#fed7aa' },
  { name: 'red', label: '红色', value: '#fecaca' },
  { name: 'gray', label: '灰色', value: '#e5e7eb' }
]

// 内部高亮数据
const highlights = ref<Highlight[]>([...props.highlights])

// 监听外部高亮数据变化
watch(() => props.highlights, (newHighlights) => {
  highlights.value = [...newHighlights]
}, { deep: true })

// 监听内部高亮数据变化，向外发射
watch(highlights, (newHighlights) => {
  emit('update:highlights', [...newHighlights])
}, { deep: true })

// 计算属性
const renderedText = computed(() => {
  if (highlights.value.length === 0) {
    return escapeHtml(props.text)
  }
  
  // 按开始位置排序
  const sortedHighlights = [...highlights.value].sort((a, b) => a.start - b.start)
  
  let result = ''
  let lastIndex = 0
  
  for (const highlight of sortedHighlights) {
    // 添加高亮前的文本
    if (highlight.start > lastIndex) {
      result += escapeHtml(props.text.substring(lastIndex, highlight.start))
    }
    
    // 添加高亮文本
    const highlightedText = escapeHtml(props.text.substring(highlight.start, highlight.end))
    const colorValue = getColorValue(highlight.color)
    result += `<mark style="background-color: ${colorValue}; padding: 2px 4px; border-radius: 3px; margin: 0 1px;" data-highlight-id="${highlight.id}">${highlightedText}</mark>`
    
    lastIndex = highlight.end
  }
  
  // 添加剩余文本
  if (lastIndex < props.text.length) {
    result += escapeHtml(props.text.substring(lastIndex))
  }
  
  return result
})

// 方法
const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const getColorValue = (colorName: string): string => {
  const color = highlightColors.find(c => c.name === colorName)
  return color?.value || '#fef08a'
}

const handleTextSelection = () => {
  if (!props.editable) return
  
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    hasSelection.value = false
    currentSelection.value = null
    return
  }
  
  const range = selection.getRangeAt(0)
  const selectedText = selection.toString().trim()
  
  if (selectedText.length === 0) {
    hasSelection.value = false
    currentSelection.value = null
    return
  }
  
  // 计算选中文本在原始文本中的位置
  const containerText = textContainer.value?.textContent || ''
  const start = containerText.indexOf(selectedText)
  
  if (start !== -1) {
    hasSelection.value = true
    currentSelection.value = {
      start,
      end: start + selectedText.length,
      text: selectedText
    }
  }
}

const addHighlight = () => {
  if (!currentSelection.value || !props.editable) return
  
  const newHighlight: Highlight = {
    ...currentSelection.value,
    color: selectedColor.value,
    id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // 检查是否与现有高亮重叠
  const hasOverlap = highlights.value.some(h => 
    (newHighlight.start < h.end && newHighlight.end > h.start)
  )
  
  if (!hasOverlap) {
    highlights.value.push(newHighlight)
    clearSelection()
  }
}

const removeHighlight = () => {
  if (!currentSelection.value || !props.editable) return
  
  // 找到与选中文本重叠的高亮
  const overlappingHighlights = highlights.value.filter(h => 
    currentSelection.value!.start < h.end && currentSelection.value!.end > h.start
  )
  
  // 移除重叠的高亮
  overlappingHighlights.forEach(highlight => {
    const index = highlights.value.findIndex(h => h.id === highlight.id)
    if (index !== -1) {
      highlights.value.splice(index, 1)
    }
  })
  
  clearSelection()
}

const removeHighlightByIndex = (index: number) => {
  highlights.value.splice(index, 1)
}

const clearAllHighlights = () => {
  highlights.value = []
}

const clearSelection = () => {
  window.getSelection()?.removeAllRanges()
  hasSelection.value = false
  currentSelection.value = null
}
</script>

<style scoped>
.highlightable-text-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.text-display-area {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 100px;
  font-size: 14px;
}

.select-text {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.highlight-toolbar {
  border: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

.highlight-list {
  max-height: 200px;
  overflow-y: auto;
}

/* 高亮文本的悬停效果 */
:deep(mark) {
  transition: all 0.2s ease;
  cursor: pointer;
}

:deep(mark:hover) {
  transform: scale(1.02);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
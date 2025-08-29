<template>
  <div class="smart-tag-input">
    <n-dynamic-tags
      v-model:value="localTags"
      :placeholder="placeholder"
      @update:value="handleTagsUpdate"
    >
      <template #trigger="{ activate, disabled }">
        <n-button
          size="small"
          type="dashed"
          :disabled="disabled"
          @click="handleAddClick(activate)"
        >
          <template #icon>
            <n-icon :component="AddIcon" />
          </template>
          添加标签
        </n-button>
      </template>
    </n-dynamic-tags>
    
    <!-- 推荐标签面板 -->
    <div v-if="showSuggestions && suggestedTags.length > 0" class="mt-3">
      <div class="text-sm text-gray-600 mb-2">推荐标签（按使用频次排序）：</div>
      <div class="flex flex-wrap gap-2">
        <n-tag
          v-for="tagStat in suggestedTags"
          :key="tagStat.tag"
          :type="localTags.includes(tagStat.tag) ? 'success' : 'default'"
          :checkable="!localTags.includes(tagStat.tag)"
          @click="handleSuggestedTagClick(tagStat.tag)"
          class="cursor-pointer"
        >
          {{ tagStat.tag }}
          <span class="ml-1 text-xs opacity-60">({{ tagStat.count }})</span>
        </n-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { NDynamicTags, NButton, NIcon, NTag } from 'naive-ui'
import { Add as AddIcon } from '@vicons/ionicons5'

// Props
interface Props {
  modelValue: string[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '添加标签'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// 响应式数据
const localTags = ref<string[]>([...props.modelValue])
const showSuggestions = ref(false)
const suggestedTags = ref<Array<{ tag: string; count: number }>>([])
const loading = ref(false)

// 计算属性 - 过滤掉已选择的标签
const availableSuggestions = computed(() => {
  return suggestedTags.value.filter(tagStat => 
    !localTags.value.includes(tagStat.tag)
  )
})

// 监听 props 变化
watch(() => props.modelValue, (newValue) => {
  localTags.value = [...newValue]
}, { deep: true })

// 监听本地标签变化并向上传递
watch(localTags, (newTags) => {
  emit('update:modelValue', newTags)
}, { deep: true })

// 方法
const loadTagStats = async () => {
  if (loading.value) return
  
  try {
    loading.value = true
    const response = await $fetch<{
      success: boolean
      data: Array<{ tag: string; count: number }>
    }>('/api/tags/stats')
    
    if (response.success) {
      suggestedTags.value = response.data
    }
  } catch (error) {
    console.error('加载标签统计失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAddClick = (activate: () => void) => {
  // 显示推荐标签
  if (!showSuggestions.value) {
    showSuggestions.value = true
    loadTagStats()
  }
  
  // 激活输入框
  activate()
}

const handleTagsUpdate = (tags: string[]) => {
  localTags.value = [...tags]
}

const handleSuggestedTagClick = (tag: string) => {
  if (!localTags.value.includes(tag)) {
    localTags.value.push(tag)
  }
}

// 组件挂载时加载标签统计
onMounted(() => {
  loadTagStats()
})
</script>

<style scoped>
.smart-tag-input {
  width: 100%;
}
</style>
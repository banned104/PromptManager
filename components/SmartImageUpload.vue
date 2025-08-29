<template>
  <div class="smart-image-upload">
    <!-- 智能导入区域 -->
    <div
      ref="uploadAreaRef"
      class="upload-area"
      :class="{
        'focused': isFocused,
        'has-image': hasImage
      }"
      @click="handleSingleClick"
      @dblclick="handleDoubleClick"
      tabindex="0"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <!-- 隐藏的文件输入 -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <!-- 图片预览 -->
      <div v-if="hasImage" class="image-preview">
        <img :src="displayImage" alt="预览图片" class="preview-img" />
        <div class="image-overlay">
          <n-button
            size="small"
            type="error"
            circle
            @click.stop="handleRemoveImage"
            class="remove-btn"
          >
            <template #icon>
              <n-icon><CloseIcon /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
      
      <!-- 空状态提示 -->
      <div v-else class="empty-state">
        <div class="upload-icon">
          <n-icon size="48" color="#d1d5db">
            <ImageIcon />
          </n-icon>
        </div>
        <div class="upload-text">
          <p class="primary-text">智能图片导入</p>
          <p class="secondary-text">单击选中后粘贴图片 • 双击选择文件</p>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <n-spin size="large" />
      </div>
    </div>
    
    <!-- 操作提示 -->
    <div v-if="isFocused && !hasImage" class="operation-hint">
      <n-text depth="3" class="hint-text">
        <n-icon class="hint-icon"><KeyboardIcon /></n-icon>
        按 Ctrl+V 粘贴图片
      </n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { NButton, NIcon, NSpin, NText, useMessage } from 'naive-ui'
import { Image as ImageIcon, Close as CloseIcon, Keypad as KeyboardIcon } from '@vicons/ionicons5'
import { useClipboardImage } from '@/composables/useClipboardImage'

// Props
interface Props {
  modelValue?: string
  disabled?: boolean
  initialImage?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  initialImage: ''
})

// Emits
interface Emits {
  'update:modelValue': [value: string]
  'upload-success': [url: string, file: File]
  'upload-error': [error: string]
}

const emit = defineEmits<Emits>()

// 响应式数据
const uploadAreaRef = ref<HTMLElement>()
const fileInputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const loading = ref(false)
const imagePreview = ref('')
const focusTimer = ref<NodeJS.Timeout | null>(null)
const message = useMessage()

// 剪贴板功能
const { imageFile: clipFile, imageDataUrl: clipPreview, readClipboard, loading: clipLoading } = useClipboardImage()

// 计算属性
const hasImage = computed(() => {
  return !!(props.modelValue || imagePreview.value || props.initialImage)
})

const displayImage = computed(() => {
  return props.modelValue || imagePreview.value || props.initialImage
})

// 方法
const handleSingleClick = () => {
  if (props.disabled) return
  
  // 聚焦到上传区域
  uploadAreaRef.value?.focus()
}

const handleDoubleClick = () => {
  if (props.disabled) return
  
  // 触发文件选择
  fileInputRef.value?.click()
}

const handleFocus = () => {
  if (props.disabled) return
  
  isFocused.value = true
  
  // 清除之前的定时器
  if (focusTimer.value) {
    clearTimeout(focusTimer.value)
  }
  
  // 设置2秒后自动失焦
  focusTimer.value = setTimeout(() => {
    isFocused.value = false
    uploadAreaRef.value?.blur()
  }, 2000)
}

const handleBlur = () => {
  isFocused.value = false
  if (focusTimer.value) {
    clearTimeout(focusTimer.value)
    focusTimer.value = null
  }
}

const handleKeydown = async (event: KeyboardEvent) => {
  if (props.disabled) return
  
  // 检测 Ctrl+V 粘贴
  if (event.ctrlKey && event.key === 'v') {
    event.preventDefault()
    await handleClipboardPaste()
  }
}

const handleClipboardPaste = async () => {
  try {
    loading.value = true
    await readClipboard()
    
    if (clipFile.value) {
      await uploadImage(clipFile.value)
      imagePreview.value = clipPreview.value
    } else {
      message.warning('剪贴板中没有图片')
    }
  } catch (error: any) {
    console.error('粘贴图片失败:', error)
    message.error(error.message || '粘贴图片失败')
    emit('upload-error', error.message || '粘贴图片失败')
  } finally {
    loading.value = false
  }
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  try {
    loading.value = true
    
    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    // 上传文件
    await uploadImage(file)
  } catch (error: any) {
    console.error('文件上传失败:', error)
    message.error('文件上传失败')
    emit('upload-error', '文件上传失败')
  } finally {
    loading.value = false
    // 清空文件输入
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  
  const response = await $fetch('/api/upload/image', {
    method: 'POST',
    body: formData
  })
  
  if (response.success) {
    emit('update:modelValue', response.data.url)
    emit('upload-success', response.data.url, file)
    message.success('图片上传成功')
  } else {
    throw new Error(response.message || '上传失败')
  }
}

const handleRemoveImage = () => {
  imagePreview.value = ''
  emit('update:modelValue', '')
  emit('upload-success', '', new File([], ''))
  
  // 清空文件输入
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 生命周期
onMounted(() => {
  // 如果有初始值，设置预览
  if (props.modelValue) {
    imagePreview.value = props.modelValue
  }
})

onUnmounted(() => {
  if (focusTimer.value) {
    clearTimeout(focusTimer.value)
  }
})
</script>

<style scoped>
.smart-image-upload {
  width: 100%;
}

.upload-area {
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.upload-area:hover {
  border-color: #f97316;
  background: #fff7ed;
}

.upload-area.focused {
  border-color: #f97316;
  background: #fff7ed;
  box-shadow: 
    0 0 0 4px rgba(249, 115, 22, 0.1),
    0 0 20px rgba(249, 115, 22, 0.3),
    0 0 40px rgba(249, 115, 22, 0.2),
    0 0 60px rgba(249, 115, 22, 0.1);
  animation: glow-pulse 2s ease-in-out;
}

@keyframes glow-pulse {
  0% {
    box-shadow: 
      0 0 0 4px rgba(249, 115, 22, 0.1),
      0 0 20px rgba(249, 115, 22, 0.3),
      0 0 40px rgba(249, 115, 22, 0.2),
      0 0 60px rgba(249, 115, 22, 0.1);
  }
  50% {
    box-shadow: 
      0 0 0 6px rgba(249, 115, 22, 0.15),
      0 0 30px rgba(249, 115, 22, 0.4),
      0 0 60px rgba(249, 115, 22, 0.3),
      0 0 90px rgba(249, 115, 22, 0.15);
  }
  100% {
    box-shadow: 
      0 0 0 4px rgba(249, 115, 22, 0.1),
      0 0 20px rgba(249, 115, 22, 0.3),
      0 0 40px rgba(249, 115, 22, 0.2),
      0 0 60px rgba(249, 115, 22, 0.1);
  }
}

.upload-area.has-image {
  min-height: auto;
  border-style: solid;
  background: white;
}

.image-preview {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.preview-img {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
}

.image-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.remove-btn {
  background: rgba(0, 0, 0, 0.6) !important;
  border: none !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
}

.upload-icon {
  opacity: 0.6;
}

.upload-text {
  text-align: center;
}

.primary-text {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 4px 0;
}

.secondary-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.operation-hint {
  margin-top: 8px;
  text-align: center;
}

.hint-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.hint-icon {
  font-size: 14px;
}

.hidden {
  display: none;
}
</style>
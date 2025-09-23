<template>
  <div class="smart-image-upload">
    <!-- 智能导入区域 -->
    <div
      ref="uploadAreaRef"
      class="upload-area"
      :class="{
        'focused': isFocused,
        'has-images': hasImages
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
        multiple
        class="hidden"
        @change="handleFileSelect"
      />
      
      <!-- 多图片预览 -->
      <div v-if="hasImages" class="images-preview">
        <div 
          v-for="(image, index) in displayImages" 
          :key="index"
          class="image-preview-item"
        >
          <img :src="image" :alt="`预览图片 ${index + 1}`" class="preview-img" />
          <div class="image-overlay">
            <n-button
              size="small"
              type="error"
              circle
              @click.stop="handleRemoveImage(index)"
              class="remove-btn"
            >
              <template #icon>
                <n-icon><CloseIcon /></n-icon>
              </template>
            </n-button>
          </div>
        </div>
        
        <!-- 添加更多图片按钮 -->
        <div 
          class="add-more-btn"
          @click.stop="handleDoubleClick"
        >
          <n-icon size="24" color="#6b7280">
            <AddIcon />
          </n-icon>
          <span class="add-text">添加图片</span>
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
          <p class="secondary-text">单击选中后粘贴图片 • 双击选择文件 • 支持多图片</p>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <n-spin size="large" />
      </div>
    </div>
    
    <!-- 操作提示 -->
    <div v-if="isFocused && !hasImages" class="operation-hint">
      <n-text depth="3" class="hint-text">
        <n-icon class="hint-icon"><KeyboardIcon /></n-icon>
        按 Ctrl+V 粘贴图片 • 支持多图片选择
      </n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { NButton, NIcon, NSpin, NText, useMessage } from 'naive-ui'
import { Image as ImageIcon, Close as CloseIcon, Keypad as KeyboardIcon, Add as AddIcon } from '@vicons/ionicons5'
import { useClipboardImage } from '@/composables/useClipboardImage'

// Props
interface Props {
  modelValue?: string | string[]  // 支持单图片(string)和多图片(string[])
  disabled?: boolean
  initialImage?: string
  multiple?: boolean  // 是否启用多图片模式
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  initialImage: '',
  multiple: false
})

// Emits
interface Emits {
  'update:modelValue': [value: string | string[]]
  'upload-success': [url: string | string[], file: File | File[]]
  'upload-error': [error: string]
}

const emit = defineEmits<Emits>()

// 响应式数据
const uploadAreaRef = ref<HTMLElement>()
const fileInputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const loading = ref(false)
const imagesPreviews = ref<string[]>([])
const focusTimer = ref<NodeJS.Timeout | null>(null)
const message = useMessage()

// 剪贴板功能
const { imageFile: clipFile, imageDataUrl: clipPreview, readClipboard, loading: clipLoading } = useClipboardImage()

// 计算属性
const hasImages = computed(() => {
  return displayImages.value.length > 0
})

const displayImages = computed(() => {
  // 处理向后兼容性
  if (props.multiple) {
    // 多图片模式
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.filter(img => img)
    } else if (props.modelValue) {
      return [props.modelValue]
    } else if (imagesPreviews.value.length > 0) {
      return imagesPreviews.value
    } else if (props.initialImage) {
      return [props.initialImage]
    }
    return []
  } else {
    // 单图片模式（向后兼容）
    const singleImage = Array.isArray(props.modelValue) 
      ? props.modelValue[0] 
      : props.modelValue || imagesPreviews.value[0] || props.initialImage
    return singleImage ? [singleImage] : []
  }
})

// 向后兼容的计算属性
const hasImage = computed(() => hasImages.value)
const displayImage = computed(() => displayImages.value[0] || '')

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
      const uploadedUrl = await uploadSingleImage(clipFile.value)
      addImageToCollection(uploadedUrl, clipPreview.value)
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
  const files = target.files
  
  if (!files || files.length === 0) return
  
  try {
    loading.value = true
    
    if (props.multiple) {
      // 多图片模式
      const uploadPromises = Array.from(files).map(async (file) => {
        const reader = new FileReader()
        const previewPromise = new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })
        
        const [uploadedUrl, preview] = await Promise.all([
          uploadSingleImage(file),
          previewPromise
        ])
        
        return { url: uploadedUrl, preview, file }
      })
      
      const results = await Promise.all(uploadPromises)
      
      // 添加所有图片到集合
      results.forEach(({ url, preview }) => {
        addImageToCollection(url, preview)
      })
      
      emit('upload-success', results.map(r => r.url), results.map(r => r.file))
    } else {
      // 单图片模式（向后兼容）
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        imagesPreviews.value = [e.target?.result as string]
      }
      reader.readAsDataURL(file)
      
      const uploadedUrl = await uploadSingleImage(file)
      emit('update:modelValue', uploadedUrl)
      emit('upload-success', uploadedUrl, file)
    }
    
    message.success(`成功上传 ${files.length} 张图片`)
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

const uploadSingleImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)
  
  const response = await $fetch('/api/upload/image', {
    method: 'POST',
    body: formData
  })
  
  if (response.success) {
    return response.data.url
  } else {
    throw new Error(response.message || '上传失败')
  }
}

const addImageToCollection = (url: string, preview: string) => {
  if (props.multiple) {
    const currentImages = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    if (props.modelValue && !Array.isArray(props.modelValue)) {
      currentImages.push(props.modelValue)
    }
    currentImages.push(url)
    imagesPreviews.value.push(preview)
    emit('update:modelValue', currentImages)
  } else {
    imagesPreviews.value = [preview]
    emit('update:modelValue', url)
  }
}

const handleRemoveImage = (index?: number) => {
  if (props.multiple && typeof index === 'number') {
    // 多图片模式
    const currentImages = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    currentImages.splice(index, 1)
    imagesPreviews.value.splice(index, 1)
    emit('update:modelValue', currentImages)
    emit('upload-success', currentImages, [])
  } else {
    // 单图片模式（向后兼容）
    imagesPreviews.value = []
    emit('update:modelValue', props.multiple ? [] : '')
    emit('upload-success', props.multiple ? [] : '', new File([], ''))
  }
  
  // 清空文件输入
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 生命周期
onMounted(() => {
  // 如果有初始值，设置预览
  if (props.modelValue) {
    if (Array.isArray(props.modelValue)) {
      imagesPreviews.value = [...props.modelValue]
    } else {
      imagesPreviews.value = [props.modelValue]
    }
  } else if (props.initialImage) {
    imagesPreviews.value = [props.initialImage]
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

.upload-area.has-images {
  min-height: auto;
  border-style: solid;
  background: white;
  padding: 16px;
}

.images-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 600px;
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.image-overlay {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-preview-item:hover .image-overlay {
  opacity: 1;
}

.add-more-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 4px;
}

.add-more-btn:hover {
  border-color: #f97316;
  background: #fff7ed;
}

.add-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
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
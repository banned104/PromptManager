<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">创建新 Prompt</h1>
      <n-breadcrumb>
        <n-breadcrumb-item @click="navigateTo('/')">首页</n-breadcrumb-item>
        <n-breadcrumb-item>创建 Prompt</n-breadcrumb-item>
      </n-breadcrumb>
    </div>

    <n-card>
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <!-- 标题 -->
        <n-form-item label="标题" path="title">
          <n-input
            v-model:value="formData.title"
            placeholder="请输入 Prompt 标题"
            maxlength="255"
            show-count
          />
        </n-form-item>

        <!-- 内容 -->
        <n-form-item label="内容" path="content">
          <n-input
            v-model:value="formData.content"
            type="textarea"
            placeholder="请输入 Prompt 内容"
            :rows="8"
            maxlength="5000"
            show-count
          />
        </n-form-item>

        <!-- 图片上传 -->
        <n-form-item label="图片">
          <div class="w-full">
            <n-upload
              :file-list="fileList"
              :max="1"
              list-type="image-card"
              accept="image/*"
              @change="handleFileChange"
              @remove="handleFileRemove"
            >
              点击上传图片
            </n-upload>
            <n-button class="mt-2" :loading="clipLoading" @click="handleClipboardUpload">
              粘贴图片
            </n-button>
          </div>
        </n-form-item>

        <!-- 标签 -->
        <n-form-item label="标签">
          <n-dynamic-tags
            v-model:value="formData.tags"
            placeholder="添加标签"
          />
        </n-form-item>

        <!-- 操作按钮 -->
        <n-form-item>
          <n-space>
            <n-button
              type="primary"
              :loading="submitting"
              @click="handleSubmit"
            >
              创建 Prompt
            </n-button>
            
            <n-button @click="navigateTo('/')">
              取消
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NUpload,
  NDynamicTags,
  NButton,
  NSpace,
  NBreadcrumb,
  NBreadcrumbItem,
  useMessage,
  type FormInst,
  type UploadFileInfo

} from 'naive-ui'

import { useClipboardImage } from '@/composables/useClipboardImage'

// 响应式数据
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const submitting = ref(false)
const fileList = ref<UploadFileInfo[]>([])
const imagePreview = ref<string>('')

// 剪贴板图片相关
const { imageFile: clipFile, imageDataUrl: clipPreview, readClipboard, loading: clipLoading } = useClipboardImage()

// 监听剪贴板文件变化并自动上传
watch(clipFile, async (file) => {
  if (!file) return
  try {
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)
    const response = await $fetch('/api/upload/image', {
      method: 'POST',
      body: formDataUpload
    })
    if (response.success) {
        formData.imagePath = response.data.url
        imagePreview.value = clipPreview.value
        // 在上传列表中展示剪贴板图片，支持后续删除
        fileList.value = [
          {
            id: Date.now().toString(),
            name: file.name ?? 'clipboard-image',
            status: 'finished',
            url: clipPreview.value
          } as unknown as UploadFileInfo
        ]
        message.success('图片上传成功')
      }
  } catch (error: any) {
    console.error('剪贴板图片上传失败:', error)
    message.error('剪贴板图片上传失败')
  }
})

const handleClipboardUpload = async () => {
  try {
    await readClipboard()
  } catch (e: any) {
    message.error(e.message || '读取剪贴板失败')
  }
}
// 表单数据
const formData = reactive({
  title: '',
  content: '',
  imagePath: '',
  tags: [] as string[]
})

// 表单验证规则
const rules = {
  title: {
    required: true,
    message: '请输入标题',
    trigger: 'blur'
  },
  content: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  }
}

// 方法
const handleFileChange = async (options: { fileList: UploadFileInfo[] }) => {
  fileList.value = options.fileList
  if (options.fileList.length > 0) {
    const file = options.fileList[0]
    if (file?.file) {
      try {
        // 创建预览
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file.file)
        
        // 上传到服务器
        const formDataUpload = new FormData()
        formDataUpload.append('image', file.file)
        
        const response = await $fetch('/api/upload/image', {
          method: 'POST',
          body: formDataUpload
        })
        
        if (response.success) {
          formData.imagePath = response.data.url
          message.success('图片上传成功')
        }
      } catch (error: any) {
        console.error('图片上传失败:', error)
        message.error('图片上传失败')
        // 清除文件列表
        fileList.value = []
        imagePreview.value = ''
      }
    }
  }
}

const handleFileRemove = () => {
  formData.imagePath = ''
  imagePreview.value = ''
  fileList.value = []
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const response = await $fetch('/api/prompts', {
          method: 'POST' as const,
          body: {
            title: formData.title,
            content: formData.content,
            imagePath: formData.imagePath || null,
            tags: formData.tags.length > 0 ? formData.tags : null
          }
        })
    
    if (response.success) {
      message.success('创建成功！')
      navigateTo('/')
    }
  } catch (error: any) {
    console.error('创建失败:', error)
    message.error(error.data?.statusMessage || '创建失败')
  } finally {
    submitting.value = false
  }
}

// 页面元数据
useHead({
  title: '创建 Prompt - Prompt 管理器'
})
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
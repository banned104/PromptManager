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

        <!-- 智能图片上传 -->
        <n-form-item label="图片" path="imagePath">
          <SmartImageUpload
            v-model="formData.imagePath"
            @upload-success="handleUploadSuccess"
            @upload-error="handleUploadError"
          />
        </n-form-item>

        <!-- 标签 -->
        <n-form-item label="标签">
          <SmartTagInput
            v-model="formData.tags"
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
import { ref, reactive } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NBreadcrumb,
  NBreadcrumbItem,
  useMessage,
  type FormInst
} from 'naive-ui'

import SmartImageUpload from '@/components/SmartImageUpload.vue'
import SmartTagInput from '@/components/SmartTagInput.vue'

// 响应式数据
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const submitting = ref(false)


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

// 智能上传处理
const handleUploadSuccess = (url: string, file: File) => {
  formData.imagePath = url
  console.log('图片上传成功:', { url, fileName: file.name })
}

const handleUploadError = (error: string) => {
  console.error('图片上传失败:', error)
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
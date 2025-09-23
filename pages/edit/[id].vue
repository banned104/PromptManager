<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- 加载状态 -->
    <div v-if="pending" class="flex justify-center py-12">
      <n-spin size="large" />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-12">
      <n-result status="404" title="404" description="Prompt 不存在">
        <template #footer>
          <n-button @click="navigateTo('/')">返回首页</n-button>
        </template>
      </n-result>
    </div>

    <!-- 编辑表单 -->
    <div v-else-if="promptData?.data && typeof promptData.data === 'object' && !Array.isArray(promptData.data)">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">编辑 Prompt</h1>
        <n-breadcrumb>
          <n-breadcrumb-item @click="navigateTo('/')">首页</n-breadcrumb-item>
          <n-breadcrumb-item @click="navigateTo(`/prompt/${promptId}`)">Prompt 详情</n-breadcrumb-item>
          <n-breadcrumb-item>编辑</n-breadcrumb-item>
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
            <div class="space-y-4">
              <!-- 文本输入区域 -->
              <n-input
                v-model:value="formData.content"
                type="textarea"
                placeholder="请输入 Prompt 内容"
                :rows="6"
                maxlength="5000"
                show-count
              />
              
              <!-- 内容预览 -->
              <div class="border rounded-lg p-4 bg-gray-50">
                <div class="flex items-center justify-between mb-2">
                  <div class="text-sm text-gray-600">内容预览：</div>
                  <n-button-group size="tiny">
                    <n-button 
                      :type="previewMode === 'highlight' ? 'primary' : 'default'"
                      @click="previewMode = 'highlight'"
                    >
                      高亮模式
                    </n-button>
                    <n-button 
                      :type="previewMode === 'markdown' ? 'primary' : 'default'"
                      @click="previewMode = 'markdown'"
                    >
                      Markdown 模式
                    </n-button>
                  </n-button-group>
                </div>
                
                <!-- 高亮文本预览 -->
                <HighlightableText 
                  v-if="previewMode === 'highlight'"
                  :text="formData.content" 
                  :highlights="formData.highlights"
                  :editable="true"
                  @update:highlights="handleHighlightsUpdate"
                  class="text-sm text-gray-700 font-mono leading-relaxed min-h-[100px]"
                />
                
                <!-- Markdown 预览 -->
                <div 
                  v-else-if="previewMode === 'markdown'"
                  class="prose prose-sm max-w-none text-gray-700 min-h-[100px]"
                  v-html="previewMarkdown"
                ></div>
              </div>
            </div>
          </n-form-item>

          <!-- 图片上传 -->
          <n-form-item label="图片">
            <SmartImageUpload
              v-model="formData.images"
              :multiple="true"
              :initial-image="formData.imagePath"
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
                保存更改
              </n-button>
              
              <n-button @click="navigateTo(`/prompt/${promptId}`)">
                取消
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NBreadcrumb,
  NBreadcrumbItem,
  NSpin,
  NResult,
  NButtonGroup,
  useMessage,
  type FormInst
} from 'naive-ui'
import { marked } from 'marked'
import SmartImageUpload from '@/components/SmartImageUpload.vue'
import SmartTagInput from '@/components/SmartTagInput.vue'
import HighlightableText from '~/components/HighlightableText.vue'
import { useCache } from '~/composables/useCache'

interface Highlight {
  id: string
  start: number
  end: number
  text: string
  color: string
}

// 获取路由参数
const route = useRoute()
const message = useMessage()
const promptId = route.params.id as string

// 响应式数据
const formRef = ref<FormInst | null>(null)
const submitting = ref(false)
const previewMode = ref<'highlight' | 'markdown'>('highlight')
const { invalidateCache } = useCache()

// 获取数据
const { data: promptData, pending, error } = await useFetch(`/api/prompts/${promptId}`)

// 表单数据
const formData = reactive({
  title: '',
  content: '',
  imagePath: '', // 保持向后兼容
  images: [] as string[], // 新的多图片字段
  tags: [] as string[],
  highlights: [] as Highlight[]
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

// 监听数据变化，初始化表单
watch(promptData, (newData) => {
  if (newData?.data && typeof newData.data === 'object' && !Array.isArray(newData.data)) {
    const data = newData.data as { 
      title: string; 
      content: string; 
      imagePath: string | null; 
      images: string | null;
      tags: string | null; 
      highlights: string | null 
    }
    formData.title = data.title || ''
    formData.content = data.content || ''
    formData.imagePath = data.imagePath || ''
    
    // 解析多图片数据（向后兼容）
    try {
      if (data.images) {
        formData.images = JSON.parse(data.images)
      } else if (data.imagePath) {
        formData.images = [data.imagePath]
      } else {
        formData.images = []
      }
    } catch {
      formData.images = data.imagePath ? [data.imagePath] : []
    }
    
    // 解析标签
    try {
      formData.tags = data.tags ? JSON.parse(data.tags) : []
    } catch {
      formData.tags = []
    }
    
    // 解析高亮数据
    try {
      formData.highlights = data.highlights ? JSON.parse(data.highlights) : []
    } catch {
      formData.highlights = []
    }
  }
}, { immediate: true })

// Markdown 预览
const previewMarkdown = computed(() => {
  if (!formData.content) return '<div class="text-gray-400 italic">暂无内容</div>'
  
  try {
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false
    })
    
    return marked(formData.content)
  } catch (error) {
    console.error('Markdown 渲染失败:', error)
    return formData.content.replace(/\n/g, '<br>')
  }
})

// 处理高亮更新
const handleHighlightsUpdate = (highlights: Highlight[]) => {
  formData.highlights = highlights
}

// 智能上传处理
const handleUploadSuccess = (url: string | string[], file: File | File[]) => {
  if (Array.isArray(url)) {
    formData.images = url
    // 向后兼容：如果只有一张图片，也设置 imagePath
    formData.imagePath = url[0] || ''
  } else {
    formData.images = url ? [url] : []
    formData.imagePath = url
  }
  
  const fileNames = Array.isArray(file) 
    ? file.map(f => f.name).join(', ')
    : file.name
  console.log('图片上传成功:', { url, fileName: fileNames })
}

const handleUploadError = (error: string) => {
  console.error('图片上传失败:', error)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const response = await $fetch(`/api/prompts/${promptId}`, {
      method: 'PUT' as any,
      body: {
        title: formData.title,
        content: formData.content,
        imagePath: formData.imagePath || null, // 向后兼容
        images: formData.images.length > 0 ? formData.images : null, // 新的多图片字段
        tags: formData.tags.length > 0 ? formData.tags : null,
        highlights: formData.highlights.length > 0 ? formData.highlights : null
      }
    })
    
    if (response.success) {
      message.success('更新成功！')
      // 清除相关缓存
      invalidateCache('prompts')
      invalidateCache(`/api/prompts/${promptId}`)
      await navigateTo(`/prompt/${promptId}`)
    }
  } catch (error: any) {
    console.error('更新失败:', error)
    message.error(error.data?.statusMessage || '更新失败')
  } finally {
    submitting.value = false
  }
}

// 页面元数据
useHead({
  title: '编辑 Prompt - Prompt 管理器'
})
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
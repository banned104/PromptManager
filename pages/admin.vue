<template>
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl font-bold text-gray-800">数据库管理</h1>
        <n-button @click="navigateTo('/')" type="primary" ghost>
          <template #icon>
            <n-icon :component="ArrowBackIcon" />
          </template>
          返回主页
        </n-button>
      </div>
      
      <!-- 数据库统计信息 -->
      <n-card class="mb-6" title="数据库统计">
        <div v-if="dbInfo" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ dbInfo.statistics.totalRecords }}</div>
            <div class="text-sm text-gray-500">总记录数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ dbInfo.statistics.favoritedRecords }}</div>
            <div class="text-sm text-gray-500">收藏记录</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ dbInfo.statistics.uniqueTags }}</div>
            <div class="text-sm text-gray-500">唯一标签</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ formatDate(dbInfo.statistics.newestRecord) }}</div>
            <div class="text-sm text-gray-500">最新记录</div>
          </div>
        </div>
        <n-spin v-else />
      </n-card>

      <!-- 操作工具栏 -->
      <div class="flex gap-4 mb-6">
        <n-button @click="refreshDatabase" :loading="refreshing" type="info">
          <template #icon>
            <n-icon :component="RefreshIcon" />
          </template>
          刷新数据库
        </n-button>
        
        <n-button @click="handleBackup" :loading="backupLoading" type="success">
          <template #icon>
            <n-icon :component="DownloadIcon" />
          </template>
          备份数据库
        </n-button>
        
        <n-button @click="showRestoreModal = true" type="warning">
          <template #icon>
            <n-icon :component="UploadIcon" />
          </template>
          恢复数据库
        </n-button>
        
        <n-button @click="loadDatabaseRecords" :loading="loading" type="default">
          <template #icon>
            <n-icon :component="ListIcon" />
          </template>
          {{ showRecords ? '隐藏记录' : '查看所有记录' }}
        </n-button>
      </div>
    </div>

    <!-- 数据库记录表格 -->
    <n-card v-if="showRecords" title="数据库记录">
      <template #header-extra>
        <n-input
          v-model:value="searchQuery"
          placeholder="搜索记录..."
          clearable
          @input="handleSearch"
          style="width: 300px"
        >
          <template #prefix>
            <n-icon :component="SearchIcon" />
          </template>
        </n-input>
      </template>
      
      <n-data-table
        :columns="columns"
        :data="filteredRecords"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row: any) => row.id"
        striped
        size="small"
      />
    </n-card>

    <!-- 恢复数据库模态框 -->
    <n-modal v-model:show="showRestoreModal" preset="dialog" title="恢复数据库">
      <template #header>
        <div class="flex items-center gap-2">
          <n-icon :component="WarningIcon" />
          <span>恢复数据库</span>
        </div>
      </template>
      
      <div class="space-y-4">
        <n-alert type="warning" title="注意">
          恢复数据库将会影响现有数据。请确保您已经备份了当前数据。
        </n-alert>
        
        <div>
          <label class="block text-sm font-medium mb-2">选择备份文件</label>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            @change="handleFileSelect"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <n-checkbox v-model:checked="replaceExisting">
          替换现有数据（清空数据库后导入）
        </n-checkbox>
        
        <div v-if="selectedFile" class="text-sm text-gray-600">
          已选择文件: {{ selectedFile.name }}
        </div>
      </div>
      
      <template #action>
        <div class="flex gap-2">
          <n-button @click="showRestoreModal = false">取消</n-button>
          <n-button
            @click="handleRestore"
            :loading="restoreLoading"
            :disabled="!selectedFile"
            type="primary"
          >
            开始恢复
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { 
  NCard, NButton, NIcon, NSpin, NDataTable, NInput, NModal, NAlert, NCheckbox, useMessage,
  type DataTableColumns
} from 'naive-ui'
import { 
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  CloudUpload as UploadIcon,
  List as ListIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  TrashBin as DeleteIcon
} from '@vicons/ionicons5'

interface DatabaseRecord {
  id: number
  title: string
  content: string
  imagePath?: string | null
  images?: string | null
  tags?: string | null
  highlights?: string | null
  isFavorited: boolean
  createdAt: string
  updatedAt: string
}

interface DatabaseInfo {
  statistics: {
    totalRecords: number
    favoritedRecords: number
    uniqueTags: number
    newestRecord?: string
    oldestRecord?: string
  }
  tagStats: Record<string, number>
  records?: DatabaseRecord[]
}

// 响应式数据
const message = useMessage()
const dbInfo = ref<DatabaseInfo | null>(null)
const records = ref<DatabaseRecord[]>([])
const showRecords = ref(false)
const loading = ref(false)
const refreshing = ref(false)
const backupLoading = ref(false)
const restoreLoading = ref(false)
const showRestoreModal = ref(false)
const selectedFile = ref<File | null>(null)
const replaceExisting = ref(false)
const searchQuery = ref('')
const fileInput = ref<HTMLInputElement>()

// 分页配置
const pagination = {
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100]
}

// 表格列配置
const columns: DataTableColumns<DatabaseRecord> = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
    sorter: (a, b) => a.id - b.id
  },
  {
    title: '标题',
    key: 'title',
    ellipsis: {
      tooltip: true
    },
    width: 200
  },
  {
    title: '内容预览',
    key: 'content',
    ellipsis: {
      tooltip: true
    },
    render: (row) => row.content.substring(0, 100) + (row.content.length > 100 ? '...' : '')
  },
  {
    title: '标签',
    key: 'tags',
    width: 150,
    render: (row) => {
      if (!row.tags) return '-'
      try {
        const tags = JSON.parse(row.tags) as string[]
        return tags.join(', ')
      } catch {
        return row.tags
      }
    }
  },
  {
    title: '收藏',
    key: 'isFavorited',
    width: 80,
    render: (row) => row.isFavorited ? '⭐' : '-'
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 160,
    render: (row) => formatDate(row.createdAt)
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render: (row) => h(
      NButton,
      {
        size: 'small',
        type: 'error',
        secondary: true,
        onClick: () => handleDeleteRecord(row)
      },
      {
        icon: () => h(NIcon, { component: DeleteIcon }),
        default: () => '删除'
      }
    )
  }
]

// 计算属性
const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value
  
  const query = searchQuery.value.toLowerCase()
  return records.value.filter(record => 
    record.title.toLowerCase().includes(query) ||
    record.content.toLowerCase().includes(query) ||
    (record.tags && record.tags.toLowerCase().includes(query))
  )
})

// 方法
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

const loadDatabaseInfo = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: DatabaseInfo }>('/api/database/info')
    if (response.success) {
      dbInfo.value = response.data
    }
  } catch (error) {
    console.error('获取数据库信息失败:', error)
    message.error('获取数据库信息失败')
  }
}

const loadDatabaseRecords = async () => {
  if (showRecords.value) {
    showRecords.value = false
    return
  }
  
  loading.value = true
  try {
    const response = await $fetch<{ success: boolean; data: DatabaseInfo }>('/api/database/info?includeData=true')
    if (response.success && response.data.records) {
      records.value = response.data.records
      showRecords.value = true
    }
  } catch (error) {
    console.error('获取数据库记录失败:', error)
    message.error('获取数据库记录失败')
  } finally {
    loading.value = false
  }
}

const refreshDatabase = async () => {
  refreshing.value = true
  try {
    const response = await $fetch<{ success: boolean; message: string }>('/api/database/refresh', {
      method: 'POST'
    })
    if (response.success) {
      message.success(response.message)
      await loadDatabaseInfo()
      if (showRecords.value) {
        await loadDatabaseRecords()
      }
    }
  } catch (error) {
    console.error('刷新数据库失败:', error)
    message.error('刷新数据库失败')
  } finally {
    refreshing.value = false
  }
}

const handleBackup = async () => {
  backupLoading.value = true
  try {
    const response = await fetch('/api/database/backup')
    
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'database-backup.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      message.success('数据库备份成功')
    } else {
      throw new Error(`备份失败: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error('备份数据库失败:', error)
    message.error('备份数据库失败')
  } finally {
    backupLoading.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

const handleRestore = async () => {
  if (!selectedFile.value) {
    message.error('请选择备份文件')
    return
  }
  
  restoreLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('replaceExisting', replaceExisting.value.toString())
    
    const response = await $fetch<{
      success: boolean
      message: string
      data: {
        imported: number
        skipped: number
        total: number
        replaceMode: boolean
        errors?: string[]
      }
    }>('/api/database/restore', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      message.success(`${response.message}: 导入 ${response.data.imported} 条，跳过 ${response.data.skipped} 条`)
      showRestoreModal.value = false
      selectedFile.value = null
      replaceExisting.value = false
      
      // 刷新数据
      await loadDatabaseInfo()
      if (showRecords.value) {
        await loadDatabaseRecords()
      }
    }
  } catch (error: any) {
    console.error('恢复数据库失败:', error)
    message.error(error.data?.message || '恢复数据库失败')
  } finally {
    restoreLoading.value = false
  }
}

const handleDeleteRecord = async (record: DatabaseRecord) => {
  try {
    await $fetch(`/api/prompts/${record.id}`, {
      method: 'DELETE'
    })
    
    message.success('记录删除成功')
    
    // 从本地数据中移除
    records.value = records.value.filter(r => r.id !== record.id)
    
    // 刷新统计信息
    await loadDatabaseInfo()
  } catch (error) {
    console.error('删除记录失败:', error)
    message.error('删除记录失败')
  }
}

const handleSearch = () => {
  // 搜索是通过计算属性实时进行的，这里不需要额外操作
}

// 生命周期
onMounted(async () => {
  await loadDatabaseInfo()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
import type { CivitaiModel } from '~/types/civitai'

const CIVITAI_API_BASE = 'https://civitai.com/api/v1/models'

/**
 * 从 Civitai URL 中提取模型 ID
 */
function extractModelId(modelUrl: string): number | null {
  try {
    const url = new URL(modelUrl)
    const pathParts = url.pathname.split('/')
    
    // 寻找路径中 'models' 后面的部分
    const modelsIndex = pathParts.findIndex(part => part === 'models')
    if (modelsIndex !== -1 && pathParts.length > modelsIndex + 1) {
      const id = parseInt(pathParts[modelsIndex + 1], 10)
      return isNaN(id) ? null : id
    }
    return null
  } catch (err) {
    console.error('❌ URL 解析失败:', err)
    return null
  }
}

/**
 * 获取模型详细信息
 * @param modelUrl - Civitai 模型页面 URL
 * @returns 模型数据或 null
 */
export async function getCivitaiModelInfo(modelUrl: string): Promise<CivitaiModel | null> {
  console.log(`🔍 开始处理模型URL: ${modelUrl}`)
  
  const modelId = extractModelId(modelUrl)
  if (!modelId) {
    console.error('❌ 无法提取模型 ID from URL:', modelUrl)
    throw new Error('无效的 Civitai URL，请检查链接格式')
  }

  console.log(`🔍 获取模型 ID: ${modelId}`)

  try {
    const apiUrl = `${CIVITAI_API_BASE}/${modelId}`
    console.log(`🌐 请求API: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PromptManager/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const modelData: CivitaiModel = await response.json()
    console.log(`✅ 成功获取模型数据:`, modelData)
    return modelData
  } catch (err: any) {
    console.error('❌ 获取模型信息失败:')
    console.error('URL:', modelUrl)
    console.error('API URL:', `${CIVITAI_API_BASE}/${modelId}`)
    console.error('错误详情:', err)
    
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络连接')
    } else if (err.message.includes('HTTP 404')) {
      throw new Error('模型不存在或已被删除')
    } else if (err.message.includes('HTTP 403')) {
      throw new Error('访问被拒绝，可能是私有模型')
    } else {
      throw new Error(`获取模型信息失败: ${err.message}`)
    }
  }
}

/**
 * 验证 Civitai URL 格式
 */
export function validateCivitaiUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname === 'civitai.com' && url.includes('/models/')
  } catch {
    return false
  }
}

/**
 * 格式化模型大小
 */
export function formatFileSize(sizeKB: number): string {
  if (sizeKB < 1024) {
    return `${sizeKB} KB`
  } else if (sizeKB < 1024 * 1024) {
    return `${(sizeKB / 1024).toFixed(1)} MB`
  } else {
    return `${(sizeKB / (1024 * 1024)).toFixed(1)} GB`
  }
}

/**
 * 获取模型的主要图片
 */
export function getPrimaryImage(model: CivitaiModel): string | null {
  const firstVersion = model.modelVersions?.[0]
  const firstImage = firstVersion?.images?.[0]
  return firstImage?.url || null
}

/**
 * 获取模型的训练词汇
 */
export function getTrainedWords(model: CivitaiModel): string[] {
  const firstVersion = model.modelVersions?.[0]
  return firstVersion?.trainedWords || []
}
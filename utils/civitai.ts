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

  // 重试机制
  const maxRetries = 3
  let lastError: any = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 尝试第 ${attempt}/${maxRetries} 次请求...`)
      
      // 添加时间戳来绕过缓存
      const timestamp = Date.now()
      const apiUrl = `${CIVITAI_API_BASE}/${modelId}?_t=${timestamp}`
      console.log(`🌐 请求API: ${apiUrl}`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Referer': 'https://civitai.com/'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const modelData: CivitaiModel = await response.json()
      console.log(`✅ 成功获取模型数据 (尝试 ${attempt}/${maxRetries}):`, modelData.name)
      return modelData
    } catch (err: any) {
      lastError = err
      console.error(`❌ 第 ${attempt}/${maxRetries} 次尝试失败:`, err.message)
      
      if (attempt < maxRetries) {
        const delay = attempt * 2000 // 递增延迟：2s, 4s
        console.log(`⏳ 等待 ${delay}ms 后重试...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  // 所有重试都失败了
  console.error('❌ 所有重试都失败，最后错误:', lastError)
  
  if (lastError.name === 'AbortError') {
    throw new Error('请求超时，请稍后重试')
  } else if (lastError.name === 'TypeError' && lastError.message.includes('fetch')) {
    throw new Error('网络连接失败，请检查网络连接或稍后重试')
  } else if (lastError.message.includes('HTTP 404')) {
    throw new Error('模型不存在或已被删除')
  } else if (lastError.message.includes('HTTP 403')) {
    throw new Error('访问被拒绝，可能是私有模型或需要登录')
  } else {
    throw new Error(`获取模型信息失败: ${lastError.message}`)
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

/**
 * 获取模型的所有图片（包含参数信息）
 * @param modelId - 模型 ID
 * @returns 图片数组，包含 meta 参数信息
 */
export async function getCivitaiModelImages(modelId: number): Promise<CivitaiImage[]> {
  const maxRetries = 3
  let lastError: any = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🖼️ 获取模型图片 (尝试 ${attempt}/${maxRetries})...`)
      
      // 添加时间戳来绕过缓存，根据用户设置决定是否禁用NSFW过滤
      const timestamp = Date.now()
      const nsfwEnabled = typeof window !== 'undefined' ? localStorage.getItem('civitai-nsfw-enabled') === 'true' : false
      const nsfwParam = nsfwEnabled ? '&nsfw=true' : ''
      const apiUrl = `https://civitai.com/api/v1/images?modelId=${modelId}&limit=50${nsfwParam}&_t=${timestamp}`
      console.log(`🌐 请求图片API: ${apiUrl}`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Referer': 'https://civitai.com/'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log(`✅ 成功获取 ${data.items?.length || 0} 张图片 (尝试 ${attempt}/${maxRetries})`)
      return data.items || []
    } catch (err: any) {
      lastError = err
      console.error(`❌ 第 ${attempt}/${maxRetries} 次获取图片失败:`, err.message)
      
      if (attempt < maxRetries) {
        const delay = attempt * 2000 // 递增延迟：2s, 4s
        console.log(`⏳ 等待 ${delay}ms 后重试...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  // 所有重试都失败了，但不抛出错误，返回空数组
  console.warn('⚠️ 获取图片失败，返回空数组:', lastError?.message)
  return []
}

/**
 * 从图片 meta 中提取有用的参数
 */
export function extractImageParams(image: CivitaiImage) {
  const meta = image.meta || {}
  return {
    prompt: meta.prompt || '',
    negativePrompt: meta.negativePrompt || '',
    steps: meta.steps || null,
    cfgScale: meta.cfgScale || null,
    sampler: meta.sampler || '',
    seed: meta.seed || null,
    size: `${image.width}x${image.height}`,
    imageUrl: image.url,
    imageId: image.id
  }
}

/**
 * 获取模型的完整信息（包含图片和参数）
 */
export async function getCivitaiModelWithImages(modelUrl: string) {
  const modelInfo = await getCivitaiModelInfo(modelUrl)
  if (!modelInfo) return null
  
  try {
    console.log(`🖼️ 尝试获取模型 ${modelInfo.id} 的图片...`)
    const images = await getCivitaiModelImages(modelInfo.id)
    const imagesWithParams = images.map(image => ({
      ...image,
      params: extractImageParams(image)
    }))
    
    console.log(`✅ 成功获取 ${imagesWithParams.length} 张图片`)
    
    return {
      ...modelInfo,
      allImages: imagesWithParams
    }
  } catch (error) {
    console.warn('⚠️ 获取图片失败，返回基本模型信息:', error)
    
    // 即使获取图片失败，也要确保有allImages数组
    return {
      ...modelInfo,
      allImages: []
    }
  }
}
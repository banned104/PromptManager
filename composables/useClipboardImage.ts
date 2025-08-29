import { ref } from 'vue'

/**
 * 从剪贴板读取图片文件
 *
 * 使用示例：
 * const { imageFile, imageDataUrl, readClipboard } = useClipboardImage()
 * await readClipboard() // 之后 imageFile 与 imageDataUrl 即可使用
 */
export function useClipboardImage () {
  // 读取到的图片文件（可直接作为 <input type="file"> 的 File 上传）
  const imageFile = ref<File | null>(null)
  // 图片的 dataURL，可用于预览
  const imageDataUrl = ref<string>('')
  // 是否正在读取
  const loading = ref(false)

  /**
   * 触发读取剪贴板
   */
  const readClipboard = async () => {
    loading.value = true
    try {
      // 检测 API 支持
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error('当前浏览器不支持异步剪贴板读取 API')
      }

      const items = await navigator.clipboard.read()
      for (const item of items) {
        for (const type of item.types) {
          // 只处理图片 MIME 类型
          if (type.startsWith('image/')) {
            const blob = await item.getType(type)
            // 生成与上传组件兼容的 File 对象
            const ext = type.split('/')[1] || 'png'
            const file = new File([blob], `clipboard-image.${ext}`, { type })
            imageFile.value = file

            // 生成预览 DataURL
            imageDataUrl.value = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = (e) => resolve(e.target?.result as string)
              reader.onerror = reject
              reader.readAsDataURL(blob)
            })
            return true
          }
        }
      }
      throw new Error('剪贴板中未检测到图片')
    } finally {
      loading.value = false
    }
  }

  return {
    imageFile,
    imageDataUrl,
    loading,
    readClipboard
  }
}
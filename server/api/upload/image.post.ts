import { promises as fs } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import formidable from 'formidable'
import sharp from 'sharp'

export default defineEventHandler(async (event) => {
  try {
    // 只允许 POST 请求
    if (event.node.req.method !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    // 配置 formidable
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => {
        // 只允许图片文件
        return mimetype ? mimetype.startsWith('image/') : false
      }
    })

    // 解析上传的文件
    const [fields, files] = await form.parse(event.node.req)
    
    if (!files.image || !files.image[0]) {
      throw createError({
        statusCode: 400,
        statusMessage: '没有上传图片文件'
      })
    }

    const file = files.image[0]
    
    // 验证文件类型
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      // 删除上传的文件
      await fs.unlink(file.filepath)
      throw createError({
        statusCode: 400,
        statusMessage: '只支持图片文件'
      })
    }

    // 生成新的文件名
    const fileExtension = file.originalFilename?.split('.').pop() || 'jpg'
    const newFileName = `${randomUUID()}.${fileExtension}`
    const newFilePath = join(uploadDir, newFileName)
    
    // 使用 sharp 压缩图片至 100KB 左右（根据质量和尺寸估算）
    try {
      await sharp(file.filepath)
        .resize({ width: 1024, withoutEnlargement: true }) // 限制宽度，避免过大
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(newFilePath)
    } catch (err) {
      console.error('图片压缩失败，回退为原图保存:', err)
      // 如果压缩失败则直接移动原文件
      await fs.rename(file.filepath, newFilePath)
    } finally {
      // 删除临时文件（sharp 完成后源文件仍存在）
      try { await fs.unlink(file.filepath) } catch {}
    }
    
    // 获取压缩后文件大小
    const { size: compressedSize } = await fs.stat(newFilePath)
    
    // 返回文件信息
    const fileUrl = `/uploads/${newFileName}`
    
    return {
      success: true,
      data: {
        url: fileUrl,
        filename: newFileName,
        originalName: file.originalFilename,
        size: file.size,
        mimetype: file.mimetype
      }
    }
    
  } catch (error: any) {
    console.error('图片上传失败:', error)
    
    // 如果是我们抛出的错误，直接返回
    if (error.statusCode) {
      throw error
    }
    
    // 其他错误
    throw createError({
      statusCode: 500,
      statusMessage: '图片上传失败'
    })
  }
})
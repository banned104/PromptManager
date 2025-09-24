import { prisma } from '~/app/lib/prisma'
import formidable from 'formidable'
import { promises as fs } from 'fs'

interface BackupData {
  version: string
  timestamp: string
  database: string
  tables: {
    prompts: Array<{
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
    }>
  }
  metadata?: {
    totalRecords: number
    backupDate: string
    description: string
  }
}

export default defineEventHandler(async (event) => {
  try {
    // 解析上传的文件
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      keepExtensions: true
    })

    const [fields, files] = await form.parse(event.node.req)
    
    if (!files.file || !files.file[0]) {
      throw createError({
        statusCode: 400,
        statusMessage: '请选择要恢复的备份文件'
      })
    }

    const uploadedFile = files.file[0]
    
    // 验证文件类型
    if (!uploadedFile.originalFilename?.toLowerCase().endsWith('.json')) {
      throw createError({
        statusCode: 400,
        statusMessage: '只支持JSON格式的备份文件'
      })
    }

    // 读取文件内容
    const fileContent = await fs.readFile(uploadedFile.filepath, 'utf-8')
    let backupData: BackupData

    try {
      backupData = JSON.parse(fileContent)
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: '备份文件格式无效'
      })
    }

    // 验证备份文件结构
    if (!backupData.tables || !backupData.tables.prompts || !Array.isArray(backupData.tables.prompts)) {
      throw createError({
        statusCode: 400,
        statusMessage: '备份文件结构无效'
      })
    }

    const replaceExisting = fields.replaceExisting?.[0] === 'true'
    let imported = 0
    let skipped = 0
    let errors: string[] = []

    // 如果选择替换现有数据，先清空数据库
    if (replaceExisting) {
      await prisma.prompt.deleteMany({})
    }

    // 导入数据
    for (const promptData of backupData.tables.prompts) {
      try {
        // 验证必填字段
        if (!promptData.title || !promptData.content) {
          errors.push(`记录 ID ${promptData.id}: 标题和内容不能为空`)
          skipped++
          continue
        }

        // 检查是否存在重复（如果不是替换模式）
        if (!replaceExisting) {
          const existing = await prisma.prompt.findFirst({
            where: {
              title: promptData.title,
              content: promptData.content
            }
          })

          if (existing) {
            skipped++
            continue
          }
        }

        // 创建新记录（不使用原ID，让数据库自动生成）
        await prisma.prompt.create({
          data: {
            title: promptData.title,
            content: promptData.content,
            imagePath: promptData.imagePath,
            images: promptData.images,
            tags: promptData.tags,
            highlights: promptData.highlights,
            isFavorited: promptData.isFavorited || false,
            // 使用原始时间戳或当前时间
            createdAt: promptData.createdAt ? new Date(promptData.createdAt) : new Date(),
            updatedAt: promptData.updatedAt ? new Date(promptData.updatedAt) : new Date()
          }
        })
        imported++
      } catch (error) {
        console.error(`导入记录失败:`, error)
        errors.push(`记录 "${promptData.title}": ${error instanceof Error ? error.message : '未知错误'}`)
        skipped++
      }
    }

    return {
      success: true,
      message: `数据库恢复完成`,
      data: {
        imported,
        skipped,
        total: backupData.tables.prompts.length,
        replaceMode: replaceExisting,
        errors: errors.length > 0 ? errors : undefined
      }
    }
  } catch (error) {
    console.error('数据库恢复失败:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '数据库恢复失败'
    })
  }
})
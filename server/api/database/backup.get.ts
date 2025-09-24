import { prisma } from '~/app/lib/prisma'
import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // 获取所有数据
    const prompts = await prisma.prompt.findMany({
      orderBy: {
        id: 'asc'
      }
    })

    // 创建备份数据结构
    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: 'sqlite',
      tables: {
        prompts: prompts.map(prompt => ({
          id: prompt.id,
          title: prompt.title,
          content: prompt.content,
          imagePath: prompt.imagePath,
          images: prompt.images,
          tags: prompt.tags,
          highlights: prompt.highlights,
          isFavorited: prompt.isFavorited,
          createdAt: prompt.createdAt.toISOString(),
          updatedAt: prompt.updatedAt.toISOString()
        }))
      },
      metadata: {
        totalRecords: prompts.length,
        backupDate: new Date().toLocaleString('zh-CN'),
        description: 'Prompt Manager 数据库完整备份'
      }
    }

    // 设置响应头
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Content-Disposition', `attachment; filename="database-backup-${timestamp}.json"`)

    return JSON.stringify(backupData, null, 2)
  } catch (error) {
    console.error('数据库备份失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '数据库备份失败'
    })
  }
})
import { prisma } from '~/app/lib/prisma'
import type { ExportData, BasePromptData, SupportedFormat, MarkdownExportOptions, JsonExportOptions } from '~/types/import-export'
import { EXPORT_FORMAT_VERSION } from '~/types/import-export'
import JSZip from 'jszip'
import { readFile } from 'fs/promises'
import { join, basename, extname } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const format = (query.format as SupportedFormat) || 'json'
    const includeImages = query.includeImages === 'true'
    const zipFormat = query.zipFormat === 'true'
    const pretty = query.pretty !== 'false' // 默认格式化
    
    // 验证格式
    if (!['json', 'markdown'].includes(format)) {
      throw createError({
        statusCode: 400,
        statusMessage: '不支持的导出格式，仅支持 json 或 markdown'
      })
    }

    // 获取所有Prompts
    const prompts = await prisma.prompt.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (prompts.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '没有可导出的数据'
      })
    }

    // 转换数据格式
    const exportPrompts: BasePromptData[] = prompts.map(prompt => ({
      title: prompt.title,
      content: prompt.content,
      imagePath: includeImages ? prompt.imagePath : undefined,
      tags: prompt.tags ? JSON.parse(prompt.tags) : undefined,
      isFavorited: prompt.isFavorited,
      createdAt: prompt.createdAt.toISOString(),
      updatedAt: prompt.updatedAt.toISOString()
    }))

    const timestamp = new Date().toISOString().split('T')[0]
    
    if (format === 'json') {
      // JSON格式导出
      const exportData: ExportData = {
        version: EXPORT_FORMAT_VERSION,
        exportedAt: new Date().toISOString(),
        totalCount: exportPrompts.length,
        prompts: exportPrompts,
        settings: {
          includeImages,
          compression: false
        },
        metadata: {
          source: 'Prompt Manager',
          description: 'Exported prompts data'
        }
      }

      const jsonContent = pretty ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData)
      
      // 设置响应头
      setHeader(event, 'Content-Type', 'application/json')
      setHeader(event, 'Content-Disposition', `attachment; filename="prompts-export-${timestamp}.json"`)
      
      return jsonContent
    } else if (format === 'markdown' && !zipFormat) {
      // Markdown格式导出（不压缩）
      const markdownContent = generateMarkdown(exportPrompts, {
        includeMetadata: true,
        includeImages,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        zipFormat: false
      })
      
      // 设置响应头
      setHeader(event, 'Content-Type', 'text/markdown')
      setHeader(event, 'Content-Disposition', `attachment; filename="prompts-export-${timestamp}.md"`)
      
      return markdownContent
    } else {
      // Markdown ZIP格式导出（包含图片）
      const zip = new JSZip()
      const markdownContent = generateMarkdown(exportPrompts, {
        includeMetadata: true,
        includeImages,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        zipFormat: true
      })
      
      // 添加Markdown文件到ZIP
      zip.file(`prompts-export-${timestamp}.md`, markdownContent)
      
      // 添加图片到ZIP
      if (includeImages) {
        const imageFolder = zip.folder('images')
        
        for (const prompt of exportPrompts) {
          if (prompt.imagePath) {
            try {
              const imagePath = join(process.cwd(), 'public', prompt.imagePath)
              const imageBuffer = await readFile(imagePath)
              const imageName = basename(prompt.imagePath)
              imageFolder?.file(imageName, imageBuffer)
            } catch (error) {
              console.warn(`Failed to read image: ${prompt.imagePath}`, error)
            }
          }
        }
      }
      
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
      
      setHeader(event, 'Content-Type', 'application/zip')
      setHeader(event, 'Content-Disposition', `attachment; filename="prompts-export-${timestamp}.zip"`)
      
      return zipBuffer
    }
  } catch (error: any) {
    console.error('导出失败:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '导出失败，请重试'
    })
  }
})

/**
 * 生成Markdown格式内容
 */
function generateMarkdown(prompts: BasePromptData[], options: MarkdownExportOptions): string {
  const { includeMetadata = true, includeImages = false, sortBy = 'createdAt', sortOrder = 'desc', zipFormat = false } = options
  
  let markdown = '# Prompt Manager 导出数据\n\n'
  
  if (includeMetadata) {
    markdown += `> 导出时间: ${new Date().toLocaleString('zh-CN')}\n`
    markdown += `> 总数量: ${prompts.length}\n`
    markdown += `> 版本: ${EXPORT_FORMAT_VERSION}\n\n`
  }
  
  // 排序
  const sortedPrompts = [...prompts].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'title':
        aValue = a.title
        bValue = b.title
        break
      case 'createdAt':
        aValue = new Date(a.createdAt || 0).getTime()
        bValue = new Date(b.createdAt || 0).getTime()
        break
      case 'updatedAt':
        aValue = new Date(a.updatedAt || 0).getTime()
        bValue = new Date(b.updatedAt || 0).getTime()
        break
      default:
        return 0
    }
    
    if (typeof aValue === 'string') {
      return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue)
    } else {
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    }
  })
  
  // 生成内容
  sortedPrompts.forEach((prompt, index) => {
    markdown += `## ${index + 1}. ${prompt.title}\n\n`
    
    // 内容
    markdown += `**内容:**\n\n${prompt.content}\n\n`
    
    // 标签
    if (prompt.tags && prompt.tags.length > 0) {
      markdown += `**标签:** ${prompt.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`
    }
    
    // 收藏状态
    if (prompt.isFavorited) {
      markdown += `**收藏:** ⭐\n\n`
    }
    
    // 图片
    if (includeImages && prompt.imagePath) {
      const imageName = basename(prompt.imagePath)
      // 当导出为ZIP时，使用相对路径；否则保持原路径
      const imagePath = zipFormat ? `images/${imageName}` : prompt.imagePath
      markdown += `**图片:** ![${imageName}](${imagePath})\n\n`
    }
    
    // 时间信息
    if (prompt.createdAt) {
      markdown += `**创建时间:** ${new Date(prompt.createdAt).toLocaleString('zh-CN')}\n\n`
    }
    
    markdown += '---\n\n'
  })
  
  return markdown
}
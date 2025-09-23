import { prisma } from '~/app/lib/prisma'
import formidable from 'formidable'
import { readFile } from 'fs/promises'
import type { 
  ImportValidationResult, 
  BasePromptData, 
  ExportData, 
  SupportedFormat,
  ImportOptions,
  FileProcessResult
} from '~/types/import-export'
import { VALIDATION_RULES, ImportErrorCode, EXPORT_FORMAT_VERSION } from '~/types/import-export'
import JSZip from 'jszip'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    // 解析上传的文件
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowEmptyFiles: false,
      filter: ({ mimetype, originalFilename }) => {
        // 允许JSON、Markdown和ZIP文件
        const allowedTypes = ['application/json', 'text/markdown', 'text/plain', 'application/zip']
        const allowedExtensions = ['.json', '.md', '.markdown', '.zip']
        
        const hasValidMimeType = allowedTypes.includes(mimetype || '')
        const hasValidExtension = allowedExtensions.some(ext => 
          originalFilename?.toLowerCase().endsWith(ext)
        )
        
        return hasValidMimeType || hasValidExtension
      }
    })

    const [fields, files] = await form.parse(event.node.req)
    
    if (!files.file || !files.file[0]) {
      throw createError({
        statusCode: 400,
        statusMessage: '请选择要导入的文件'
      })
    }

    const uploadedFile = files.file[0]
    const filename = uploadedFile.originalFilename || ''
    
    // 确定文件格式
    let format: SupportedFormat
    if (filename.toLowerCase().endsWith('.json')) {
      format = 'json'
    } else if (filename.toLowerCase().endsWith('.md') || filename.toLowerCase().endsWith('.markdown')) {
      format = 'markdown'
    } else if (filename.toLowerCase().endsWith('.zip')) {
      format = 'markdown' // ZIP文件包含Markdown内容
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: '不支持的文件格式，请选择 .json、.md 或 .zip 文件'
      })
    }

    // 读取文件内容
    let fileContent: string
    let extractedImages: string[] = []
    
    if (filename.toLowerCase().endsWith('.zip')) {
      // 处理ZIP文件
      const zipBuffer = await readFile(uploadedFile.filepath)
      const zip = new JSZip()
      const zipContent = await zip.loadAsync(zipBuffer)
      
      // 查找Markdown文件
      let markdownFile: JSZip.JSZipObject | null = null
      zipContent.forEach((relativePath, file) => {
        if (relativePath.endsWith('.md') || relativePath.endsWith('.markdown')) {
          markdownFile = file
        }
      })
      
      if (!markdownFile) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ZIP文件中未找到Markdown文件'
        })
      }
      
      fileContent = await markdownFile.async('text')
      
      // 提取图片文件
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
      
      const imagePromises: Promise<string>[] = []
      zipContent.forEach((relativePath, file) => {
        if (relativePath.startsWith('images/') && !file.dir) {
          const imageExtension = extname(relativePath).toLowerCase()
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(imageExtension)) {
            imagePromises.push(
              file.async('nodebuffer').then(async (buffer) => {
                const timestamp = Date.now()
                const imageName = `${timestamp}_${basename(relativePath)}`
                const imagePath = join(uploadDir, imageName)
                await writeFile(imagePath, buffer)
                return `/uploads/${imageName}`
              })
            )
          }
        }
      })
      
      extractedImages = await Promise.all(imagePromises)
    } else {
      fileContent = await readFile(uploadedFile.filepath, 'utf-8')
    }
    
    // 解析导入选项
    const options: ImportOptions = {
      skipDuplicates: fields.skipDuplicates?.[0] === 'true',
      updateExisting: fields.updateExisting?.[0] === 'true',
      preserveIds: false, // 总是生成新ID
      validateImages: fields.validateImages?.[0] !== 'false'
    }

    // 解析和验证数据
    const validationResult = await parseAndValidateData(fileContent, format, extractedImages)
    
    if (!validationResult.isValid) {
      return {
        success: false,
        message: '文件格式验证失败',
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        summary: validationResult.summary
      }
    }

    // 导入数据到数据库
    const importResult = await importPromptsToDatabase(validationResult.validPrompts, options)
    
    return {
      success: true,
      message: `成功导入 ${importResult.imported} 个 Prompt`,
      data: {
        imported: importResult.imported,
        skipped: importResult.skipped,
        updated: importResult.updated,
        total: validationResult.validPrompts.length
      },
      warnings: validationResult.warnings,
      summary: validationResult.summary
    }
    
  } catch (error: any) {
    console.error('导入失败:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '导入失败，请重试'
    })
  }
})

/**
 * 解析和验证数据
 */
async function parseAndValidateData(content: string, format: SupportedFormat, extractedImages: string[] = []): Promise<ImportValidationResult> {
  const result: ImportValidationResult = {
    isValid: false,
    errors: [],
    warnings: [],
    validPrompts: [],
    invalidPrompts: [],
    summary: {
      total: 0,
      valid: 0,
      invalid: 0
    }
  }

  try {
    let prompts: BasePromptData[] = []
    
    if (format === 'json') {
      // 解析JSON格式
      const jsonData = JSON.parse(content)
      
      // 检查是否是标准导出格式
      if (jsonData.version && jsonData.prompts) {
        // 标准格式
        const exportData = jsonData as ExportData
        prompts = exportData.prompts
        
        // 版本兼容性检查
        if (exportData.version !== EXPORT_FORMAT_VERSION) {
          result.warnings.push(`文件版本 (${exportData.version}) 与当前版本 (${EXPORT_FORMAT_VERSION}) 不匹配，可能存在兼容性问题`)
        }
      } else if (Array.isArray(jsonData)) {
        // 简单数组格式
        prompts = jsonData
      } else {
        result.errors.push('无效的JSON格式，期望包含 prompts 数组或直接为 Prompt 数组')
        return result
      }
    } else {
      // 解析Markdown格式
      prompts = parseMarkdownContent(content)
      
      // 如果有提取的图片，更新图片路径
      if (extractedImages.length > 0) {
        let imageIndex = 0
        prompts.forEach(prompt => {
          if (prompt.imagePath && imageIndex < extractedImages.length) {
            prompt.imagePath = extractedImages[imageIndex]
            imageIndex++
          }
        })
      }
    }

    result.summary.total = prompts.length
    
    // 验证每个Prompt
    prompts.forEach((prompt, index) => {
      const validation = validatePromptData(prompt, index)
      
      if (validation.isValid) {
        result.validPrompts.push(prompt)
        result.summary.valid++
      } else {
        result.invalidPrompts.push({
          index,
          data: prompt,
          errors: validation.errors
        })
        result.errors.push(...validation.errors.map(err => `第 ${index + 1} 项: ${err}`))
        result.summary.invalid++
      }
    })

    result.isValid = result.validPrompts.length > 0
    
    if (result.summary.invalid > 0) {
      result.warnings.push(`${result.summary.invalid} 个项目验证失败，将被跳过`)
    }
    
  } catch (error: any) {
    result.errors.push(`解析文件失败: ${error.message}`)
  }

  return result
}

/**
 * 验证单个Prompt数据
 */
function validatePromptData(prompt: any, index: number): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // 检查必填字段
  if (!prompt.title || typeof prompt.title !== 'string') {
    errors.push('标题不能为空且必须为字符串')
  } else if (prompt.title.length > VALIDATION_RULES.title.maxLength) {
    errors.push(`标题长度不能超过 ${VALIDATION_RULES.title.maxLength} 个字符`)
  }
  
  if (!prompt.content || typeof prompt.content !== 'string') {
    errors.push('内容不能为空且必须为字符串')
  } else if (prompt.content.length > VALIDATION_RULES.content.maxLength) {
    errors.push(`内容长度不能超过 ${VALIDATION_RULES.content.maxLength} 个字符`)
  }
  
  // 检查可选字段
  if (prompt.tags && !Array.isArray(prompt.tags)) {
    errors.push('标签必须为数组格式')
  } else if (prompt.tags && prompt.tags.length > VALIDATION_RULES.tags.maxCount) {
    errors.push(`标签数量不能超过 ${VALIDATION_RULES.tags.maxCount} 个`)
  }
  
  // 验证多图片字段
  if (prompt.images && !Array.isArray(prompt.images)) {
    errors.push('图片列表必须为数组格式')
  } else if (prompt.images && prompt.images.length > VALIDATION_RULES.images.maxCount) {
    errors.push(`图片数量不能超过 ${VALIDATION_RULES.images.maxCount} 张`)
  }
  
  if (prompt.isFavorited !== undefined && typeof prompt.isFavorited !== 'boolean') {
    errors.push('收藏状态必须为布尔值')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 解析Markdown内容
 */
function parseMarkdownContent(content: string): BasePromptData[] {
  const prompts: BasePromptData[] = []
  const sections = content.split(/^##\s+/m).filter(section => section.trim())
  
  sections.forEach(section => {
    const lines = section.split('\n')
    const titleMatch = lines[0]?.match(/^\d+\.\s*(.+)$/)
    
    if (!titleMatch) return
    
    const prompt: BasePromptData = {
      title: titleMatch[1].trim(),
      content: '',
      tags: [],
      isFavorited: false
    }
    
    let currentField = ''
    let contentLines: string[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.startsWith('**内容:**')) {
        currentField = 'content'
        continue
      } else if (line.startsWith('**标签:**')) {
        currentField = 'tags'
        const tagMatch = line.match(/\*\*标签:\*\*\s*(.+)/)
        if (tagMatch) {
          prompt.tags = tagMatch[1].split(',').map(tag => tag.replace(/`/g, '').trim()).filter(Boolean)
        }
        continue
      } else if (line.startsWith('**收藏:**')) {
        prompt.isFavorited = line.includes('⭐')
        continue
      } else if (line.startsWith('**图片:**') || line.startsWith('**图片 (')) {
        if (line.includes('张):')) {
          // 多图片格式：**图片 (3张):**
          currentField = 'images'
          prompt.images = []
          continue
        } else {
          // 单图片格式：**图片:** ![name](path)
          const imageMatch = line.match(/\*\*图片:\*\*\s*(.+)/)
          if (imageMatch) {
            const imgMatch = imageMatch[1].match(/!\[.*?\]\((.+?)\)/)
            if (imgMatch) {
              prompt.imagePath = imgMatch[1].trim()
              prompt.images = [imgMatch[1].trim()]
            }
          }
          continue
        }
      } else if (currentField === 'images' && line.match(/^\d+\.\s*!\[.*?\]\(.+?\)/)) {
        // 解析多图片列表项：1. ![name](path)
        const imgMatch = line.match(/!\[.*?\]\((.+?)\)/)
        if (imgMatch && prompt.images) {
          prompt.images.push(imgMatch[1].trim())
          if (!prompt.imagePath) {
            prompt.imagePath = imgMatch[1].trim() // 第一张图片作为主图片
          }
        }
        continue
      } else if (line.startsWith('**创建时间:**')) {
        continue
      } else if (line === '---') {
        break
      }
      
      if (currentField === 'content' && line) {
        contentLines.push(line)
      }
    }
    
    prompt.content = contentLines.join('\n').trim()
    
    if (prompt.title && prompt.content) {
      prompts.push(prompt)
    }
  })
  
  return prompts
}

/**
 * 导入Prompts到数据库
 */
async function importPromptsToDatabase(prompts: BasePromptData[], options: ImportOptions) {
  let imported = 0
  let skipped = 0
  let updated = 0
  
  for (const prompt of prompts) {
    try {
      // 检查是否存在重复
      if (options.skipDuplicates) {
        const existing = await prisma.prompt.findFirst({
          where: {
            title: prompt.title,
            content: prompt.content
          }
        })
        
        if (existing) {
          if (options.updateExisting) {
            // 更新现有记录
            await prisma.prompt.update({
              where: { id: existing.id },
              data: {
                title: prompt.title,
                content: prompt.content,
                imagePath: prompt.imagePath, // 向后兼容
                images: prompt.images ? JSON.stringify(prompt.images) : null, // 新的多图片字段
                tags: prompt.tags ? JSON.stringify(prompt.tags) : null,
                isFavorited: prompt.isFavorited || false
              }
            })
            updated++
          } else {
            skipped++
          }
          continue
        }
      }
      
      // 创建新记录
      await prisma.prompt.create({
        data: {
          title: prompt.title,
          content: prompt.content,
          imagePath: prompt.imagePath, // 向后兼容
          images: prompt.images ? JSON.stringify(prompt.images) : null, // 新的多图片字段
          tags: prompt.tags ? JSON.stringify(prompt.tags) : null,
          isFavorited: prompt.isFavorited || false
        }
      })
      imported++
      
    } catch (error) {
      console.error('导入单个Prompt失败:', error)
      skipped++
    }
  }
  
  return { imported, skipped, updated }
}
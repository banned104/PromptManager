import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // 验证必填字段
    if (!body.title || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: '标题和内容不能为空'
      })
    }
    
    const newPrompt = await prisma.prompt.create({
      data: {
        title: body.title,
        content: body.content,
        imagePath: body.imagePath || null, // 向后兼容
        images: body.images ? JSON.stringify(body.images) : null, // 新的多图片字段
        tags: body.tags ? JSON.stringify(body.tags) : null,
        highlights: body.highlights ? JSON.stringify(body.highlights) : null
      }
    })
    
    return {
      success: true,
      data: newPrompt
    }
  } catch (error: any) {
    console.error('创建Prompt失败:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '创建Prompt失败'
    })
  }
})
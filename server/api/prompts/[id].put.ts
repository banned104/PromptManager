import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: '无效的ID参数'
      })
    }
    
    // 检查Prompt是否存在
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id: Number(id) }
    })
    
    if (!existingPrompt) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Prompt不存在'
      })
    }
    
    // 准备更新数据
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.content !== undefined) updateData.content = body.content
    if (body.imagePath !== undefined) updateData.imagePath = body.imagePath
    if (body.tags !== undefined) updateData.tags = body.tags ? JSON.stringify(body.tags) : null
    
    const updatedPrompt = await prisma.prompt.update({
      where: { id: Number(id) },
      data: updateData
    })
    
    return {
      success: true,
      data: updatedPrompt
    }
  } catch (error: any) {
    console.error('更新Prompt失败:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '更新Prompt失败'
    })
  }
})
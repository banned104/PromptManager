import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
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
    
    // 删除Prompt
    await prisma.prompt.delete({
      where: { id: Number(id) }
    })
    
    return {
      success: true,
      message: 'Prompt删除成功'
    }
  } catch (error: any) {
    console.error('删除Prompt失败:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '删除Prompt失败'
    })
  }
})
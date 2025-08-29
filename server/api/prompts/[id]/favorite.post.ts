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
    
    // 切换收藏状态
    const updatedPrompt = await prisma.prompt.update({
      where: { id: Number(id) },
      data: {
        isFavorited: !existingPrompt.isFavorited
      }
    })
    
    return {
      success: true,
      data: updatedPrompt,
      message: updatedPrompt.isFavorited ? '已添加到收藏' : '已取消收藏'
    }
  } catch (error: any) {
    console.error('切换收藏状态失败:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '切换收藏状态失败'
    })
  }
})
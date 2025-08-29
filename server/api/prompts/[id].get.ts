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
    
    const prompt = await prisma.prompt.findUnique({
      where: {
        id: Number(id)
      }
    })
    
    if (!prompt) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Prompt不存在'
      })
    }
    
    return {
      success: true,
      data: prompt
    }
  } catch (error: any) {
    console.error('获取Prompt失败:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '获取Prompt失败'
    })
  }
})
import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const prompts = await prisma.prompt.findMany({
      where: {
        isFavorited: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return {
      success: true,
      data: prompts,
      count: prompts.length
    }
  } catch (error) {
    console.error('获取收藏Prompts失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取收藏Prompts失败'
    })
  }
})
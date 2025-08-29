import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const prompts = await prisma.prompt.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return {
      success: true,
      data: prompts
    }
  } catch (error) {
    console.error('获取Prompts失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取Prompts失败'
    })
  }
})
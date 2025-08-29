import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const searchTerm = query.q as string
    
    if (!searchTerm || searchTerm.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: '搜索关键词不能为空'
      })
    }
    
    // 使用Prisma进行模糊搜索（SQLite不支持mode: 'insensitive'）
    const prompts = await prisma.prompt.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm
            }
          },
          {
            content: {
              contains: searchTerm
            }
          },
          {
            tags: {
              contains: searchTerm
            }
          }
        ]
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
  } catch (error: any) {
    console.error('搜索Prompts失败:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '搜索失败'
    })
  }
})
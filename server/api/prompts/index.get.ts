import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const search = query.search as string || ''
    const favorites = query.favorites === 'true'
    const sortOrder = query.sort as 'asc' | 'desc' || 'desc'
    
    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (favorites) {
      where.isFavorited = true
    }
    
    // 获取所有数据
    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: {
        createdAt: sortOrder
      }
    })
    

    
    return {
      success: true,
      data: prompts,
      pagination: {
        total: prompts.length,
        hasNext: false,
        hasPrev: false
      }
    }
  } catch (error) {
    console.error('获取Prompts失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取Prompts失败'
    })
  }
})
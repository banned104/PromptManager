import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 12
    const search = query.search as string || ''
    const favorites = query.favorites === 'true'
    const sortOrder = query.sort as 'asc' | 'desc' || 'desc'
    
    const skip = (page - 1) * limit
    
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
    
    // 获取总数
    const total = await prisma.prompt.count({ where })
    
    // 获取分页数据
    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: {
        createdAt: sortOrder
      },
      skip,
      take: limit
    })
    
    return {
      success: true,
      data: prompts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
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
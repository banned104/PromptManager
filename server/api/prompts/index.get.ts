import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔄 开始获取Prompts数据...')
    const query = getQuery(event)
    const search = query.search as string || ''
    const favorites = query.favorites === 'true'
    const sortOrder = query.sort as 'asc' | 'desc' || 'desc'
    
    console.log(`📋 查询参数: search="${search}", favorites=${favorites}, sort=${sortOrder}`)
    
    // 强制刷新数据库连接
    await prisma.$disconnect()
    await prisma.$connect()
    console.log('✅ 数据库连接已刷新')
    
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
    
    console.log(`📊 查询结果: ${prompts.length} 条记录`)
    if (prompts.length > 0) {
      console.log(`📝 示例记录: ID=${prompts[0].id}, Title="${prompts[0].title}"`)
    }
    
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
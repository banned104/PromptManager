import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔄 开始获取数据库信息...')
    const query = getQuery(event)
    const includeData = query.includeData === 'true'
    
    // 强制刷新数据库连接
    await prisma.$disconnect()
    await prisma.$connect()
    console.log('✅ 数据库连接已刷新')
    
    // 获取统计信息
    console.log('📊 正在统计数据...')
    const totalCount = await prisma.prompt.count()
    console.log(`📋 总记录数: ${totalCount}`)
    const favoritedCount = await prisma.prompt.count({
      where: { isFavorited: true }
    })
    
    // 获取最新和最旧的记录时间
    const [newest, oldest] = await Promise.all([
      prisma.prompt.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      }),
      prisma.prompt.findFirst({
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true }
      })
    ])

    // 获取标签统计
    const allPrompts = await prisma.prompt.findMany({
      select: { tags: true },
      where: { tags: { not: null } }
    })

    const tagStats = new Map<string, number>()
    allPrompts.forEach(prompt => {
      if (prompt.tags) {
        try {
          const tags = JSON.parse(prompt.tags) as string[]
          tags.forEach(tag => {
            tagStats.set(tag, (tagStats.get(tag) || 0) + 1)
          })
        } catch {
          // 忽略解析错误
        }
      }
    })

    const result: any = {
      success: true,
      data: {
        statistics: {
          totalRecords: totalCount,
          favoritedRecords: favoritedCount,
          uniqueTags: tagStats.size,
          newestRecord: newest?.createdAt?.toISOString(),
          oldestRecord: oldest?.createdAt?.toISOString()
        },
        tagStats: Object.fromEntries(
          Array.from(tagStats.entries()).sort((a, b) => b[1] - a[1])
        )
      }
    }

    // 如果需要包含完整数据
    if (includeData) {
      const allData = await prisma.prompt.findMany({
        orderBy: { id: 'asc' }
      })
      result.data.records = allData
    }

    return result
  } catch (error) {
    console.error('获取数据库信息失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取数据库信息失败'
    })
  }
})
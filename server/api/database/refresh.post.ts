import { prisma } from '~/app/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`
    
    // 获取最新的统计信息
    const totalCount = await prisma.prompt.count()
    
    return {
      success: true,
      message: '数据库连接已刷新',
      data: {
        timestamp: new Date().toISOString(),
        totalRecords: totalCount,
        status: 'connected'
      }
    }
  } catch (error) {
    console.error('数据库刷新失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '数据库刷新失败'
    })
  }
})
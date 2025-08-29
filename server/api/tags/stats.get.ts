export default defineEventHandler(async (event) => {
  try {
    const { prisma } = await import('~/app/lib/prisma')
    
    // 获取所有 prompts 的 tags
    const prompts = await prisma.prompt.findMany({
      select: {
        tags: true
      },
      where: {
        tags: {
          not: null
        }
      }
    })
    
    // 统计标签使用频次
    const tagStats = new Map<string, number>()
    
    prompts.forEach(prompt => {
      if (prompt.tags) {
        try {
          const tags = JSON.parse(prompt.tags) as string[]
          tags.forEach(tag => {
            const trimmedTag = tag.trim()
            if (trimmedTag) {
              tagStats.set(trimmedTag, (tagStats.get(trimmedTag) || 0) + 1)
            }
          })
        } catch {
          // 忽略解析错误的标签
        }
      }
    })
    
    // 转换为数组并按使用次数排序
    const sortedTags = Array.from(tagStats.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
    
    return {
      success: true,
      data: sortedTags
    }
    
  } catch (error: any) {
    console.error('获取标签统计失败:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: '获取标签统计失败'
    })
  }
})
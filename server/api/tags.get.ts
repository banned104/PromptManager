import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // 获取所有prompt的标签
    const prompts = await prisma.prompt.findMany({
      select: {
        tags: true
      }
    })

    // 统计标签使用频率
    const tagCountMap = new Map<string, number>()

    prompts.forEach(prompt => {
      if (prompt.tags) {
        try {
          const tags = typeof prompt.tags === 'string' 
            ? JSON.parse(prompt.tags) 
            : prompt.tags
          
          if (Array.isArray(tags)) {
            tags.forEach(tag => {
              const cleanTag = tag.trim()
              if (cleanTag) {
                tagCountMap.set(cleanTag, (tagCountMap.get(cleanTag) || 0) + 1)
              }
            })
          }
        } catch {
          // 如果不是JSON，按逗号分割
          const tags = prompt.tags.split(',').map((tag: string) => tag.trim())
          tags.forEach(tag => {
            if (tag) {
              tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1)
            }
          })
        }
      }
    })

    // 按使用频率排序
    const sortedTags = Array.from(tagCountMap.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([tag, count]) => ({ tag, count }))

    return {
      success: true,
      tags: sortedTags
    }
  } catch (error) {
    console.error('获取标签失败:', error)
    return {
      success: false,
      error: '获取标签失败'
    }
  }
})
/**
 * 安全解析tags字段，处理各种可能的格式
 */
export function parseTags(tags: any): string[] {
  if (!tags) return []
  
  // 如果已经是数组，直接返回
  if (Array.isArray(tags)) {
    return tags.filter(tag => typeof tag === 'string' && tag.trim())
  }
  
  // 如果是字符串，尝试解析
  if (typeof tags === 'string') {
    try {
      let parsed = JSON.parse(tags)
      
      // 处理双重JSON编码的情况
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed)
      }
      
      // 如果解析后是数组，返回过滤后的结果
      if (Array.isArray(parsed)) {
        return parsed.filter(tag => typeof tag === 'string' && tag.trim())
      }
      
      // 如果解析后是单个字符串，包装成数组
      if (typeof parsed === 'string') {
        return [parsed].filter(tag => tag.trim())
      }
    } catch {
      // JSON解析失败，按逗号分割处理
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }
  }
  
  return []
}

/**
 * 安全序列化tags为JSON字符串
 */
export function serializeTags(tags: string[]): string | null {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return null
  }
  
  const cleanTags = tags.filter(tag => typeof tag === 'string' && tag.trim())
  return cleanTags.length > 0 ? JSON.stringify(cleanTags) : null
}

/**
 * 检查tags是否包含指定标签（不区分大小写）
 */
export function hasTag(tags: any, targetTag: string): boolean {
  const parsedTags = parseTags(tags)
  return parsedTags.some(tag => tag.toLowerCase() === targetTag.toLowerCase())
}
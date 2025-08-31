interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize = 100 // 最大缓存条目数

  set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void { // 默认5分钟TTL
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    
    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // 清理过期缓存
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

const cache = new SimpleCache()

// 定期清理过期缓存
if (process.client) {
  setInterval(() => {
    cache.cleanup()
  }, 60000) // 每分钟清理一次
}

export const useCache = () => {
  const generateCacheKey = (url: string, params?: Record<string, any>): string => {
    const paramStr = params ? JSON.stringify(params) : ''
    return `${url}:${paramStr}`
  }

  const cachedFetch = async <T>(
    url: string, 
    options: {
      params?: Record<string, any>
      ttl?: number
      force?: boolean
    } = {}
  ): Promise<T> => {
    const { params, ttl = 5 * 60 * 1000, force = false } = options
    const cacheKey = generateCacheKey(url, params)

    // 如果不强制刷新且缓存存在，返回缓存数据
    if (!force && cache.has(cacheKey)) {
      const cachedData = cache.get<T>(cacheKey)
      if (cachedData) {
        return cachedData
      }
    }

    // 发起请求
    const data = await $fetch<T>(url, { params })
    
    // 缓存数据
    cache.set(cacheKey, data, ttl)
    
    return data
  }

  const invalidateCache = (pattern?: string): void => {
    if (!pattern) {
      cache.clear()
      return
    }

    // 删除匹配模式的缓存
    for (const key of cache['cache'].keys()) {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    }
  }

  return {
    cachedFetch,
    invalidateCache,
    cache
  }
}
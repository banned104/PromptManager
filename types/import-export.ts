// 导入导出数据格式定义
// 遵循可扩展性原则，支持版本控制和向后兼容

/**
 * 导入导出格式版本
 */
export const EXPORT_FORMAT_VERSION = '1.0.0'

/**
 * 支持的文件格式
 */
export type SupportedFormat = 'json' | 'markdown' | 'markdown-zip'

/**
 * 基础Prompt数据结构
 */
export interface BasePromptData {
  title: string
  content: string
  imagePath?: string  // 向后兼容，单图片路径
  images?: string[]   // 新增：多图片路径数组
  tags?: string[]
  isFavorited?: boolean
  createdAt?: string
  updatedAt?: string
  // 预留扩展字段
  metadata?: Record<string, any>
}

/**
 * 导出数据结构
 */
export interface ExportData {
  version: string
  exportedAt: string
  totalCount: number
  prompts: BasePromptData[]
  // 预留扩展字段
  settings?: {
    includeImages?: boolean
    compression?: boolean
    [key: string]: any
  }
  // 元数据信息
  metadata?: {
    exportedBy?: string
    source?: string
    description?: string
    [key: string]: any
  }
}

/**
 * 导入验证结果
 */
export interface ImportValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  validPrompts: BasePromptData[]
  invalidPrompts: Array<{
    index: number
    data: any
    errors: string[]
  }>
  summary: {
    total: number
    valid: number
    invalid: number
  }
}

/**
 * Markdown导出配置
 */
export interface MarkdownExportOptions {
  includeMetadata?: boolean
  includeImages?: boolean
  groupByTags?: boolean
  sortBy?: 'title' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  zipFormat?: boolean
}

/**
 * JSON导出配置
 */
export interface JsonExportOptions {
  pretty?: boolean
  includeMetadata?: boolean
  compression?: boolean
}

/**
 * 导入选项
 */
export interface ImportOptions {
  skipDuplicates?: boolean
  updateExisting?: boolean
  preserveIds?: boolean
  validateImages?: boolean
}

/**
 * 文件处理结果
 */
export interface FileProcessResult {
  success: boolean
  message: string
  data?: any
  errors?: string[]
  warnings?: string[]
}

/**
 * 导入导出统计信息
 */
export interface ImportExportStats {
  operation: 'import' | 'export'
  format: SupportedFormat
  timestamp: string
  duration: number
  itemCount: number
  success: boolean
  errors?: string[]
}

/**
 * 数据验证规则
 */
export const VALIDATION_RULES = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  content: {
    required: true,
    minLength: 1,
    maxLength: 10000
  },
  tags: {
    maxCount: 20,
    maxLength: 50
  },
  imagePath: {
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  images: {
    maxCount: 10,
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  }
} as const

/**
 * 错误代码定义
 */
export enum ImportErrorCode {
  INVALID_FORMAT = 'INVALID_FORMAT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_DATA_TYPE = 'INVALID_DATA_TYPE',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_VERSION = 'UNSUPPORTED_VERSION'
}

/**
 * 导出错误代码
 */
export enum ExportErrorCode {
  NO_DATA = 'NO_DATA',
  GENERATION_FAILED = 'GENERATION_FAILED',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR'
}
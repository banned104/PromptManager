// Civitai API 类型定义

export interface CivitaiImage {
  id: number
  url: string
  hash: string
  width: number
  height: number
  nsfw: boolean
  nsfwLevel: number
  createdAt: string
  postId?: number
  stats?: {
    cryCount: number
    laughCount: number
    likeCount: number
    dislikeCount: number
    heartCount: number
    commentCount: number
  }
  meta?: {
    prompt?: string
    negativePrompt?: string
    cfgScale?: number
    steps?: number
    sampler?: string
    seed?: number
    [key: string]: any
  }
}

export interface CivitaiModelVersion {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  trainedWords: string[]
  baseModel: string
  earlyAccessTimeFrame: number
  downloadUrl: string
  files: {
    id: number
    url: string
    sizeKB: number
    name: string
    type: string
    pickleScanResult: string
    pickleScanMessage?: string
    virusScanResult: string
    virusScanMessage?: string
    scannedAt: string
    hashes: {
      AutoV1?: string
      AutoV2?: string
      SHA256?: string
      CRC32?: string
      BLAKE3?: string
    }
    downloadUrl: string
    primary: boolean
  }[]
  images: CivitaiImage[]
  stats: {
    downloadCount: number
    ratingCount: number
    rating: number
  }
}

export interface CivitaiModel {
  id: number
  name: string
  description: string
  type: string
  poi: boolean
  nsfw: boolean
  allowNoCredit: boolean
  allowCommercialUse: string
  allowDerivatives: boolean
  allowDifferentLicense: boolean
  stats: {
    downloadCount: number
    favoriteCount: number
    commentCount: number
    ratingCount: number
    rating: number
  }
  creator: {
    username: string
    image?: string
  }
  tags: string[]
  modelVersions: CivitaiModelVersion[]
}

export interface CivitaiApiResponse {
  items: CivitaiModel[]
  metadata: {
    totalItems: number
    currentPage: number
    pageSize: number
    totalPages: number
    nextPage?: string
    prevPage?: string
  }
}

// 用于组件状态的类型
export interface CivitaiLoraState {
  visible: boolean
  loading: boolean
  error: string | null
  modelData: CivitaiModel | null
  inputUrl: string
}

// 用于浮窗位置的类型
export interface FloatingWindowPosition {
  x: number
  y: number
}

// 图片参数提取结果
export interface ImageParams {
  prompt: string
  negativePrompt: string
  steps: number | null
  cfgScale: number | null
  sampler: string
  seed: number | null
  size: string
  imageUrl: string
  imageId: number
}

// 带参数的图片信息
export interface CivitaiImageWithParams extends CivitaiImage {
  params: ImageParams
}

// 扩展的模型信息（包含所有图片和参数）
export interface CivitaiModelWithImages extends CivitaiModel {
  allImages?: CivitaiImageWithParams[]
}
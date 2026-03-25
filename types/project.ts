export type ProjectStatus = 'generating' | 'completed' | 'failed'

export interface GeneratedProject {
  id: string
  title: string
  imageUrl: string
  thumbnailUrl: string
  status: ProjectStatus
  sourceAdId: string
  productId: string
  hasWatermark: boolean
  createdAt: string
  type: 'image'
}

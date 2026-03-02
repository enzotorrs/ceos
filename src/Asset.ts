export interface AssetUser {
  id: number
  username: string
  avatarFilename: string | null
}

export interface Comment {
  id: number
  content: string
  assetId: number
  userId: number
  user: AssetUser
  createdAt: string
}

export interface Asset {
  name: string
  filename: string
  parentAssetId: number
  folder: boolean
  id: number
  userId: number
  user?: AssetUser
  status: 'uploading' | 'success' | null
  childAssets: Asset[]
  createdAt: string
  updatedAt: string
}

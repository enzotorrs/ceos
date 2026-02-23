export interface AssetUser {
  id: number
  username: string
  avatarFilename: string | null
}

export interface Asset {
  name: string
  filename: string
  parentAssetId: number
  folder: boolean
  id: number
  userId: number
  user?: AssetUser
  childAssets: Asset[]
  createdAt: string
  updatedAt: string
}

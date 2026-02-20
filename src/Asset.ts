export interface Asset  {
  name: string
  filename: string
  parentAssetId: number
  folder: boolean
  id: number
  childAssets: Asset[]
  createdAt: string
  updatedAt: string
}


export interface Asset  {
  name: string
  parentAssetId: number
  folder: boolean
  id: number
  childAssets: Asset[]
  createdAt: string
  updatedAt: string
}


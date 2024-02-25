/* eslint-disable */
export interface Asset  {
  name: string
  parent_asset_id: number
  folder: boolean
  id: number
  child_assets: Asset[]
  created_at: string
  updated_at: string
}

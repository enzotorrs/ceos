import { defineStore } from "pinia";
import { apiClient } from '@/services/apiClient'
import type { Asset } from "@/Asset";

export const useAssets = defineStore("assets", {
  state: () => ({
    assets: [] as Asset[],
    page: 1,
    pageSize: 10,
    totalItems: 10,
    totalPages: 10,
    currentFolderId: null as number | null,
    folderPath: [{ id: null as number | null, name: 'Root' }]
  }),
  actions: {
    async loadAssets() {
      const params: Record<string, unknown> = {
        page: this.page,
        page_size: this.pageSize
      }

      if (this.currentFolderId !== null) {
        params.parentAssetId = this.currentFolderId
      }

      const response = await apiClient.get('/asset', {params} )
      this.assets = response.data.data
      this.totalItems = response.data.meta.total
      this.totalPages = response.data.meta.lastPage
    },
    async navigateTo(folder: Asset) {
      this.folderPath.push({ id: folder.id, name: folder.name })
      this.currentFolderId = folder.id
      this.page = 1
      await this.loadAssets()
    },
    async navigateToBreadcrumb(index: number) {
      this.folderPath = this.folderPath.slice(0, index + 1)
      this.currentFolderId = this.folderPath[index].id
      this.page = 1
      await this.loadAssets()
    },
    async deleteAsset(id: number) {
      await apiClient.delete(`/asset/${id}`);
    },
    renameAsset(id: number, newName: string) {
      apiClient.patch(`/asset/${id}`, { name: newName }).then(response => {
        const index = this.assets.findIndex(asset => asset.id === id);
        this.assets[index] = response.data.data;
      });
    },
    async createAsset(asset: Asset) {
      const newAsset = await apiClient.post('/asset', asset)
      this.loadAssets()
      return newAsset.data
    },
  }
});

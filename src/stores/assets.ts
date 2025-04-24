import { defineStore } from "pinia";
import { apiClient } from '@/services/ApiClient'
import { Asset } from "@/Asset";

export const useAssets = defineStore("assets", {
  state: () => ({
    assets: [] as Asset[],
    page: 1,
    pageSize: 10,
    totalItems: 10,
    totalPages: 10
  }),
  actions: {
    async loadAssets() {
      const params = {
        page: this.page,
        pageSize:this.pageSize
      }

      const response = await apiClient.get('/asset', {params} )
      this.assets = response.data.assets
      this.totalItems = response.data.totalItems
      this.totalPages = response.data.totalPages
    },
    async deleteAsset(id: number) {
      await apiClient.delete(`/asset/${id}`);
    },
    renameAsset(id: number, newName: string) {
      apiClient.patch(`/asset/${id}`, { name: newName }).then(response => {
        const index = this.assets.findIndex(asset => asset.id === id);
        this.assets[index] = response.data;
      });
    },
    async createAsset(asset: Asset) {
      const newAsset = await apiClient.post('/asset', asset)
      this.loadAssets()
      return newAsset.data
    },
  }
});

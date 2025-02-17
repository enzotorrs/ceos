import { defineStore } from "pinia";
import { apiClient } from '@/services/ApiClient'
import { Asset } from "@/Asset";

export const useAssets = defineStore("assets", {
  state: () => ({
    assets: [] as Asset[]
  }),
  actions: {
    loadAssets() {
      apiClient
        .get('/asset')
        .then(response => this.assets = response.data);
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

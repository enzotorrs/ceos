import { defineStore } from "pinia";
import { apiClient } from '@/services/apiClient'
import type { Asset } from "@/Asset";

export const useAssets = defineStore("assets", {
  state: () => ({
    assets: [] as Asset[],
    page: 1,
    pageSize: 30,
    totalItems: 0,
    totalPages: 1,
    loading: false,
    currentFolderId: null as number | null,
    folderPath: [{ id: null as number | null, name: 'Root' }]
  }),
  getters: {
    hasMore: (state) => state.page < state.totalPages
  },
  actions: {
    async loadAssets() {
      this.page = 1
      this.loading = true
      const params: Record<string, unknown> = {
        page: 1,
        page_size: this.pageSize
      }

      if (this.currentFolderId !== null) {
        params.parentAssetId = this.currentFolderId
      }

      try {
        const response = await apiClient.get('/asset', { params })
        this.assets = response.data.data
        this.totalItems = response.data.meta.total
        this.totalPages = response.data.meta.lastPage
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      if (!this.hasMore || this.loading) return
      this.page++
      this.loading = true
      const params: Record<string, unknown> = {
        page: this.page,
        page_size: this.pageSize
      }

      if (this.currentFolderId !== null) {
        params.parentAssetId = this.currentFolderId
      }

      try {
        const response = await apiClient.get('/asset', { params })
        this.assets.push(...response.data.data)
        this.totalItems = response.data.meta.total
        this.totalPages = response.data.meta.lastPage
      } finally {
        this.loading = false
      }
    },
    async navigateTo(folder: Asset) {
      this.folderPath.push({ id: folder.id, name: folder.name })
      this.currentFolderId = folder.id
      await this.loadAssets()
    },
    async navigateToBreadcrumb(index: number) {
      this.folderPath = this.folderPath.slice(0, index + 1)
      this.currentFolderId = this.folderPath[index].id
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
      return newAsset.data
    },
    async moveAsset(id: number, parentAssetId: number) {
      await apiClient.patch(`/asset/${id}`, { parentAssetId })
      await this.loadAssets()
    },
    async patchAssetStatus(id: number, status: 'uploading' | 'success') {
      await apiClient.patch(`/asset/${id}`, { status })
    },
  }
});

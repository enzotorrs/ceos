import { defineStore } from "pinia";
import axios from "axios";
import { Asset } from "@/Asset";

export const useAssets = defineStore("assets", {
  state: () => ({
    assets: [] as Asset[]
  }),
  actions: {
    loadAssets() {
      console.log(import.meta.env.VITE_API_URL)
      axios
        .get(`${import.meta.env.VITE_API_URL}/asset`)
        .then(response => this.assets = response.data);
    },
    async deleteAsset(id: number) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/asset/${id}`);
    },
    renameAsset(id: number, newName: string) {
      axios.patch(`${import.meta.env.VITE_API_URL}/asset/${id}`, {name: newName}).then(response => {
        const index = this.assets.findIndex(asset => asset.id === id);
        this.assets[index] = response.data;
      });
    },
    async createAsset(asset: Asset){
      const newAsset = await axios.post(`${import.meta.env.VITE_API_URL}/asset/`, asset)
      this.loadAssets()
      return newAsset.data
    },
  }
});

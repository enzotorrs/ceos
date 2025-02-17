import { defineStore } from "pinia";
import axios from "axios";
import { Asset } from "@/Asset";

export const useAssets = defineStore("assets", {
  state: () => ({
    assets: [] as Asset[]
  }),
  actions: {
    loadAssets() {
      axios
        .get("http://localhost:3000/asset")
        .then(response => this.assets = response.data);
    },
    async deleteAsset(id: number) {
      await axios.delete(`http://localhost:3000/asset/${id}`);
    },
    renameAsset(id: number, newName: string) {
      axios.patch(`http://localhost:3000/asset/${id}`, {name: newName}).then(response => {
        const index = this.assets.findIndex(asset => asset.id === id);
        this.assets[index] = response.data;
      });
    },
    async createAsset(asset: Asset){
      const newAsset = await axios.post(`http://localhost:3000/asset/`, asset)
      this.loadAssets()
      return newAsset.data
    },
  }
});

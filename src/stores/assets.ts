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
        .get("http://localhost:8000/assets")
        .then(response => this.assets = response.data);
    },
    async deleteAsset(id: number) {
      await axios.delete(`http://localhost:8000/assets/${id}`);
    },
    renameAsset(id: number, newName: string) {
      const asset = this.assets.find(asset => asset.id === id);
      asset.name = newName;
      axios.put(`http://localhost:8000/assets/${id}`, asset).then(response => {
        const index = this.assets.findIndex(asset => asset.id === id);
        this.assets[index] = response.data;
      });
    }

  }
});

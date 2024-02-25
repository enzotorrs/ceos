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
    async deleteAsset(id: number){
      await axios.delete(`http://localhost:8000/assets/${id}`)
    }
  }
});

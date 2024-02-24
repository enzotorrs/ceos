<template>
  <div class="grid_background">
    <div class="grid">
      <AssetComponent v-for="asset in assets" :key="asset.id" :asset=asset />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { Asset } from '../Asset'
import AssetComponent from './Asset.vue'
export default defineComponent({
  name: 'GridAsset',
  components: {
    AssetComponent
  },
  data() {
    return {
      assets: [] as Asset[]
    }
  },

  mounted() {
    axios
      .get("http://localhost:8000/assets")
      .then(response => this.assets = response.data)
  }
})

</script>

<style>
.grid_background {
  background-color: var(--secondary-bg-color);
}

.grid {
  display: grid;
  padding: 20px;
  gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
}
</style>

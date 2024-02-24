<template>
  <div class="grid_background">
    <div class="grid">
      <AssetComponent v-for="asset in assets" :key="asset.id" :asset="asset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import AssetComponent from "./Asset.vue";
import { ref, onMounted } from "vue";
const assets = ref([]);

onMounted(() => {
  axios
    .get("http://localhost:8000/assets")
    .then(response => assets.value = response.data);

});

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

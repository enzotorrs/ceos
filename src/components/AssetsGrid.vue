<template>
  <div class="grid_background">
    <UtilsBar />
    <div class="grid">
      <Asset v-for="asset in assetsStore.assets" :key="asset.id" :asset="asset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssets } from "@/stores/assets";
import { ref, PropType, } from "vue";
const assetsStore = useAssets();
import { onMounted } from "vue";

onMounted(() => {
  assetsStore.loadAssets();
});
</script>

<style scoped>
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

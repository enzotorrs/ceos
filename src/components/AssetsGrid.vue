<template>
  <div class="grid_background">
    <UtilsBar />
    <v-breadcrumbs class="breadcrumbs" :items="assetsStore.folderPath">
      <template #item="{ item, index }">
        <v-breadcrumbs-item
          :disabled="index === assetsStore.folderPath.length - 1"
          @click="index < assetsStore.folderPath.length - 1 && assetsStore.navigateToBreadcrumb(index)"
        >
          {{ item.name }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <div class="grid">
      <Asset v-for="asset in assetsStore.assets" :key="asset.id" :asset="asset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssets } from "@/stores/assets";
import { onMounted } from "vue";

const assetsStore = useAssets();

onMounted(() => {
  assetsStore.loadAssets();
});
</script>

<style scoped>
.grid_background {
  background-color: var(--secondary-bg-color);
}

.breadcrumbs {
  padding: 8px 20px 0;
}

.grid {
  display: grid;
  padding: 20px;
  gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
}
</style>

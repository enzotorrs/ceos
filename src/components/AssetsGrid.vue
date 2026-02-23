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
    <div ref="sentinel" class="sentinel">
      <v-progress-circular v-if="assetsStore.loading" indeterminate color="primary" size="32" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssets } from "@/stores/assets";
import { onMounted, onUnmounted, ref, watch, nextTick } from "vue";

const assetsStore = useAssets();
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

function isSentinelVisible() {
  const rect = sentinel.value?.getBoundingClientRect()
  return rect && rect.top < window.innerHeight + 200
}

onMounted(() => {
  assetsStore.loadAssets();

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && assetsStore.hasMore && !assetsStore.loading) {
      assetsStore.loadMore()
    }
  }, { rootMargin: '200px' })

  if (sentinel.value) observer.observe(sentinel.value)
});

watch(() => assetsStore.loading, async (isLoading) => {
  if (!isLoading && assetsStore.hasMore) {
    await nextTick()
    if (isSentinelVisible()) assetsStore.loadMore()
  }
})

onUnmounted(() => {
  observer?.disconnect()
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

.sentinel {
  display: flex;
  justify-content: center;
  padding: 16px;
  min-height: 60px;
}
</style>

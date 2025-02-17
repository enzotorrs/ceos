<template>
  <div class="container">
    <Header />
    <video v-if="videoSrc" :src="videoSrc" controls></video>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from '@/services/ApiClient'
const route = useRoute();
const asset = ref(null)

onMounted(async () => {
  const response = await apiClient.get(`/asset/${route.params.assetId}`);
  asset.value = response.data;
});

const videoSrc = computed(() => asset.value ? `${import.meta.env.VITE_FILES_URL}/${asset.value.filename}` : '');
</script>

<style scoped>
.container {
  display: grid;
  grid-template-areas:
    "header"
    "main";
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

video {
  grid-area: main;
}

Header {
  grid-area: header
}

SideMenu {
  grid-area: aside;
}
</style>

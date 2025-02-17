<template>
  <video v-if="videoSrc" :src="videoSrc" controls></video>
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

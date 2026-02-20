<template>
  <div class="player-page">
    <Header />
    <div class="player-content">
      <div class="player-toolbar">
        <v-btn
          :icon="mdiArrowLeft"
          variant="text"
          color="white"
          @click="router.back()"
        />
        <span class="filename">{{ id }}</span>
      </div>

      <div class="player-wrapper">
        <v-progress-circular v-if="loading" indeterminate color="primary" size="64" />

        <v-alert v-else-if="error" type="error" variant="tonal" max-width="500">
          {{ error }}
        </v-alert>

        <video
          v-else-if="mediaUrl"
          class="video-player"
          :src="mediaUrl"
          controls
          autoplay
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mdiArrowLeft } from '@mdi/js'
import { apiClient } from '@/services/apiClient'

const route = useRoute()
const router = useRouter()

const id = route.query.id as string
const mediaUrl = ref('')
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const asset = await apiClient.get(`/asset/${id}`)
    const filename = asset.data.data.filename
    const response = await apiClient.get(`/media/${filename}`)
    mediaUrl.value = response.data.data
  } catch {
    error.value = 'Failed to load media.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.player-page {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  background-color: var(--secondary-bg-color);
}

.player-content {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  gap: 16px;
}

.player-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filename {
  color: #fff;
  font-size: 16px;
}

.player-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 400px;
}

.video-player {
  width: 100%;
  max-width: 960px;
  border-radius: 8px;
  background: #000;
}
</style>

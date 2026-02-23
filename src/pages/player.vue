<template>
  <div class="player-page">
    <Header />

    <div class="player-content">
      <div v-if="loading" class="center-state">
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>

      <div v-else-if="error" class="center-state">
        <v-alert type="error" variant="tonal" max-width="500">{{ error }}</v-alert>
      </div>

      <div v-else class="layout">
        <div class="main">

          <div class="video-container">
            <video
              class="video-player"
              :src="mediaUrl"
              controls
              autoplay
            />
          </div>

          <h1 class="video-title">{{ asset?.name }}</h1>

          <div class="uploader-row">
            <div class="uploader-info">
              <v-avatar size="40" class="uploader-avatar">
                <v-img v-if="uploaderAvatarUrl" :src="uploaderAvatarUrl" />
                <v-icon v-else :icon="mdiAccount" size="24" color="white" />
              </v-avatar>
              <div class="uploader-meta">
                <span class="uploader-name">{{ asset?.user?.username ?? 'Unknown' }}</span>
                <span class="upload-date">{{ formattedDate }}</span>
              </div>
            </div>
          </div>

          <v-divider class="my-4" />

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mdiArrowLeft, mdiAccount } from '@mdi/js'
import { apiClient } from '@/services/apiClient'
import type { Asset } from '@/Asset'

const route = useRoute()
const router = useRouter()

const id = route.query.id as string
const asset = ref<Asset | null>(null)
const mediaUrl = ref('')
const uploaderAvatarUrl = ref('')
const loading = ref(true)
const error = ref('')

const formattedDate = computed(() => {
  if (!asset.value?.createdAt) return ''
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(asset.value.createdAt)
  )
})

onMounted(async () => {
  try {
    const { data } = await apiClient.get(`/asset/${id}`)
    asset.value = data.data
    const filename = data.data.filename
    const mediaRes = await apiClient.get(`/media/${filename}`)
    mediaUrl.value = mediaRes.data.data

    if (data.data.user?.avatarFilename) {
      const avatarRes = await apiClient.get(`/media/${data.data.user.avatarFilename}`)
      uploaderAvatarUrl.value = avatarRes.data.data
    }
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
  background-color: #0f0f0f;
}

.player-content {
  padding: 24px 16px;
}

.center-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.layout {
  max-width: 1000px;
  margin: 0 auto;
}

.main {
  display: flex;
  flex-direction: column;
}

/* Video */
.video-container {
  width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}

.video-player {
  width: 100%;
  height: 100%;
  display: block;
}

/* Title */
.video-title {
  margin-top: 16px;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

/* Uploader row */
.uploader-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.uploader-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.uploader-avatar {
  background-color: #3f3f3f;
  flex-shrink: 0;
}

.uploader-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.uploader-name {
  color: #f1f1f1;
  font-size: 0.95rem;
  font-weight: 500;
}

.upload-date {
  color: #aaa;
  font-size: 0.8rem;
}
</style>

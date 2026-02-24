<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" width="auto">
    <v-card class="dialog-card" title="Select File to Upload">
      <input ref="hiddenFileInput" type="file" accept="video/mp4" style="display: none" @change="onFileSelected" />
      <v-text-field v-model="assetName" :label="selectedFile ? 'Asset name' : 'Select a file'"
        :hint="selectedFile ? selectedFile.name : ''" persistent-hint variant="outlined" density="comfortable"
        class="dialog-input" :readonly="!selectedFile" @click="!selectedFile && hiddenFileInput!.click()">
        <template #append-inner>
          <v-icon :icon="mdiPaperclip" style="cursor: pointer" @click.stop="hiddenFileInput!.click()" />
        </template>
      </v-text-field>
      <v-progress-linear v-if="uploading" v-model="uploadProgress" color="green" height="6" rounded
        class="dialog-input mt-3" />
      <p v-if="uploading" class="concurrency-label">{{ activeConcurrency }} parallel streams</p>
      <v-btn :disabled="!validInput || uploading" :loading="uploading" @click.prevent="uploadFile" variant="tonal"
        color="green" class="mt-2">
        Send
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mdiPaperclip } from '@mdi/js'
import { useAssets } from '@/stores/assets'
import { apiClient } from '@/services/apiClient'
import axios from 'axios'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const assetsStore = useAssets()
const hiddenFileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const validInput = ref(false)
const assetName = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const activeConcurrency = ref(0)

const PART_SIZE = 5 * 1024 * 1024
const INITIAL_CONCURRENCY = 6
const MIN_CONCURRENCY = 1
const MAX_CONCURRENCY = 20
// Adjust concurrency every N completed parts
const ADJUST_EVERY_N = 2

function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  if (!file) {
    selectedFile.value = null
    validInput.value = false
    assetName.value = ''
    return
  }
  selectedFile.value = file
  validInput.value = file.size > 0 && file.type === 'video/mp4'
  assetName.value = file.name.replace(/\.[^.]+$/, '')
}

async function uploadFile() {
  const file = selectedFile.value!
  const asset = { name: assetName.value.trim() || file.name.replace(/\.[^.]+$/, ''), folder: false, filename: file.name, parentAssetId: assetsStore.currentFolderId }
  const newAsset = await assetsStore.createAsset(asset)

  await assetsStore.loadAssets()

  uploading.value = true
  uploadProgress.value = 0

  const { id, uploadId, key } = newAsset.data
  const totalParts = Math.ceil(file.size / PART_SIZE)
  const parts: { PartNumber: number; ETag: string }[] = new Array(totalParts)

  // Concurrency state — mutated as upload runs
  let concurrency = INITIAL_CONCURRENCY
  activeConcurrency.value = concurrency

  // Rolling window of bytes/ms speeds (last 8 completed parts)
  const speedSamples: number[] = []

  function adjustConcurrency() {
    if (speedSamples.length < 4) return
    const recent = (speedSamples[speedSamples.length - 1] + speedSamples[speedSamples.length - 2]) / 2
    const older = (speedSamples[speedSamples.length - 3] + speedSamples[speedSamples.length - 4]) / 2
    if (recent > older * 1.1 && concurrency < MAX_CONCURRENCY) {
      concurrency++
    } else if (recent < older * 0.8 && concurrency > MIN_CONCURRENCY) {
      concurrency--
    }
    activeConcurrency.value = concurrency
  }

  async function uploadOnePart(partNumber: number): Promise<void> {
    const start = (partNumber - 1) * PART_SIZE
    const end = Math.min(start + PART_SIZE, file.size)
    const chunk = file.slice(start, end)

    const { data } = await apiClient.get('/media/multipart/presign', {
      params: { key, uploadId, partNumber },
    })
    const url = data.data.url

    const t0 = Date.now()
    const response = await axios.put(url, chunk, {
      headers: { 'Content-Type': 'application/octet-stream' },
    })
    const dt = Math.max(Date.now() - t0, 1)

    speedSamples.push(chunk.size / dt)
    if (speedSamples.length > 8) speedSamples.shift()

    parts[partNumber - 1] = { PartNumber: partNumber, ETag: response.headers['etag'] }
  }

  try {
    let nextPart = 1
    let completedCount = 0
    let adjustmentCount = 0

    await new Promise<void>((resolve, reject) => {
      let activeCount = 0
      let failed = false

      function tryStartNext() {
        while (activeCount < concurrency && nextPart <= totalParts && !failed) {
          const pn = nextPart++
          activeCount++

          uploadOnePart(pn)
            .then(() => {
              activeCount--
              completedCount++
              uploadProgress.value = Math.round((completedCount / totalParts) * 100)

              adjustmentCount++
              if (adjustmentCount % ADJUST_EVERY_N === 0) adjustConcurrency()

              if (completedCount === totalParts) resolve()
              else tryStartNext()
            })
            .catch((err) => {
              if (!failed) {
                failed = true
                reject(err)
              }
            })
        }
      }

      tryStartNext()
    })

    await apiClient.post('/media/multipart/complete', { key, uploadId, parts })
    await assetsStore.patchAssetStatus(id, 'success')
  } catch (error) {
    await apiClient.post('/media/multipart/abort', { key, uploadId }).catch(() => {})
    throw error
  } finally {
    uploading.value = false
    uploadProgress.value = 0
    activeConcurrency.value = 0
    await assetsStore.loadAssets()
  }

  emit('update:modelValue', false)
  selectedFile.value = null
  assetName.value = ''
  if (hiddenFileInput.value) hiddenFileInput.value.value = ''
}
</script>

<style scoped>
.dialog-card {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.dialog-input {
  width: 100%;
}

.concurrency-label {
  font-size: 10px;
  color: #888;
  align-self: flex-start;
  margin-top: 2px;
}
</style>

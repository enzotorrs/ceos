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

  uploading.value = true
  uploadProgress.value = 0
  try {
    await axios.put(newAsset.data.uploadUrl, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress(e) {
        uploadProgress.value = e.total ? Math.round((e.loaded * 100) / e.total) : 0
      },
    })
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }

  await assetsStore.loadAssets()

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
</style>

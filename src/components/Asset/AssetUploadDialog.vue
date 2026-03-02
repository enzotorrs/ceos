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
      <v-btn :disabled="!validInput || uploading" :loading="uploading" @click.prevent="onUpload" variant="tonal"
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
import { uploadAsset } from '@/services/uploadService'
import {useToastStore} from '@/stores/toast'


defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const toast = useToastStore()
const assetsStore = useAssets()
const hiddenFileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const validInput = ref(false)
const assetName = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const activeConcurrency = ref(0)


function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  if (!file) {
    selectedFile.value = null
    validInput.value = false
    assetName.value = ''
    return
  }
  selectedFile.value = file
  validInput.value = isValidInput(file)
  assetName.value = file.name.replace(/\.[^.]+$/, '')
}

function isValidInput(file: File) {
  if (file.size <= 0) {
    toast.error('File size must be greater than zero')
    return false
  }
  if (file.size > 5368709120) {
    toast.error('File size must not exceed 5 GB')
    return false
  }
  if (file.type !== 'video/mp4') {
    toast.error('File must be an MP4')
    return false
  }
  return true
}


async function onUpload() {
  const file = selectedFile.value!
  const name = assetName.value.trim() || file.name.replace(/\.[^.]+$/, '')

  uploading.value = true
  uploadProgress.value = 0
  activeConcurrency.value = 0

  try {
    await uploadAsset(file, name, assetsStore.currentFolderId, {
      onProgress: (pct) => { uploadProgress.value = pct },
      onConcurrencyChange: (n) => { activeConcurrency.value = n },
    })
    emit('update:modelValue', false)
    selectedFile.value = null
    assetName.value = ''
    if (hiddenFileInput.value) hiddenFileInput.value.value = ''
  } finally {
    uploading.value = false
    uploadProgress.value = 0
    activeConcurrency.value = 0
  }
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

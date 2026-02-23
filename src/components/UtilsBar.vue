<template>
  <div class="utils-bar">
    <div class="asset-actions">
      <v-btn ref="btnCreateFolder" @click="folderDialog = true" :icon="mdiFolderPlus" variant="text" />
      <v-dialog v-model="folderDialog" width="auto">
        <v-card class="upload_file_dialog" title="New Folder">
          <v-text-field
            v-model="folderName"
            label="Folder name"
            variant="outlined"
            density="comfortable"
            class="upload_file_input"
            @keyup.enter="createFolder"
          />
          <v-btn :disabled="!folderName.trim()" @click="createFolder" variant="tonal" color="green">Create</v-btn>
        </v-card>
      </v-dialog>
      <v-tooltip :activator="btnCreateFolder" location="bottom">New Folder</v-tooltip>

      <v-btn ref="btnUploadFile" @click="openDialog" :icon="mdiFileUpload" variant="text" />
      <v-dialog v-model="dialog" width="auto">
        <v-card class="upload_file_dialog" title="Select File to Upload">
          <input
            ref="hiddenFileInput"
            type="file"
            accept="video/mp4"
            style="display: none"
            @change="onFileSelected"
          />
          <v-text-field
            v-model="assetName"
            :label="selectedFile ? 'Asset name' : 'Select a file'"
            :hint="selectedFile ? selectedFile.name : ''"
            persistent-hint
            variant="outlined"
            density="comfortable"
            class="upload_file_input"
            :readonly="!selectedFile"
            @click="!selectedFile && hiddenFileInput.click()"
          >
            <template #append-inner>
              <v-icon
                :icon="mdiPaperclip"
                style="cursor: pointer"
                @click.stop="hiddenFileInput.click()"
              />
            </template>
          </v-text-field>
          <v-progress-linear
            v-if="uploading"
            v-model="uploadProgress"
            color="green"
            height="6"
            rounded
            class="upload_file_input mt-3"
          />
          <v-btn :disabled="!validInput || uploading" :loading="uploading" @click.prevent="uploadFile" variant="tonal" color="green" class="mt-2">Send</v-btn>
        </v-card>
      </v-dialog>
      <v-tooltip :activator="btnUploadFile" location="bottom">Upload File</v-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { mdiFileUpload, mdiFolderPlus, mdiPaperclip } from "@mdi/js"
import { useAssets } from "@/stores/assets";
import axios from "axios";

const assetsStore = useAssets();
const dialog = ref(false)
const btnUploadFile = ref()
const hiddenFileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const validInput = ref(false)
const assetName = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const folderDialog = ref(false)
const folderName = ref('')
const btnCreateFolder = ref()

function openDialog() {
  dialog.value = true
}

async function createFolder() {
  if (!folderName.value.trim()) return
  const curentFolder = assetsStore.currentFolderId
  await assetsStore.createAsset({ name: folderName.value.trim(), folder: true, parentAssetId: curentFolder } as any)
  await assetsStore.loadAssets()
  folderName.value = ''
  folderDialog.value = false
}

function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  if (!file) {
    selectedFile.value = null
    validInput.value = false
    assetName.value = ''
    return
  }
  selectedFile.value = file
  validInput.value = file.size > 0 && file.type === "video/mp4"
  assetName.value = file.name.replace(/\.[^.]+$/, '')
}

async function uploadFile() {
  const file = selectedFile.value!
  const asset = { name: assetName.value.trim() || file.name.replace(/\.[^.]+$/, ''), folder: false, filename: file.name }
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

  dialog.value = false
  selectedFile.value = null
  assetName.value = ''
  if (hiddenFileInput.value) hiddenFileInput.value.value = ''
}
</script>

<style scoped>
.utils-bar {
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 0 16px
}

.upload_file_dialog {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.upload_file_input {
  width: 100%;
}
</style>

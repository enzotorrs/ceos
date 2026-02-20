<template>
  <div class="utils-bar">
    <div class="asset-pagination">
      <v-pagination v-model="assetsStore.page" :total-visible="0" :length="assetsStore.totalPages"></v-pagination>
      <v-select class="page-size-picker" variant="outlined" label="page size" :totalVisible="0" v-model="assetsStore.pageSize" :items="[10, 20, 50, 100]"></v-select>
    </div>
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

      <v-btn ref="btnUploadFile" @click="openDialog" :icon="mdiFileUpload" variant="text">
      </v-btn>
      <v-dialog v-model="dialog" width="auto">
        <v-card class="upload_file_dialog" title="Select File to Upload">
          <v-file-input @update:modelValue="onFileInputChange" ref="fileInput" class="upload_file_input"
            label="file to upload"></v-file-input>
          <v-btn :disabled="!validInput" @click.prevent="uploadFile" variant="tonal" color="green">Send</v-btn>
        </v-card>
      </v-dialog>
      <v-tooltip :activator="btnUploadFile" location="bottom">Upload File</v-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { mdiFileUpload, mdiFolderPlus } from "@mdi/js"
import { useAssets } from "@/stores/assets";
import axios from "axios";

const assetsStore = useAssets();
const dialog = ref(false)
const btnUploadFile = ref()
const fileInput = ref(null);
const validInput = ref(false)
const folderDialog = ref(false)
const folderName = ref('')
const btnCreateFolder = ref()

function openDialog() {
  dialog.value = true
}

async function createFolder() {
  if (!folderName.value.trim()) return
  await assetsStore.createAsset({ name: folderName.value.trim(), folder: true } as any)
  folderName.value = ''
  folderDialog.value = false
}
watch([()=>assetsStore.pageSize, ()=> assetsStore.page], () => {
  assetsStore.loadAssets()
}
)
function onFileInputChange(file) {
  if (!file) {
    validInput.value = false
    return
  }
  validInput.value = file.size > 0 && file.type === "video/mp4"
}


async function uploadFile() {
  const file = fileInput.value.files[0]
  const asset = { name: file.name, folder: false, filename: file.name }
  const newAsset = await assetsStore.createAsset(asset)

  await axios.put(newAsset.data.uploadUrl, file, {
    headers: { 'Content-Type': file.type },
  })

  dialog.value = false
  fileInput.value.reset()
}
</script>

<style scoped>
.utils-bar {
  display: flex;
  justify-content: space-between;
  padding: 16px 16px 0 16px
}

.asset-pagination {
  display: flex;
}

.page-size-picker {
  width: 100px;
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

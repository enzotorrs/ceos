<template>
  <div class="utils-bar">
    <div class="asset-pagination">
      <v-pagination v-model="assetsStore.page" :length="assetsStore.totalPages"></v-pagination>
      <v-select class="page-size-picker" label="page size" v-model="assetsStore.pageSize" :items="[10, 20, 50, 100]"></v-select>
    </div>
    <div class="asset-actions">
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
import { mdiFileUpload } from "@mdi/js"
import { useAssets } from "@/stores/assets";
import axios from "axios";

const assetsStore = useAssets();
const dialog = ref(false)
const btnUploadFile = ref()
const fileInput = ref(null);
const validInput = ref(false)

function openDialog() {
  dialog.value = true
}
watch([()=>assetsStore.pageSize, ()=> assetsStore.page], () => {
  assetsStore.loadAssets()
}
)
function onFileInputChange(files) {
  if (!files) {
    validInput.value = false
    return
  }
  validInput.value = files.length > 0
}


async function uploadFile() {
  const asset = { name: fileInput.value.files[0].name, folder: false }
  const newAsset = await assetsStore.createAsset(asset)

  axios.postForm(`${import.meta.env.VITE_API_URL}/asset/upload/${newAsset.uploadId}`, { file: fileInput.value.files[0] })
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

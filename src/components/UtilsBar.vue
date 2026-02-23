<template>
  <div class="utils-bar">
    <div class="asset-actions">
      <v-btn ref="btnCreateFolder" @click="folderDialog = true" :icon="mdiFolderPlus" variant="text" />
      <AssetCreateFolderDialog v-model="folderDialog" />
      <v-tooltip :activator="btnCreateFolder" location="bottom">New Folder</v-tooltip>

      <v-btn ref="btnUploadFile" @click="uploadDialog = true" :icon="mdiFileUpload" variant="text" />
      <AssetUploadDialog v-model="uploadDialog" />
      <v-tooltip :activator="btnUploadFile" location="bottom">Upload File</v-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mdiFileUpload, mdiFolderPlus } from '@mdi/js'
import AssetCreateFolderDialog from '@/components/Asset/AssetCreateFolderDialog.vue'
import AssetUploadDialog from '@/components/Asset/AssetUploadDialog.vue'

const btnCreateFolder = ref()
const btnUploadFile = ref()
const folderDialog = ref(false)
const uploadDialog = ref(false)
</script>

<style scoped>
.utils-bar {
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 0 16px;
}
</style>

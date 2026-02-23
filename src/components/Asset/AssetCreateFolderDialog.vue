<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" width="auto">
    <v-card class="dialog-card" title="New Folder">
      <v-text-field
        v-model="folderName"
        label="Folder name"
        variant="outlined"
        density="comfortable"
        class="dialog-input"
        @keyup.enter="createFolder"
      />
      <v-btn :disabled="!folderName.trim()" @click="createFolder" variant="tonal" color="green">Create</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAssets } from '@/stores/assets'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const assetsStore = useAssets()
const folderName = ref('')

async function createFolder() {
  if (!folderName.value.trim()) return
  await assetsStore.createAsset({ name: folderName.value.trim(), folder: true, parentAssetId: assetsStore.currentFolderId } as any)
  await assetsStore.loadAssets()
  folderName.value = ''
  emit('update:modelValue', false)
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

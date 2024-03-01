<template>
  <v-menu v-model="menu" activator="parent">
    <v-list>
      <v-list-item :append-icon="mdiDelete" value="delete" title="Delete" @click="deleteAsset" />
      <v-list-item :append-icon="mdiPencil" value="rename" title="Rename">
        <AssetRenameDialog :asset="asset" @rename-asset="renameAsset" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { Asset } from "@/Asset";
import { PropType } from "vue";
import { useAssets } from "@/stores/assets";
import { ref } from "vue";
import { mdiDelete, mdiPencil } from '@mdi/js';

const assetsStore = useAssets();
const props = defineProps({
  asset: {
    type: Object as PropType<Asset>,
    required: true
  }
});
const menu = ref(false);
function deleteAsset() {
  assetsStore.deleteAsset(props.asset.id);
}
function renameAsset(newName: string) {
  assetsStore.renameAsset(props.asset.id, newName);
  menu.value = false;
}
</script>

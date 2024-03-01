<template>
  <v-menu v-model="menu" activator="parent">
    <v-list>
      <v-list-item value="delete" title="Delete" @click="deleteAsset" />
      <v-list-item value="rename" title="Rename">
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

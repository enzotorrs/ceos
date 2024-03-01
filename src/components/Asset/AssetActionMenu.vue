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

<style>
.asset__rename_dialog {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rename_dialog__button_wrapper {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  padding-bottom: 15px;

}

.rename_dialog__btn {
  width: 100px;
}

.rename_dialog__input {
  width: 100%;
}
</style>

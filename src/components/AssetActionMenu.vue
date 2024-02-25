<template>
  <v-menu activator="parent">
    <v-list>
      <v-list-item value="delete" title="Delete" @click="deleteAsset" />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { Asset } from "@/Asset";
import { PropType } from "vue";
import { useAssets } from "@/stores/assets";

const assetsStore = useAssets();
const props = defineProps({
  asset: {
    type: Object as PropType<Asset>,
    required: true
  }
});
function deleteAsset() {
  assetsStore.deleteAsset(props.asset.id);
}
</script>

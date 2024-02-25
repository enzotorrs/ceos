<template>
  <button class="asset__tool_button">
    <v-icon
      :icon="mdiDotsVertical"
      color="grey"
    />
    <v-menu activator="parent">
      <v-list>
        <v-list-item
          value="delete"
          title="Delete"
          @click="deleteAsset"
        >
        </v-list-item>
      </v-list>
    </v-menu>
  </button>
</template>

<script  lang="ts" setup>
import { Asset } from "@/Asset";
import { PropType } from "vue";
import { useAssets } from "@/stores/assets";
const assetsStore = useAssets();
import { mdiDotsVertical } from "@mdi/js";
const props = defineProps({
    asset: {
        type: Object as PropType<Asset>,
        required: true
    }
});
const emit = defineEmits(["deleteAsset"]);
function deleteAsset() {
    assetsStore.deleteAsset(props.asset.id);
    emit("deleteAsset");
}
</script>
<style scoped>
.asset__tool_button {
  position: absolute;
  right: 0;
  bottom: 10px;
  transition: visibility 1s linear, opacity 0.3s linear;
}

.disabled {
  visibility: hidden;
  opacity: 0;
}
</style>

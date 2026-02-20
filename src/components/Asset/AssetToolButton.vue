<template>
  <button :class="{hidden: !hover}" class="asset__tool_button" @click.stop>
    <v-icon
      :icon="mdiDotsVertical"
      color="grey"
    >
    </v-icon>
    <AssetActionMenu :asset="asset" />
  </button>
</template>

<script  lang="ts" setup>
import { Asset } from "@/Asset";
import { PropType } from "vue";
import { mdiDotsVertical } from '@mdi/js';
const props = defineProps({
    asset: {
        type: Object as PropType<Asset>,
        required: true
    },
    hover: {
        type: Boolean,
        required: true
    }
});
</script>
<style scoped>
.asset__tool_button {
  position: absolute;
  right: 0;
  bottom: 10px;
  transition: visibility 1s linear, opacity 0.3s linear;
  z-index: 10;
}

.hidden {
  visibility: hidden;
  opacity: 0;
}
</style>

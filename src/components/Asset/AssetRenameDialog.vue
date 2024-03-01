<template>
  <v-dialog activator="parent" width="auto">
    <template #default="{ isActive }">
      <v-card class="asset__rename_dialog" title="Rename asset">
        <v-text-field v-model="inputValue" class="rename_dialog__input"
          @keyup.enter.prevent="$emit('renameAsset', inputValue)" />
        <div class="rename_dialog__button_wrapper">
          <v-btn variant="tonal" class="rename_dialog__btn" color="green"
            @click="() => { $emit('renameAsset', inputValue); isActive.value = false }">
            OK
          </v-btn>
          <v-btn variant="tonal" class="rename_dialog__btn" color="red" @click="isActive.value = false">
            cancel
          </v-btn>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { Asset } from "@/Asset";
import { ref, PropType } from "vue";
const props = defineProps({
  asset: {
    type: Object as PropType<Asset>,
    required: true
  }
});
const emit = defineEmits(["renameAsset"]);
const inputValue = ref(props.asset.name);
</script>

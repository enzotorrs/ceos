<template>
  <v-dialog :activator="activator" width="auto" @update:model-value="focus">
    <template #default="{ isActive }">
      <v-card class="asset__rename_dialog" title="Rename asset">
        <v-text-field ref="input" v-model="inputValue" class="rename_dialog__input"
          @keyup.enter.prevent="$emit('renameAsset', inputValue); isActive.value = false" />
        <div class="rename_dialog__button_wrapper">
          <v-btn variant="tonal" class="rename_dialog__btn" color="green"
            @click="$emit('renameAsset', inputValue); isActive.value = false">
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
import { ref, PropType, } from "vue";
const props = defineProps({
  asset: {
    type: Object as PropType<Asset>,
    required: true
  },
  activator: {
    type: Object as PropType<Element> | undefined
  }
});

function focus(active: boolean) {
  if (active) {
    setTimeout(() => {
      input.value.select();
    }, 300);
  }
}

const emit = defineEmits(["renameAsset"]);
const inputValue = ref(props.asset.name);
const input = ref();
</script>
<style scoped>
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

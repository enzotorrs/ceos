<template>
  <v-menu v-model="menu" activator="parent">
    <v-list>
      <v-list-item value="delete" title="Delete" @click="deleteAsset" />
      <v-list-item value="rename" title="Rename">
        <v-dialog activator="parent" width="auto">
          <template #default="{ isActive }">
            <v-card class="asset__rename_dialog" title="Rename asset">
              <v-text-field v-model="inputValue" class="rename_dialog__input" @keyup.enter.prevent="renameAsset" />
              <div class="rename_dialog__button_wrapper">
                <v-btn variant="tonal" class="rename_dialog__btn" color="green"
                  @click="() => { renameAsset(); isActive.value = false }">
                  OK
                </v-btn>
                <v-btn variant="tonal" class="rename_dialog__btn" color="red" @click="isActive.value = false">
                  cancel
                </v-btn>
              </div>
            </v-card>
          </template>
        </v-dialog>
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
const inputValue = ref(props.asset.name);
const menu = ref(false);
function deleteAsset() {
  assetsStore.deleteAsset(props.asset.id);
}
function renameAsset() {
  assetsStore.renameAsset(props.asset.id, inputValue.value);
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

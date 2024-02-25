<template>
  <div
    v-if="!deleted"
    class="asset"
    :class="{ folder: asset.folder, file: !asset.folder, disabled: disabled }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="asset__footer">
      <div class="asset__metadata_wrapper">
        <p class="asset__name">
          {{ asset.name }}
        </p>
        <p
          v-if="asset.folder"
          class="asset__count_child"
        >
          {{ asset.child_assets.length }} items
        </p>
        <p
          v-if="!asset.folder"
          class="asset__count_child"
        >
          {{ created_date }}
        </p>
      </div>
      <AssetToolButton
        :asset="asset"
        :hover="hover"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Asset } from "@/Asset";
import { PropType } from "vue";
import { ref } from "vue";

const hover = ref(false);
const deleted = ref(false);
const disabled = ref(false);


const props = defineProps({
    asset: {
        type: Object as PropType<Asset>,
        required: true
    }
});

const created_date = new Date(props.asset.created_at).toDateString();
function deleteAsset() {
    disabled.value = true;
    setTimeout(() => {
        deleted.value = true;
    }, 400);
}
</script>

<style>
.folder {
  background-image: url("@/assets/folder.svg");
  background-size: contain;
  background-repeat: no-repeat;
}

.file {
  background-color: #303247;
  border-radius: 8px;
}

.asset {
  position: relative;
  aspect-ratio: calc(170/144);
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: end;
  transition: visibility 1s linear, opacity 0.3s linear;
}

.asset__footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.asset__metadata_wrapper {
  display: flex;
  flex-direction: column;
  width: 90%;
  overflow-x: hidden;

}

.asset__name {
  color: #fff;
  font-size: 16px;
  overflow: hidden;
}

.asset__count_child {
  color: #888;
  font-size: 10px;
}

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

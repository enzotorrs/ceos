<template>
    <div
      class="asset"
      :class="{ folder: asset.folder, file: !asset.folder, disabled: disabled, clickable: true, 'drop-target': dropTarget }"
      draggable="true"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @click="onClick"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @dragover.prevent="onDragOver"
      @dragleave="dropTarget = false"
      @drop.prevent="onDrop"
    >
      <div class="asset__footer">
        <div class="asset__metadata_wrapper">
          <p class="asset__name">
            {{ asset.name }}
          </p>
          <p v-if="asset.folder" class="asset__count_child">
            {{ asset.childAssets.length }} items
          </p>
          <p v-if="!asset.folder" class="asset__count_child">
            {{ created_date }}
          </p>
        </div>
        <AssetToolButton :asset="asset" :hover="hover" />
      </div>
    </div>
</template>

<script lang="ts" setup>
import { Asset } from "@/Asset";
import { PropType } from "vue";
import { ref } from "vue";
import { useAssets } from "@/stores/assets";
import { useRouter } from "vue-router";
const assetsStore = useAssets();
const router = useRouter();

const props = defineProps({
  asset: {
    type: Object as PropType<Asset>,
    required: true
  }
});

const hover = ref(false);
const disabled = ref(false);
const dropTarget = ref(false);
const dragging = ref(false);
const created_date = new Date(props.asset.createdAt).toDateString();

function onClick() {
  if (dragging.value) return
  if (props.asset.folder) assetsStore.navigateTo(props.asset)
  else router.push({ path: '/player', query: { id: props.asset.id } })
}

function onDragStart(event: DragEvent) {
  dragging.value = true
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('assetId', String(props.asset.id))
}

function onDragEnd() {
  dragging.value = false
}

function onDragOver(event: DragEvent) {
  if (!props.asset.folder) return
  const draggedId = Number(event.dataTransfer!.getData('assetId'))
  if (draggedId === props.asset.id) return
  dropTarget.value = true
}

async function onDrop(event: DragEvent) {
  dropTarget.value = false
  if (!props.asset.folder) return
  const draggedId = Number(event.dataTransfer!.getData('assetId'))
  if (!draggedId || draggedId === props.asset.id) return
  await assetsStore.moveAsset(draggedId, props.asset.id)
}

assetsStore.$onAction(({
  name,
  args,
  after
}) => {
  after(() => {
    if (name === "deleteAsset" && args[0] == props.asset.id) {
      disabled.value = true;
      setTimeout(() => {
        assetsStore.assets = assetsStore.assets.filter((asset: Asset) => asset.id !== args[0]);
      }, 400);
    }
  });
}
);
</script>

<style scoped>
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

.clickable {
  cursor: pointer;
}

.drop-target {
  filter: brightness(1.4);
  outline: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 4px;
}
</style>

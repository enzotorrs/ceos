<template>
  <aside class="side-menu">
    <div class="logo-wrapper">
      <v-btn class="hamburguer-menu" :icon="mdiMenu" variant="text"/>
      <Logo/>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import { mdiMenu } from '@mdi/js';
</script>

<style scoped>
.side-menu {
  background-color: var(--primary-bg-color);
  width: 260px;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: aside
}

.hamburguer-menu {
  position: absolute;
  left: 3px;
}

.logo-wrapper {
  margin-bottom: 65px;
}
</style>

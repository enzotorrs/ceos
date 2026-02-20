<template>
  <div class="grid">
    <Header />
    <AssetsGrid />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-areas:
    "header"
    "main";
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

GridAssets {
  grid-area: main;
}

Header {
  grid-area: header
}

SideMenu {
  grid-area: aside;
}
</style>

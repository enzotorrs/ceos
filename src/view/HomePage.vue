<template>
  <SideMenu />
  <Header />
  <AssetsGrid />
</template>

<script setup lang="ts">
</script>

<style>
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

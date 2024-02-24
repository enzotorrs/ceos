<template>
  <header>
    <input
      class="asset-search"
      type="text"
      placeholder="Search for asset"
    >
    <div class="header__icons">
      <v-icon
        :icon="mdiBell"
        color="white"
      />
      <img
        class="user-icon"
        src="@/assets/gojo_icon.png"
        alt="User perfil icon"
      >
    </div>
  </header>
</template>

<script  lang="ts" setup>
import { mdiBell } from "@mdi/js";
</script>

<style>
header {
  height: 72px;
  background-color: var(--secondary-bg-color);
  padding: 16px 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  z-index: 100;
}

.asset-search {
  height: 40px;
  background-color: var(--primary-contrast-color);
  border: none;
  border-radius: 40px;
  padding: 13px 16px;
  font-size: 12;
  color: #fff;
  width: min(50vw, 550px);
}

.header__icons {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-icon {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
</style>

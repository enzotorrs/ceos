<template>
  <router-link to="/">
    <div class="logo-wrapper">
      <img src="@/assets/planet_logo.png" alt="ceos logo planet">
      <img src="@/assets/text_logo.svg" alt="ceos logo text">
    </div>
  </router-link>
</template>

<style>
.logo-wrapper {
  height: 30px;
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  justify-content: center;
}

img {
  height: 100%;
}
</style>

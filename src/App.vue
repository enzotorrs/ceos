<template>
  <v-app>
    <v-main id="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>

<style>
:root {
  --primary-bg-color: #0F0F14;
  --secondary-bg-color: #15151C;
  --primary-accent-color: #6661FF;
  --secondary-accent-color: #E04C63;
  --primary-contrast-color: #20222B;
}

a {
  text-decoration: none;
}

* {
  margin: 0;
  outline: none;
}

ul {
  list-style: none;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#main {
  display: grid;
  grid-template-areas:
    "aside header"
    "aside main";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}
</style>

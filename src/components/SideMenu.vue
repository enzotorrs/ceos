<template>
  <aside class="side-menu">
    <div class="logo-wrapper">
      <img src="@/assets/planet_logo.png" alt="ceos logo planet">
      <img src="@/assets/text_logo.svg" alt="ceos logo text">
    </div>
    <navbar>
      <ul>
        <li v-for="(item, index) in items" class="navbar__item" :key="index"
          :class="{ navbar__item_active: activeIndex === index }" @click="setActiveIndex(index)">
          {{ item }} </li>
      </ul>
      <hr class="separator" >
      <ul>
        <li class="navbar__item" :class="{ navbar__item_active: activeIndex === 4 }" @click="setActiveIndex(4)">History</li>
      </ul>
    </navbar>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SideMenu',
  data () {
    return {
      activeIndex: 0,
      items: ['Home', 'Videos', 'Photos']
    }
  },
  methods: {
    setActiveIndex (index: number) {
      this.activeIndex = index
    }
  }
})

</script>

<style>
.side-menu {
  background-color: var(--primary-bg-color);
  width: 240px;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: aside
}

.logo-wrapper {
  height: 30px;
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  justify-content: center;
  margin-bottom: 65px;
}

img {
  height: 100%;
}

.navbar__item {
  height: 40px;
  width: 200px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  color: #fff;
  border-radius: 8px;
}

.navbar__item_active {
  background-color: var(--primary-contrast-color);
}

.separator {
  border-top: 1px solid #fff;
  border-bottom: none;
  margin: 8px 0px;
}
</style>

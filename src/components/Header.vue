<template>
  <header>
    <div class="header-left">
      <Logo/>
    </div>
    <div class="header__icons">
      <v-icon
        :icon="mdiBell"
        color="white"
      />
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <img
            class="user-icon"
            src="@/assets/gojo_icon.png"
            alt="User perfil icon"
            v-bind="props"
          >
        </template>
        <v-list>
          <v-list-item
            :prepend-icon="mdiLogout"
            title="Logout"
            @click="authStore.logout"
          />
        </v-list>
      </v-menu>
    </div>
  </header>
</template>

<script  lang="ts" setup>
import { mdiBell, mdiLogout } from "@mdi/js";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
</script>

<style scoped>
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

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
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
  cursor: pointer;
}
</style>

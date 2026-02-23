<template>
  <header>
    <div class="header-left">
      <Logo/>
    </div>
    <div class="header__icons">
      <v-icon :icon="mdiBell" color="white" />

      <input
        ref="avatarInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onAvatarSelected"
      />

      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-avatar class="user-avatar" size="40" v-bind="props">
            <v-img v-if="authStore.me?.avatarUrl" :src="authStore.me.avatarUrl" />
            <v-icon v-else :icon="mdiAccount" size="28" color="white" />
          </v-avatar>
        </template>
        <v-list>
          <v-list-item
            :prepend-icon="mdiImageEdit"
            title="Upload avatar"
            :disabled="avatarUploading"
            @click="avatarInput!.click()"
          />
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

<script lang="ts" setup>
import { ref } from 'vue'
import { mdiBell, mdiLogout, mdiAccount, mdiImageEdit } from '@mdi/js'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarUploading = ref(false)

async function onAvatarSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  avatarUploading.value = true
  try {
    await authStore.uploadAvatar(file)
  } finally {
    avatarUploading.value = false
    if (avatarInput.value) avatarInput.value.value = ''
  }
}
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

.user-avatar {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.15);
}
</style>

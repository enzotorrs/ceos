<template>
  <v-app>
    <router-view />
    <v-snackbar
      v-model="toast.show"
      :color="toast.color"
      :timeout="toast.timeout"
      location="bottom right"
    >
      {{ toast.message }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const authStore = useAuthStore()
if (authStore.accessToken) {
  authStore.fetchMe().catch(() => {})
}

const toast = useToastStore()
</script>

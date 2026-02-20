<template>
  <div class="login-wrapper">
    <v-card class="login-card" elevation="4">
      <v-card-title class="text-h5 mb-2">Sign in</v-card-title>

      <v-card-text>
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
          density="compact"
        >
          {{ error }}
        </v-alert>

        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="username"
            label="username"
            type="text"
            autocomplete="username"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :disabled="loading"
            required
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            autocomplete="current-password"
            variant="outlined"
            density="comfortable"
            class="mb-5"
            :disabled="loading"
            required
          />
          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
          >
            Sign in
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 8px;
}
</style>

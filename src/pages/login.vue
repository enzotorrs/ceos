<template>
  <div class="login-wrapper">
    <v-card class="login-card" elevation="4">
      <v-card-title class="text-h5 mb-2">{{ isSignUp ? 'Sign up' : 'Sign in' }}</v-card-title>

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
            label="Username"
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
            class="mb-3"
            :disabled="loading"
            required
          />
          <v-text-field
            v-if="isSignUp"
            v-model="confirmPassword"
            label="Confirm password"
            type="password"
            autocomplete="new-password"
            variant="outlined"
            density="comfortable"
            class="mb-5"
            :disabled="loading"
            required
          />
          <div v-if="!isSignUp" class="mb-5" />
          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
          >
            {{ isSignUp ? 'Sign up' : 'Sign in' }}
          </v-btn>
        </v-form>

        <div class="text-center mt-4">
          <span class="text-body-2 text-medium-emphasis">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
          </span>
          <v-btn
            variant="text"
            size="small"
            color="primary"
            class="ml-1 pa-0"
            style="min-width: unset"
            @click="toggleMode"
          >
            {{ isSignUp ? 'Sign in' : 'Sign up' }}
          </v-btn>
        </div>
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
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const isSignUp = ref(false)

function toggleMode() {
  isSignUp.value = !isSignUp.value
  error.value = ''
  username.value = ''
  password.value = ''
  confirmPassword.value = ''
}

async function submit() {
  error.value = ''

  if (isSignUp.value) {
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match'
      return
    }
    loading.value = true
    try {
      await authStore.signup(username.value, password.value)
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Failed to create account'
    } finally {
      loading.value = false
    }
  } else {
    loading.value = true
    try {
      await authStore.login(username.value, password.value)
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Invalid credentials'
    } finally {
      loading.value = false
    }
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

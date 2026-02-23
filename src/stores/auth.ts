import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { apiClient } from '@/services/apiClient'

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(localStorage.getItem('accessToken') || '')
    const refreshToken = ref(localStorage.getItem('refreshToken') || '')

    async function login(username: string, password: string) {
        const response = await apiClient.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
            username,
            password,
        })
        const { accessToken: newAccess, refreshToken: newRefresh } = response.data
        setTokens(newAccess, newRefresh)
        router.push('/')
    }

    function setTokens(access: string, refresh: string) {
        accessToken.value = access
        refreshToken.value = refresh
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', refresh)
    }

    function clearTokens() {
        accessToken.value = ''
        refreshToken.value = ''
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }

    async function logout() {
        try {
            await apiClient.post(`${import.meta.env.VITE_API_URL}/auth/logout`)
        } finally {
            clearTokens()
            router.push('/login')
        }
    }

    async function refreshAccessToken() {
        try {
            const response = await apiClient.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                refreshToken: refreshToken.value
            })

            const { accessToken: newAccess, refreshToken: newRefresh } = response.data
            setTokens(newAccess, newRefresh)
            return newAccess
        } catch (error) {
            clearTokens()
            router.push('/login')
            throw error
        }
    }

    async function signup(username: string, password: string) {
        const response = await apiClient.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
            username,
            password,
        })
        const { accessToken: newAccess, refreshToken: newRefresh } = response.data
        setTokens(newAccess, newRefresh)
        router.push('/')
    }

    return { accessToken, refreshToken, login, signup, logout, setTokens, clearTokens, refreshAccessToken }
})

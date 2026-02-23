import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { apiClient } from '@/services/apiClient'

interface Me {
    username: string
    avatarUrl: string | null
}

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(localStorage.getItem('accessToken') || '')
    const refreshToken = ref(localStorage.getItem('refreshToken') || '')
    const me = ref<Me | null>(null)

    async function login(username: string, password: string) {
        const response = await apiClient.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
            username,
            password,
        })
        const { accessToken: newAccess, refreshToken: newRefresh } = response.data
        setTokens(newAccess, newRefresh)
        await fetchMe()
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
        me.value = null
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
        await fetchMe()
        router.push('/')
    }

    async function fetchMe() {
        const response = await apiClient.get(`${import.meta.env.VITE_API_URL}/auth/user/me`)
        me.value = response.data.data
    }

    async function uploadAvatar(file: File) {
        const { data } = await apiClient.post(`${import.meta.env.VITE_API_URL}/auth/user/me/avatar`)
        await fetch(data.data.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
        })
        await fetchMe()
    }

    return { accessToken, refreshToken, me, login, signup, logout, setTokens, clearTokens, refreshAccessToken, fetchMe, uploadAvatar }
})

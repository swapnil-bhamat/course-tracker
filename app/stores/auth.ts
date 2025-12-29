import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)
    const authenticated = ref(false)
    const loading = ref(true)

    async function fetchUser() {
        loading.value = true
        try {
            const data = await $fetch<any>('/api/auth/user')
            if (data?.authenticated) {
                user.value = data.user
                authenticated.value = true
            } else {
                user.value = null
                authenticated.value = false
            }
        } catch (error) {
            console.error('Failed to fetch user', error)
        } finally {
            loading.value = false
        }
    }

    function logout() {
        // Clear cookies and state
        // In a real app, you might want to call a logout endpoint too
        user.value = null
        authenticated.value = false
    }

    return { user, authenticated, loading, fetchUser, logout }
})

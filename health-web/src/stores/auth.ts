import { defineStore } from 'pinia'
import http from '@/api/http'

export const useAuthStore = defineStore('auth', {
    state: () => ({ token: localStorage.getItem('token') as string | null }),
    getters: { isLoggedIn: (s) => !!s.token },
    actions: {
        async login(email: string, password: string) {
            const { data } = await http.post('/auth/login', { email, password })
            this.token = data.token
            localStorage.setItem('token', data.token)
        },
        logout() {
            this.token = null
            localStorage.removeItem('token')
        },
    },
})
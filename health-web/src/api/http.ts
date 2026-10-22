import axios from 'axios'

const http = axios.create({ baseURL: 'http://localhost:3000/api' })

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

http.interceptors.response.use(
    (res) => res,
    (err) => {
        const isAuthCall = err.config?.url?.includes('/auth/')
        if (err.response?.status === 401 && !isAuthCall) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    },
)

export default http
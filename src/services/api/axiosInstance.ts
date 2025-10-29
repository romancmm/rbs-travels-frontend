import axios from 'axios'
import Cookies from 'js-cookie'
import { handleApiError } from './errorHandler'

const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const url = (config.url || '').toString()
    const isAdmin = url.startsWith('/admin') || url.startsWith('admin')
    const cookieName = isAdmin ? 'adminToken' : 'token'
    const token = Cookies.get(cookieName)

    // Ensure the token is valid before proceeding
    // const isValid = validateToken() // Await the async validateToken function
    // if (!isValid) {
    //   return Promise.reject(new Error('Unauthorized: Token invalid/expired'))
    // }

    // const token = getToken() // Await the async getToken function
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor (Optional: Auto Retry Failed Requests)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error)
    return Promise.reject(error)
  }
)

export default axiosInstance

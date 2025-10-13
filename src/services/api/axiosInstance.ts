import axios from 'axios'
import Cookies from 'js-cookie'
import { handleApiError } from './errorHandler'

const adminToken = Cookies.get('adminToken') as string

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
    // Ensure the token is valid before proceeding
    // const isValid = validateToken() // Await the async validateToken function
    // if (!isValid) {
    //   return Promise.reject(new Error('Unauthorized: Token invalid/expired'))
    // }

    // const token = getToken() // Await the async getToken function
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
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

'use client'

import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import axiosInstance from '../api/axiosInstance'

const responseBody = <T>(response: AxiosResponse<T>) => response.data

// Inject token into all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const isAdmin = config.url?.startsWith('/admin')
    const cookieName = isAdmin ? 'adminToken' : 'token'
    const token = Cookies.get(cookieName)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Type-safe generic client
const requests = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get<T>(url, config).then(responseBody),

  post: <T = any>(url: string, body: object, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.post<T>(url, body, config).then(responseBody),

  patch: <T = any>(url: string, body: object, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.patch<T>(url, body, config).then(responseBody),

  put: <T = any>(url: string, body: object, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.put<T>(url, body, config).then(responseBody),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete<T>(url, config).then(responseBody)
}

export default requests

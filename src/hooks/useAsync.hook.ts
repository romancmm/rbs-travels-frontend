'use client'

import { serverAction } from '@/action/server.action'
import { showErrorToast } from '@/lib/show-error-toast'
import { useEffect, useState } from 'react'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface UseAsyncOptions<
  TBody extends Record<string, unknown> | FormData = Record<string, unknown>
> {
  path: string
  method?: HttpMethod
  body?: TBody
  token?: 'token' | 'adminToken'
  rev?: number
  customHeaders?: Record<string, string>
  immediate?: boolean
  showErrorToast?: boolean
}

export default function useAsync<
  TResponse = any,
  TBody extends Record<string, unknown> | FormData = Record<string, unknown>
>(options: UseAsyncOptions<TBody>) {
  const {
    path,
    method = 'GET',
    body,
    token = 'token',
    rev,
    customHeaders,
    immediate = false,
    showErrorToast: shouldShowErrorToast = true
  } = options

  const [data, setData] = useState<TResponse | null>(null)
  const [error, setError] = useState<ApiErrorResponse | null>(null)
  const [loading, setLoading] = useState(immediate)

  const execute = async (override?: Partial<UseAsyncOptions<TBody>>) => {
    setLoading(true)
    setError(null)

    try {
      const { data: resp, errors } = await serverAction<TResponse>({
        path: override?.path || path,
        method: override?.method || method,
        body: override?.body !== undefined ? override.body : body,
        token: override?.token || token,
        rev: override?.rev || rev,
        customHeaders: override?.customHeaders || customHeaders
      })

      if (errors) {
        const errorObj = {
          status: 400,
          message: Array.isArray(errors) ? errors.join(', ') : String(errors)
        }
        setError(errorObj)
        setData(null)
        if (override?.showErrorToast ?? shouldShowErrorToast) {
          showErrorToast(errors)
        }
        return { data: null, error: errorObj }
      } else {
        setData(resp ?? null)
        return { data: resp ?? null, error: null }
      }
    } catch (e) {
      const catchError: ApiErrorResponse = {
        status: 500,
        message: e instanceof Error ? e.message : 'Unknown error'
      }
      setError(catchError)
      setData(null)
      return { data: null, error: catchError }
    } finally {
      setLoading(false)
    }
  }

  // Optionally run immediately and refetch when path changes
  useEffect(() => {
    if (immediate && path) execute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, immediate])

  return { data, error, loading, execute }
}

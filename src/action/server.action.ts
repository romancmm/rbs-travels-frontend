'use server'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'

import { refreshUserToken } from '@/lib/refresh-token'
import {
  deserializeServerResponse,
  extractServerActionErrors,
  normalizeServerActionException
} from '@/lib/server-action-error'

const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API?.replace(/\/+$/, '')
const DEFAULT_FETCH_TIMEOUT_MS = 15000

export type ServerActionOptions = {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: Record<string, unknown> | FormData
  token?: 'token' | 'adminToken' | 'refreshToken'
  /**
   * Cache revalidation in seconds.
   * For client-side calls (Server Actions), uses unstable_cache for cross-request caching.
   * For server-side calls, uses fetch-level caching with next.revalidate.
   * Omit to bypass caching (e.g. highly dynamic or mutation-adjacent reads).
   */
  rev?: number
  customHeaders?: Record<string, string>
}

export type ServerActionResult<T> = { data: T | null; errors: string[] | null }

// ─── Internal fetch executor ──────────────────────────────────────────────────

async function executeFetch<T>(
  path: string,
  method: string,
  headers: Record<string, string>,
  body?: Record<string, unknown> | FormData,
  skipAutoLogout?: boolean,
  token?: 'token' | 'adminToken' | 'refreshToken'
): Promise<ServerActionResult<T>> {
  const isFormData = body instanceof FormData
  let response: Response
  let result: unknown
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_FETCH_TIMEOUT_MS)

  try {
    response = await fetch(baseURL + path, {
      method,
      headers,
      signal: controller.signal,
      ...(body && { body: isFormData ? body : JSON.stringify(body) })
    })
    result = await deserializeServerResponse(response)
    console.log('[Response] :>> ', method, path, result)
  } catch (error) {
    if (controller.signal.aborted) {
      return {
        data: null,
        errors: [
          `Request timed out after ${DEFAULT_FETCH_TIMEOUT_MS / 1000} seconds for ${method} ${path}`
        ]
      }
    }
    return { data: null, errors: normalizeServerActionException(error) }
  } finally {
    clearTimeout(timeoutId)
  }

  if (response!.ok) return { data: result as T, errors: null }

  const errors = extractServerActionErrors(result, response!.status)

  if (response!.status === 401 && !path.includes('/auth/logout') && !skipAutoLogout) {
    if (token === 'token') {
      const refreshed = await refreshUserToken()
      if (refreshed) {
        const cookieStore = await cookies()
        const newBearerToken = cookieStore.get('token')?.value ?? ''
        if (newBearerToken) {
          const retryHeaders = { ...headers, Authorization: `Bearer ${newBearerToken}` }
          return executeFetch<T>(path, method, retryHeaders, body, true, token)
        }
      }
    }
    // await userLogout('/login', errors[0])
  }

  return { data: null, errors }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const serverAction = async <T = unknown>(
  options: ServerActionOptions
): Promise<ServerActionResult<T>> => {
  const { path, method = 'GET', body, rev, customHeaders } = options
  // Admin routes always authenticate with the admin token, regardless of
  // whatever `token` the caller passed in.
  const isAdminPath = path.startsWith('/admin') || path.startsWith('admin')
  const token = isAdminPath ? 'adminToken' : (options.token ?? 'token')

  const cookieStore = await cookies()
  const bearerToken = token ? (cookieStore.get(token)?.value ?? '') : ''

  const isFormData = body instanceof FormData
  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...customHeaders,
    ...(bearerToken && { Authorization: `Bearer ${bearerToken}` })
  }

  // For GET requests with caching, use unstable_cache to cache across Server Action calls
  if (method === 'GET' && rev !== undefined) {
    const getCachedData = unstable_cache(
      async () => executeFetch<T>(path, method, headers, undefined, !bearerToken, token),
      [token, path], // Cache key: unique per token type and path
      {
        revalidate: rev,
        tags: [path]
      }
    )
    return getCachedData()
  }

  // Uncached GET or any mutation
  return executeFetch<T>(path, method, headers, body, !bearerToken, token)
}

// ─── Cache invalidation ───────────────────────────────────────────────────────

export const revalidateTags = async (tags: string) => {
  revalidateTag(tags, 'max') // stale-while-revalidate semantics
  revalidatePath('/', 'page')
  revalidatePath('/', 'layout')
}

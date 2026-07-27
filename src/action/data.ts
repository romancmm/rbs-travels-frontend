'use server'
import { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'
import { HOME_CONFIG, SITE_CONFIG } from '@/types/cache-keys'
import { updateTag } from 'next/cache'
import { cookies } from 'next/headers'

const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API
const DEFAULT_FETCH_TIMEOUT_MS = 15000

type FetchOnServerParams<T = any> = {
  path: string
  rev?: number
  token?: 'token' | 'adminToken'
  tag?: string
}

export const fetchOnServer = async <T = any>({
  path,
  rev,
  token,
  tag
}: FetchOnServerParams<T>): Promise<{ data: T | null; error: string | null }> => {
  const options: RequestInit = {}

  if (token) {
    const cookieStore = await cookies()
    const bearerToken = cookieStore.get(token)?.value
    options.headers = {
      Authorization: `Bearer ${bearerToken}`
    }
  }

  // Without a timeout, a slow/unreachable backend hangs this fetch
  // indefinitely - during `next build` that blows past the per-page static
  // generation watchdog and takes every route down with it, since almost
  // every page depends on this (via getSiteConfig/getMainNav/getFooterNav).
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(baseURL + path, {
      headers: options.headers,
      method: 'GET',
      signal: controller.signal,
      ...(rev
        ? { cache: 'force-cache', next: { revalidate: rev, ...(tag ? { tags: [tag] } : {}) } }
        : { cache: 'no-store' })
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      return { data: null, error: `HTTP ${response.status}` }
    }
  } catch (error) {
    if (controller.signal.aborted) {
      return {
        data: null,
        error: `Request timed out after ${DEFAULT_FETCH_TIMEOUT_MS / 1000} seconds for GET ${path}`
      }
    }
    return { data: null, error: 'Network error' }
  } finally {
    clearTimeout(timeoutId)
  }
}

export const revalidateTags = async (tags: string) => {
  // Called from settings forms right after a save - the admin expects to see
  // their own change immediately, so this needs updateTag's "expire now,
  // next request blocks for fresh data" semantics, not revalidateTag's
  // stale-while-revalidate (which would keep serving the old cached value).
  updateTag(tags)
}

export const getSiteConfig = async (): Promise<any | null> => {
  const data = await fetchOnServer({
    path: '/settings/system_site_settings',
    rev: 3600, // 1 hour revalidation
    tag: SITE_CONFIG
  })
  if (data.error) {
    return null
  }

  return data?.data?.value
}

export const getHomepageData = async (): Promise<HomepageSettings | null> => {
  const data = await fetchOnServer({
    path: '/settings/homepage_settings',
    rev: 3600, // 1 hour revalidation
    tag: HOME_CONFIG
  })
  if (data.error) {
    return null
  }
  return data?.data?.value
}

export const getFooterNav = async (): Promise<any | null> => {
  const data = await fetchOnServer({ path: '/settings/key/footer_menus', rev: 3600 }) // 1 hour revalidation
  if (data.error) {
    return null
  }
  return data?.data?.value
}

export const getMainNav = async (): Promise<any | null> => {
  const data = await fetchOnServer({
    path: '/settings/key/main_menus',
    rev: 3600,
    tag: 'main_menus'
  }) // 1 hour revalidation
  if (data.error) {
    return null
  }
  return data?.data?.value
}

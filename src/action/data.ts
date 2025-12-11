'use server'
import { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'
import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API

export const fetchOnServer = async <T = any>(
  path: string,
  rev?: number,
  token?: 'token' | 'adminToken'
): Promise<{ data: T | null; error: string | null }> => {
  const options: RequestInit = {}

  if (token) {
    const cookieStore = await cookies()
    const bearerToken = cookieStore.get(token)?.value
    options.headers = {
      Authorization: `Bearer ${bearerToken}`
    }
  }

  try {
    const response = await fetch(baseURL + path, {
      headers: options.headers,
      method: 'GET',
      ...(rev
        ? { cache: 'force-cache', next: { revalidate: rev, tags: [path] } }
        : { cache: 'no-store' })
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      return { data: null, error: `HTTP ${response.status}` }
    }
  } catch {
    return { data: null, error: 'Network error' }
  }
}

export const revalidateTags = async (tags: string) => {
  revalidateTag(tags, 'layout')
  revalidatePath('/', 'page')
  revalidatePath('/', 'layout')
}

export const getSiteConfig = async (): Promise<any | null> => {
  const data = await fetchOnServer('/settings/system_site_settings', 3600) // 1 hour revalidation
  if (data.error) {
    return null
  }

  return data?.data?.value
}

export const getHomepageData = async (): Promise<HomepageSettings | null> => {
  const data = await fetchOnServer('/settings/homepage_settings', 3600) // 1 hour revalidation
  if (data.error) {
    return null
  }
  return data?.data?.value
}

export const getFooterNav = async (): Promise<any | null> => {
  const data = await fetchOnServer('/settings/key/footer_menus', 3600) // 1 hour revalidation
  if (data.error) {
    return null
  }
  return data?.data?.value
}

export const getMainNav = async (): Promise<any | null> => {
  const data = await fetchOnServer('/settings/key/main_menus', 3600) // 1 hour revalidation
  if (data.error) {
    return null
  }
  return data?.data?.value
}

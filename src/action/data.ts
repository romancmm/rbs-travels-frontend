'use server'
import { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API

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

  try {
    const response = await fetch(baseURL + path, {
      headers: options.headers,
      method: 'GET',
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
  } catch {
    return { data: null, error: 'Network error' }
  }
}

export const revalidateTags = async (tags: string) => {
  revalidateTag(tags, { expire: 300 })
  // revalidatePath('/')
  console.log('tags', tags)
}

export const getSiteConfig = async (): Promise<any | null> => {
  const data = await fetchOnServer({ path: '/settings/system_site_settings', rev: 3600 }) // 1 hour revalidation
  if (data.error) {
    return null
  }

  return data?.data?.value
}

export const getHomepageData = async (): Promise<HomepageSettings | null> => {
  const data = await fetchOnServer({ path: '/settings/homepage_settings', rev: 3600 }) // 1 hour revalidation
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

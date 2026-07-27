'use server'

import { cookies } from 'next/headers'

const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API?.replace(/\/+$/, '')

/**
 * Attempts to refresh the user access token using the stored refresh token.
 * Returns true and rotates both cookies on success, false otherwise.
 */
export async function refreshUserToken(): Promise<boolean> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) return false

  try {
    const response = await fetch(baseURL + '/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })
    if (!response.ok) return false

    const responseData = await response.json()
    const result = responseData as {
      response?: { accessToken: string; refreshToken: string }
    }

    const tokens = result?.response
    if (!tokens?.accessToken || !tokens?.refreshToken) return false

    cookieStore.set('token', tokens.accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    cookieStore.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    return true
  } catch {
    return false
  }
}

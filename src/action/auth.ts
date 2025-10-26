'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API

// =============================
// *** Admin Authentications ***
// =============================
type AdminAuthSuccess = { accessToken: string; user: any }
type AdminAuthError = { error: string }

export const authenticateAdmin = async (
  email: string,
  password: string
): Promise<AdminAuthSuccess | AdminAuthError> => {
  const cookieStore = await cookies()

  try {
    const response = await fetch(baseURL + '/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      // Return a structured error instead of throwing to avoid Next.js error overlay
      const errJson = await response.json().catch(() => null)
      const message = errJson?.message || 'Invalid credentials'
      return { error: message }
    }

    const data = await response.json()

    const token = data?.data?.accessToken
    const { role, roleId, permissions, ...restInfo } = data?.data?.user

    // Store token in cookie
    cookieStore.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Store user info in cookie (readable by client UI)
    cookieStore.set(
      'user',
      JSON.stringify({ name: restInfo?.name, email: restInfo?.email, avatar: restInfo?.avatar }),
      {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      }
    )

    // Store user role in cookie (server-use)
    cookieStore.set('userRole', role || roleId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Extract and transform permissions data structure

    // Transform from array format to single object format
    // From: [{ resource: "products", actions: [...] }]
    // To: { products: [...], users: [...] }
    const transformedPermissions = permissions?.reduce((acc: any, permission: any) => {
      acc[permission?.resource] = permission?.actions
      return acc
    }, {})

    // If user is ADMIN, they have full permissions regardless of customRole
    const finalPermissions = role === 'ADMIN' ? { __superAdmin: true } : transformedPermissions

    // const permissions = await encrypt(JSON.stringify(finalPermissions), secret)
    cookieStore.set('permissions', JSON.stringify(finalPermissions), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return data?.data as AdminAuthSuccess
  } catch (error) {
    // Network or unexpected error; return a structured error instead of throwing
    const message = error instanceof Error ? error.message : 'Authentication failed'
    return { error: message }
  }
}

export const adminLogout = async () => {
  const cookieStore = await cookies()

  try {
    // Call logout API endpoint
    await fetch(baseURL + '/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Logout API call failed:', error)
    // Continue with local cleanup even if API call fails
  } finally {
    // Always remove the token cookie regardless of API response
    cookieStore.delete('adminToken')
    cookieStore.delete('permissions')
    cookieStore.delete('userRole')
    // Redirect to login page after logout
    redirect('/admin/login')
  }
}

// =============================
// *** User Authentications ***
// =============================
export const registerUser = async (
  data: any
): Promise<{ data: { token: string; user: User } | null; errors: any }> => {
  const cookieStore = await cookies()
  try {
    const res = await fetch(baseURL + '/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // if (!res.ok) {
    //   return { data: null, errors: ['Something went wrong!!!'] }
    // }

    const userData = await res.json()

    cookieStore.set('token', userData?.data?.token || null, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    cookieStore.set('user', JSON.stringify(userData.data?.user))

    if (userData?.errors) {
      return { data: null, errors: userData?.errors }
    }

    return { data: userData?.data, errors: userData?.message }
  } catch {
    return { data: null, errors: ['Something went wrong!'] }
  }
}

export const authenticate = async (
  data: any
): Promise<{ data: { token: string; user: User } | null; errors: any }> => {
  const cookieStore = await cookies()
  try {
    const res = await fetch(baseURL + '/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const userData = await res.json()

    cookieStore.set('token', userData?.data?.token || null, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    cookieStore.set('user', JSON.stringify(userData?.data?.user))

    if (userData?.data?.errors) {
      return { data: null, errors: userData?.data?.errors }
    }

    return { data: userData?.data, errors: userData?.message }
  } catch {
    return { data: null, errors: ['Something went wrong!'] }
  }
}

export const userLogout = async () => {
  const cookieStore = await cookies()

  try {
    // Call logout API endpoint
    await fetch(baseURL + '/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Logout API call failed:', error)
    // Continue with local cleanup even if API call fails
  } finally {
    // Always remove the token cookie regardless of API response
    cookieStore.delete('token')
    cookieStore.delete('user')

    // Redirect to login page after logout
    redirect('/')
  }
}

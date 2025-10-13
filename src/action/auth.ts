'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API

// =============================
// *** Admin Authentications ***
// =============================
export const authenticateAdmin = async (email: string, password: string) => {
  const cookieStore = await cookies()

  try {
    const response = await fetch(baseURL + '/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Authentication failed')
    }

    const data = await response.json()

    cookieStore.set('adminToken', data?.data?.token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    const userRole = data?.data?.admin?.role // returns 'ADMIN' or 'MODERATOR'

    console.log('userRole :>> ', userRole)

    // Store user role in cookie
    cookieStore.set('userRole', userRole, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Extract and transform permissions data structure
    const rawPermissions = data?.data?.admin?.customRole?.permissions || []

    // Transform from array format to single object format
    // From: [{ resource: "products", actions: [...] }]
    // To: { products: [...], users: [...] }
    const transformedPermissions = rawPermissions.reduce((acc: any, permission: any) => {
      acc[permission.resource] = permission.actions
      return acc
    }, {})

    // If user is ADMIN, they have full permissions regardless of customRole
    const finalPermissions = userRole === 'ADMIN' ? { __superAdmin: true } : transformedPermissions

    // const permissions = await encrypt(JSON.stringify(finalPermissions), secret)
    cookieStore.set('permissions', JSON.stringify(finalPermissions), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return data?.data
  } catch {
    toast.error('Invalid credentials')
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

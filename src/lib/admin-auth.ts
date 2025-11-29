import { cookies } from 'next/headers'

export type PermissionMap = Record<string, string[]>

export interface NormalizedAdminUser {
  name?: string
  email?: string
  isAdmin?: boolean
  isSuperAdmin?: boolean
  permissions?: string[] | Array<{ resource: string; actions: string[] }>
  accessToken?: string
  refreshToken?: string
  [key: string]: any
}

export interface NormalizedAdminAuth {
  user: NormalizedAdminUser
  token: string
  isAdmin: boolean
  isSuperAdmin: boolean
  permissions: PermissionMap | { __superAdmin: true }
}

const normalizeAction = (action: string) => {
  const a = (action || '').toLowerCase()
  if (a === 'read' || a === 'list' || a === 'get') return 'index'
  return a
}

export const mapPermissionStrings = (
  permissions: NormalizedAdminUser['permissions']
): PermissionMap => {
  if (!permissions) return {}

  // String array format: ["role.create", "post.read"]
  if (Array.isArray(permissions) && permissions.every((p) => typeof p === 'string')) {
    return (permissions as string[]).reduce((acc: PermissionMap, p: string) => {
      const [resourceRaw, actionRaw] = p.split('.')
      const resource = (resourceRaw || '').trim()
      const action = normalizeAction((actionRaw || '').trim())
      if (!resource || !action) return acc
      acc[resource] = acc[resource] || []
      if (!acc[resource].includes(action)) acc[resource].push(action)
      return acc
    }, {})
  }

  // Legacy array of objects: [{ resource, actions: [] }]
  if (Array.isArray(permissions)) {
    return (permissions as Array<{ resource: string; actions: string[] }>).reduce(
      (acc: PermissionMap, p) => {
        const resource = p?.resource
        const actions = Array.isArray(p?.actions) ? p.actions.map(normalizeAction) : []
        if (resource) acc[resource] = actions
        return acc
      },
      {}
    )
  }

  return {}
}

export const normalizeAdminAuthPayload = (payload: any): NormalizedAdminAuth => {
  // Prefer new shape: data.user
  const apiUser: NormalizedAdminUser | null = payload?.data?.user || payload?.user || null
  const accessToken: string | undefined =
    apiUser?.accessToken || payload?.data?.accessToken || payload?.accessToken
  const refreshToken: string | undefined = apiUser?.refreshToken || payload?.refreshToken

  // Fallback for legacy shapes
  const legacyUser = payload?.data?.data?.user || payload?.data?.user
  const legacyToken = payload?.data?.data?.accessToken || payload?.data?.accessToken

  const user = (apiUser || legacyUser || {}) as NormalizedAdminUser
  const token = accessToken || legacyToken || refreshToken || ''

  const isAdmin = Boolean(user?.isAdmin)
  // Only treat users with explicit isSuperAdmin=true as super admins (no admin bypass)
  const isSuperAdmin = Boolean(user?.isSuperAdmin)

  const transformed = mapPermissionStrings(user?.permissions)
  const permissions = isSuperAdmin ? ({ __superAdmin: true } as const) : transformed

  return { user, token, isAdmin, isSuperAdmin, permissions }
}

export const persistAdminSession = async (session: NormalizedAdminAuth) => {
  const cookieStore = await cookies()

  const { user, token, isAdmin, isSuperAdmin, permissions } = session

  // Store token in cookie if available
  if (token) {
    cookieStore.set('adminToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
  }

  // Store user info in cookie (readable by client UI)
  cookieStore.set(
    'adminInfo',
    JSON.stringify({
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      isAdmin,
      isSuperAdmin
    }),
    {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  )

  // Store role indicator in cookie (server-use)
  cookieStore.set('userRole', isSuperAdmin ? 'SUPER_ADMIN' : isAdmin ? 'ADMIN' : 'USER', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  // Store permissions (httpOnly)
  cookieStore.set('permissions', JSON.stringify(permissions), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export const clearAdminSession = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('adminInfo')
  cookieStore.delete('adminToken')
  cookieStore.delete('permissions')
  cookieStore.delete('userRole')
}

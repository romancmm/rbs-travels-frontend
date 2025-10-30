import { z } from 'zod'

// Admin role enum
export enum AdminRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
  //   SUPER_ADMIN = 'SUPER_ADMIN',
}

// Role type (matches backend response)
export interface Role {
  id: string
  name: string
  permissions?: Permission[]
}

export interface Permission {
  id: string
  name: string
}

// Unified admin schema (password optional for updates)
export const CreateAdminSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  isActive: z.boolean().default(true),
  isAdmin: z.boolean().default(true),
  roleIds: z.array(z.string()).optional() // Changed from roleId to roleIds (array)
})

// TypeScript types - use Zod inference
export type CreateAdminType = z.infer<typeof CreateAdminSchema>
export type UpdateAdminType = CreateAdminType // Use same type for both

// Admin user response type (matches API response with multiple roles)
export interface AdminUser {
  id: number | string
  avatar: string
  name: string
  email: string
  isActive: boolean
  isAdmin: boolean
  roles?: Role[] // Changed from roleId to roles array
  permissions?: string[] // Combined permissions from all roles
  isSuperAdmin?: boolean
  createdAt: string
  updatedAt: string
}

export type AdminResponseType = AdminUser

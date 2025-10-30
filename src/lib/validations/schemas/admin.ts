import { z } from 'zod'

// Admin role enum
export enum AdminRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
  //   SUPER_ADMIN = 'SUPER_ADMIN',
}

// Unified admin schema (password optional for updates)
export const CreateAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  isActive: z.boolean().default(true),
  isAdmin: z.boolean().default(true),
  roleId: z.string().optional()
})

// TypeScript types - use Zod inference
export type CreateAdminType = z.infer<typeof CreateAdminSchema>
export type UpdateAdminType = CreateAdminType // Use same type for both

// Admin user response type (matches API response)
export interface AdminUser {
  id: number
  name: string
  email: string
  isActive: boolean
  isAdmin: boolean
  roleId?: string
  createdAt: string
  updatedAt: string
}

export type AdminResponseType = AdminUser

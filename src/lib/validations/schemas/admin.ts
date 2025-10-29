import { z } from 'zod'

// Admin role enum
export enum AdminRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
  //   SUPER_ADMIN = 'SUPER_ADMIN',
}

// Unified admin schema (password optional for updates)
export const CreateAdminSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(AdminRole),
  phone: z.string().optional(),
  telegramUsername: z.string().optional()
})

// TypeScript types
export type CreateAdminType = z.infer<typeof CreateAdminSchema>
export type UpdateAdminType = CreateAdminType // Use same type for both

// Admin user response type (matches API response)
export interface AdminUser {
  id: number
  email: string
  firstName: string
  lastName: string
  role: AdminRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type AdminResponseType = AdminUser

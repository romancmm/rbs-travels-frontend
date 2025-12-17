import { z } from 'zod'

export const permissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  resource: z.string().optional(),
  action: z.string().optional()
})

export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
  permissions: z.array(permissionSchema).default([])
})

export type Permission = z.infer<typeof permissionSchema>
export type Role = z.infer<typeof roleSchema>

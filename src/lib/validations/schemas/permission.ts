import { z } from 'zod'

export const permissionSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, 'Permission name must be at least 2 characters')
    .regex(
      /^[a-z]+\.[a-z]+$/,
      'Permission name must be in format: resource.action (e.g., admin.create)'
    )
})

export type Permission = z.infer<typeof permissionSchema>

import { z } from 'zod'

export const defaultFilter = z.object({
  q: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  status: z.enum(['active', 'disabled']).optional()
})

export const productFilterSchema = z
  .object({
    category: z.string().optional().nullable(),
    attributes: z.string().optional(),
    brand: z.string().optional(),
    ratings: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional()
  })
  .merge(defaultFilter)

export const categoryFilterSchema = z
  .object({
    parent: z.string().optional()
  })
  .merge(defaultFilter)

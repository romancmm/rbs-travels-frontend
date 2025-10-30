import { z } from 'zod'

export const defaultFilter = z.object({
  q: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10)
})

export const orderFilterSchema = z
  .object({
    orderNumber: z.string().optional(),
    phone: z.string().optional(),
    status: z
      .enum([
        'PENDING',
        'PROCESSING',
        'PROCESSED',
        'COMPLETED',
        'SHIPPING',
        'DELIVERED',
        'REFUNDED',
        'CANCELLED'
      ])
      .optional()
  })
  .merge(defaultFilter)

export const categoryFilterSchema = z
  .object({
    parent: z.string().optional()
  })
  .merge(defaultFilter)

export const blogsFilterSchema = z
  .object({
    categorySlug: z.string().optional()
  })
  .merge(defaultFilter)

export const productFilterSchema = z
  .object({
    barcode: z.string().optional(),
    ratings: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional() // z.union([z.string(), z.array(z.string())]).optional()
  })
  .merge(defaultFilter)

export const stockFilterSchema = z
  .object({
    sku: z.string().optional(),
    storeId: z.string().optional(),
    productId: z.string().optional()
  })
  .merge(defaultFilter)

export const reviewFilterSchema = z
  .object({
    rating: z.number().optional(),
    productId: z.number().optional(),
    userId: z.number().optional()
  })
  .merge(defaultFilter)

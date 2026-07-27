import z from 'zod'

export const paginationSchema = z.object({
  // 1-indexed in URL; subtract 1 when building API request (API is 0-indexed)
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12)
})

export const defaultFilter = z
  .object({
    q: z.string().optional()
  })
  .merge(paginationSchema)

export const categoryFilterSchema = z
  .object({
    parent: z.string().optional()
  })
  .merge(defaultFilter)

export const blogsFilterSchema = z
  .object({
    categorySlugs: z.string().optional(),
    isPublished: z.string().optional()
  })
  .merge(defaultFilter)

// ── Inferred types ─────────────────────────────────────────────────────────────
export type CategoryFilter = z.infer<typeof categoryFilterSchema>
export type BlogsFilter = z.infer<typeof blogsFilterSchema>
export type DefaultFilter = z.infer<typeof defaultFilter>

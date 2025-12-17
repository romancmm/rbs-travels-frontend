import { z } from 'zod'

// === Page Content Schema (for individual page content editing) ===
export const pageContentSchema = z.object({
  id: z.string().optional(), // for tracking purposes
  title: z.string().min(1, 'Title is required'),
  pageSlug: z.string().min(1, 'Page slug is required'),
  content: z.string().min(1, 'Content is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean()
})

// === Page Item Interface (for recursive structure) ===
export interface PageItem {
  id?: string
  title: string
  slug: string
  parentSlug?: string
  isActive: boolean
  showInMenu: boolean
  menuOrder: number
  depth: number
  path?: string
  hasContent: boolean
  icon?: string
  target: '_self' | '_blank'
  url?: string
  children?: PageItem[]
}

// === Page Item Schema (for tree structure and menu management) ===
export const pageItemSchema: z.ZodType<PageItem> = z.lazy(() =>
  z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    parentSlug: z.string().optional(),
    isActive: z.boolean(),
    showInMenu: z.boolean(),
    menuOrder: z.number(),
    depth: z.number(),
    path: z.string().optional(),
    hasContent: z.boolean(),
    icon: z.string().optional(),
    target: z.enum(['_self', '_blank']),
    url: z.string().optional(),
    children: z.array(pageItemSchema).optional()
  })
)

// === Page Item Form Schema (extends pageItemSchema for form usage) ===
export const pageItemFormSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    parentSlug: z.string().optional(),
    isActive: z.boolean(),
    showInMenu: z.boolean(),
    menuOrder: z.number().min(0),
    depth: z.number().min(0),
    path: z.string().optional(),
    hasContent: z.boolean(),
    icon: z.string().optional(),
    target: z.enum(['_self', '_blank']),
    url: z.string().optional(),
    isExternal: z.boolean() // Helper field for form state
  })
  .refine(
    (data: any) => {
      // If it's an external link, URL is required
      if (data.isExternal && (!data.url || data.url.trim() === '')) {
        return false
      }
      return true
    },
    {
      message: 'URL is required for external links',
      path: ['url']
    }
  )

// === Main Page Settings Schema ===
export const pageSchema = z.object({
  pages: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, 'Title is required'),
      slug: z.string().min(1, 'Slug is required'),
      parentSlug: z.string().optional(),
      isActive: z.boolean(),
      showInMenu: z.boolean(),
      menuOrder: z.number(),
      depth: z.number(),
      path: z.string().optional(),
      hasContent: z.boolean(),
      icon: z.string().optional(),
      target: z.enum(['_self', '_blank']),
      url: z.string().optional(),
      children: z.array(z.any()).optional() // Allow any for recursive validation
    })
  )
})

// === Recursive Page Settings Schema (for nested validation) ===
export const pageSettingsSchema = z.object({
  pages: z.array(pageItemSchema)
})

// === Tree Node Interface (for UI display) ===
export interface PageTreeNode extends Omit<PageItem, 'children'> {
  children: PageTreeNode[]
  level: number
}

export type PageContent = z.infer<typeof pageContentSchema>
export type PageItemFormData = z.infer<typeof pageItemFormSchema>
export type PageSettings = z.infer<typeof pageSchema>
export type PageSettingsRecursive = z.infer<typeof pageSettingsSchema>

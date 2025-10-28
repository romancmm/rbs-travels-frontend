import { z } from 'zod'

/**
 * Blog Validation Schemas
 *
 * This file contains all Zod validation schemas for Blog operations:
 * - BlogSeoSchema: SEO fields validation
 * - CreateBlogSchema: For creating new blog posts
 * - UpdateBlogSchema: For updating existing blog posts (includes ID)
 */

// SEO schema for blog posts

export const BlogCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().optional() // Auto-generated from name
})

// Create category schema (only name is required)
export const CreateBlogCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters')
})

// Update category schema
export const UpdateBlogCategorySchema = CreateBlogCategorySchema.partial().extend({
  id: z.number()
})

export const BlogSeoSchema = z.object({
  title: z
    .string()
    .min(1, 'SEO title is required')
    .max(60, 'SEO title must be less than 60 characters'),
  description: z
    .string()
    .min(1, 'SEO description is required')
    .max(160, 'SEO description must be less than 160 characters'),
  keywords: z.array(z.string())
})

// Create blog schema
export const CreateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be less than 200 characters'),
  categoryId: z.number().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(500, 'Excerpt must be less than 500 characters'),
  source: z.url('Source must be a valid URL'),
  thumbnail: z.string().optional(),
  gallery: z.array(z.string()),
  tags: z.array(z.string()),
  isPublished: z.boolean(),
  seo: BlogSeoSchema
})

// Update blog schema (same as create but with optional fields for partial updates)
export const UpdateBlogSchema = CreateBlogSchema.partial().extend({
  id: z.number()
})

// Type exports
export type BlogCategoryType = z.infer<typeof BlogCategorySchema>
export type CreateBlogCategoryType = z.infer<typeof CreateBlogCategorySchema>
export type UpdateBlogCategoryType = z.infer<typeof UpdateBlogCategorySchema>
export type CreateBlogType = z.infer<typeof CreateBlogSchema>
export type UpdateBlogType = z.infer<typeof UpdateBlogSchema>
export type BlogSeoType = z.infer<typeof BlogSeoSchema>

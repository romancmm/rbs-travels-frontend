import { z } from 'zod'

/**
 * Article Validation Schemas
 *
 * This file contains all Zod validation schemas for Article operations:
 * - ArticleSeoSchema: SEO fields validation
 * - CreateArticleSchema: For creating new blog posts
 * - UpdateArticleSchema: For updating existing blog posts (includes ID)
 */

// SEO schema for blog posts

export const ArticleCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().optional() // Auto-generated from name
})

// Create category schema (only name is required)
export const CreateArticleCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters')
})

// Update category schema
export const UpdateArticleCategorySchema = CreateArticleCategorySchema.partial().extend({
  id: z.number()
})

export const ArticleSeoSchema = z.object({
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
export const CreateArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be less than 200 characters'),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  thumbnail: z.string().url('Thumbnail must be a valid URL').optional(),
  gallery: z.array(z.string().url('Gallery images must be valid URLs')),
  seo: ArticleSeoSchema,
  categoryIds: z.array(z.string()),
  tags: z.array(z.string()),
  isPublished: z.boolean(),
  publishedAt: z.string().datetime().optional()
})

// Update blog schema (same as create but with optional fields for partial updates)
export const UpdateArticleSchema = CreateArticleSchema.partial().extend({
  id: z.number()
})

// Type exports
export type ArticleCategoryType = z.infer<typeof ArticleCategorySchema>
export type CreateArticleCategoryType = z.infer<typeof CreateArticleCategorySchema>
export type UpdateArticleCategoryType = z.infer<typeof UpdateArticleCategorySchema>
export type CreateArticleType = z.infer<typeof CreateArticleSchema>
export type UpdateArticleType = z.infer<typeof UpdateArticleSchema>
export type ArticleSeoType = z.infer<typeof ArticleSeoSchema>

import { z } from 'zod'
import { titleSubtitleDescSchema } from './homepageSettings'

const testimonial = z.object({
  name: z.string().optional(),
  designation: z.string().optional(),
  avatar: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  review: z.string().optional(),
  company: z.string().optional()
})

export const testimonialSettingsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  testimonials: z.array(testimonial).default([])
})

export const homepageTestimonialSchema = titleSubtitleDescSchema.extend({
  testimonials: z.array(testimonial).optional()
})

export type TestimonialSettings = z.infer<typeof testimonialSettingsSchema>
export type HomepageTestimonialType = z.infer<typeof homepageTestimonialSchema>
export type TestimonialType = z.infer<typeof testimonial>

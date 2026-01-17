import { z } from 'zod'

// === Sister Concern Item Schema ===
const sisterConcernItemSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  logo: z.string().min(1, 'Logo is required'),
  url: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true)
})

// === Sister Concern Settings Schema ===
export const sisterConcernSettingsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  companies: z.array(sisterConcernItemSchema).default([])
})

// === Type Exports ===
export type SisterConcernSettings = z.infer<typeof sisterConcernSettingsSchema>
export type SisterConcernItem = z.infer<typeof sisterConcernItemSchema>

// === Schema Validation Helpers ===
export const validateSisterConcernSettings = (data: unknown) => {
  return sisterConcernSettingsSchema.safeParse(data)
}

import { z } from 'zod'

// === Client Logo Item Schema ===
const clientLogoItemSchema = z.object({
  name: z.string().optional(),
  logo: z.string().min(1, 'Logo is required'),
  url: z.string().optional(),
  isActive: z.boolean().default(true)
})

// === Client Settings Schema ===
export const clientSettingsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  clients: z.array(clientLogoItemSchema).default([])
})

// === Type Exports ===
export type ClientSettings = z.infer<typeof clientSettingsSchema>
export type ClientLogoItem = z.infer<typeof clientLogoItemSchema>

// === Schema Validation Helpers ===
export const validateClientSettings = (data: unknown) => {
  return clientSettingsSchema.safeParse(data)
}

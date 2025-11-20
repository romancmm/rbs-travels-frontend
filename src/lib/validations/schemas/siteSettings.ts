import { z } from 'zod'

// === Helper Types ===
const optionalStr = () => z.string().optional()
const relaxedUrl = () => z.union([z.string(), z.literal(''), z.literal(null)]).optional()

// === Theme ===
const themeSchema = z.object({
  color: z
    .object({
      primary: optionalStr(),
      secondary: optionalStr(),
      accent: optionalStr(),
      text: optionalStr(),
      'header-background': optionalStr(),
      'header-color': optionalStr(),
      'footer-background': optionalStr(),
      'footer-color': optionalStr()
    })
    .optional(),
  fontFamily: optionalStr(),
  darkMode: z.boolean().optional()
})

// === Social Links ===
const socialLinksSchema = z.object({
  facebook: relaxedUrl(),
  twitter: relaxedUrl(),
  instagram: relaxedUrl(),
  linkedin: relaxedUrl(),
  youtube: relaxedUrl(),
  tiktok: relaxedUrl()
})

// === SEO ===
const seoSchema = z.object({
  metaName: optionalStr(),
  metaTitle: optionalStr(),
  metaDescription: optionalStr(),
  siteAuthor: optionalStr(),
  ogImage: optionalStr(),
  canonicalUrl: optionalStr(),
  metaKeywords: z.array(z.string()).optional()
})
// === Header Navigation Item ===
const headerNavigationItemSchema = z.object({
  title: optionalStr(),
  url: optionalStr()
})

// === Header ===
const headerSchema = z.object({
  navigation: z.array(headerNavigationItemSchema).optional()
})

// === Footer Credit ===
const footerCreditSchema = z.object({
  showCredit: z.boolean().optional(),
  companyName: optionalStr(),
  url: optionalStr()
})

// === Footer ===
const footerSchema = z.object({
  copyright: optionalStr(),
  credit: footerCreditSchema.optional()
})

// === Language ===
const languageSchema = z.object({
  code: z.string(),
  name: z.string(),
  isDefault: z.boolean().optional()
})

// === Analytics Settings ===
const analyticsSchema = z.object({
  googleAnalyticsId: optionalStr(),
  facebookPixelId: optionalStr()
})

// === Address Item ===
const addressItemSchema = z.object({
  title: optionalStr(),
  address: optionalStr(),
  phone: optionalStr(),
  email: z.string().email().optional().or(z.literal(''))
})

// === Main Site Settings Schema ===
export const siteSettingsSchema = z.object({
  id: optionalStr(),
  name: optionalStr(),
  email: z.string().email().optional().or(z.literal('')),
  phone: optionalStr(),
  hotline: optionalStr(),
  address: optionalStr(),
  workingHours: optionalStr(),
  promoText: z.array(optionalStr()).optional(),
  addresses: z.array(addressItemSchema).optional(),
  website: relaxedUrl(),
  shortDescription: optionalStr(),
  favicon: relaxedUrl(),
  logo: z
    .object({
      default: relaxedUrl(),
      dark: relaxedUrl()
    })
    .optional(),
  theme: themeSchema.optional(),
  socialLinks: socialLinksSchema.optional(),
  seo: seoSchema.optional(),
  header: headerSchema.optional(),
  footer: footerSchema.optional(),
  maintenanceMode: z.boolean().optional(),
  locale: optionalStr(),
  languages: z.array(languageSchema).optional(),
  analytics: analyticsSchema.optional()
})

export type SiteSettings = z.infer<typeof siteSettingsSchema>

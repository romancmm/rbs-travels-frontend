import { z } from 'zod'

// === Base Schemas ===
const optionalString = z.string().optional()

// === Reusable Content Block Schemas ===
export const titleSubtitleDescSchema = z.object({
  title: optionalString,
  subTitle: optionalString,
  desc: optionalString
})

const facilityItemSchema = z.object({
  title: optionalString,
  desc: optionalString,
  icon: optionalString
})

const statItemSchema = z.object({
  value: optionalString,
  label: optionalString,
  icon: optionalString
})

const experienceSchema = z.object({
  years: optionalString,
  text: optionalString
})

const destinationItemSchema = z.object({
  id: z.number().optional(),
  name: optionalString,
  image: optionalString,
  workers: optionalString,
  description: optionalString,
  topSectors: z.array(z.string()).default([]),
  averageSalary: optionalString,
  visaType: optionalString
})

// const testimonialItemSchema = z.object({
//   name: optionalString,
//   designation: optionalString,
//   avatar: optionalString,
//   rating: z.number().min(1).max(5).optional(),
//   review: optionalString,
//   date: optionalString
// })

// === Complex Component Schemas ===
export const bannerSectionSchema = z.array(
  titleSubtitleDescSchema.extend({
    bgImage: z.string(),
    isActive: z.boolean().default(true),
    buttons: z
      .array(
        z.object({
          title: z.string(),
          url: z.string()
        })
      )
      .optional()
  })
)

// const testimonialsSectionSchema = z.object({
//   title: optionalString,
//   subtitle: optionalString,
//   testimonials: z.array(testimonialItemSchema).default([])
// })

const aboutSectionSchema = titleSubtitleDescSchema.extend({
  image: optionalString,
  experience: experienceSchema.optional(),
  facilities: z.array(facilityItemSchema).default([]),
  stats: z.array(statItemSchema).default([])
})

const whoWeAreSectionSchema = titleSubtitleDescSchema.extend({
  iconType: z.enum(['icon', 'image']).default('icon'),
  features: z.array(facilityItemSchema).default([])
})

const topCountriesSectionSchema = z.object({
  title: optionalString,
  subtitle: optionalString,
  destinations: z.array(destinationItemSchema).default([])
})
// const offersSectionSchema = titleSubtitleDescSchema
// const categoriesSectionSchema = titleSubtitleDescSchema
// const platformSectionSchema = titleSubtitleDescSchema
// const subscribeSectionSchema = titleSubtitleDescSchema
// const howToWorksSchema = titleSubtitleDescSchema.extend({
//   facilities: z.array(facilityItemSchema).default([])
// })

// === Main Homepage Settings Schema ===
export const homepageSettingsSchema = z
  .object({
    banners: bannerSectionSchema.optional(),
    about: aboutSectionSchema.optional(),
    whoWeAre: whoWeAreSectionSchema.optional(),
    topCountries: topCountriesSectionSchema.optional()
    // testimonial: testimonialsSectionSchema.optional()
    // whyChoose: whyChooseSectionSchema.optional()
    // offers: offersSectionSchema.optional(),
    // howToWorks: howToWorksSchema.optional()
    // categories: categoriesSectionSchema.optional(),
    // platform: platformSectionSchema.optional(),
    // subscribe: subscribeSectionSchema.optional()
  })
  .strict()

// === Type Exports ===
export type HomepageSettings = z.infer<typeof homepageSettingsSchema>

// Section-specific types for better modularity
export type BannerType = z.infer<typeof bannerSectionSchema>
export type WhoWeAreType = z.infer<typeof whoWeAreSectionSchema>
export type AboutType = z.infer<typeof aboutSectionSchema>
export type TopCountriesType = z.infer<typeof topCountriesSectionSchema>
// export type TestimonialsType = z.infer<typeof testimonialsSectionSchema>

// Utility types for form components
export type FacilityItem = z.infer<typeof facilityItemSchema>
export type StatItem = z.infer<typeof statItemSchema>
export type DestinationItem = z.infer<typeof destinationItemSchema>
// export type TestimonialItem = z.infer<typeof testimonialItemSchema>

// === Schema Validation Helpers ===
export const validateHomepageSettings = (data: unknown) => {
  return homepageSettingsSchema.safeParse(data)
}

export const validateSection = <T>(schema: z.ZodType<T>, data: unknown) => {
  return schema.safeParse(data)
}

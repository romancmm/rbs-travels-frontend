export interface PageSection {
  type: 'hero' | 'text' | 'stats' | 'testimonials' | 'payment-methods' | 'security-tips'
  title?: string
  subtitle?: string
  description?: string
  content?: string
  stats?: Array<{
    number: string
    label: string
  }>
  testimonials?: Array<{
    id: number
    name: string
    role: string
    company: string
    content: string
    rating: number
    avatar: string
  }>
  methods?: Array<{
    name: string
    description: string
    icon: string
    processingTime: string
  }>
  tips?: Array<{
    icon: string
    title: string
    description: string
  }>
}

export interface PageSEO {
  keywords: string[]
  ogImage: string
}

export interface PageContent {
  sections: PageSection[]
}

export interface Page {
  id: string
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  content: PageContent
  seo: PageSEO
  lastUpdated: string
}

export type PagesData = Record<string, Page>

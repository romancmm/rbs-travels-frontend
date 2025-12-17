import ArticleDetails from '@/components/frontend/details/ArticleDetails'
import PackageDetails from '@/components/frontend/details/PackageDetails'
import ProductDetails from '@/components/frontend/details/ProductDetails'
import ServiceDetails from '@/components/frontend/details/ServiceDetails'
import { notFound } from 'next/navigation'

interface DynamicEntityPageProps {
  params: Promise<{
    type: string
    slug: string
  }>
}

// Define allowed entity types
const ENTITY_TYPES = {
  articles: 'articles',
  products: 'products',
  services: 'services',
  packages: 'packages',
  blogs: 'articles' // Alias: blogs -> articles
} as const

type EntityType = keyof typeof ENTITY_TYPES

export default async function DynamicEntityPage({ params }: DynamicEntityPageProps) {
  const { type, slug } = await params

  // Validate entity type
  if (!(type in ENTITY_TYPES)) {
    notFound()
  }

  // Normalize type (handle aliases)
  const normalizedType = ENTITY_TYPES[type as EntityType]

  // Route to appropriate component based on type
  switch (normalizedType) {
    case 'articles':
      return <ArticleDetails slug={slug} />

    case 'products':
      return <ProductDetails slug={slug} />

    case 'services':
      return <ServiceDetails slug={slug} />

    case 'packages':
      return <PackageDetails slug={slug} />

    default:
      notFound()
  }
}

// Generate static params for known entities (optional, for static generation)
export async function generateStaticParams() {
  // You can fetch all slugs from your API here
  // For now, return empty array for dynamic generation
  return []
}

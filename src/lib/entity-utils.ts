/**
 * Entity URL Utilities
 * Helper functions to generate URLs for different entity types
 */

export type EntityType = 'articles' | 'products' | 'services' | 'packages' | 'blogs'

/**
 * Generate URL for entity detail page
 * @param type - Entity type (articles, products, services, packages)
 * @param slug - Entity slug
 * @returns Formatted URL string
 */
export function getEntityUrl(type: EntityType, slug: string): string {
  // Handle alias: blogs -> articles
  const normalizedType = type === 'blogs' ? 'articles' : type

  return `/${normalizedType}/${slug}`
}

/**
 * Generate URL for entity listing page
 * @param type - Entity type
 * @param category - Optional category slug
 * @returns Formatted URL string
 */
export function getEntityListingUrl(type: EntityType, category?: string): string {
  const normalizedType = type === 'blogs' ? 'articles' : type

  if (category) {
    return `/${normalizedType}/category/${category}`
  }

  return `/${normalizedType}`
}

/**
 * Parse entity type and slug from URL pathname
 * @param pathname - URL pathname (e.g., '/articles/my-post')
 * @returns Object with type and slug, or null if invalid
 */
export function parseEntityUrl(pathname: string): { type: EntityType; slug: string } | null {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length < 2) return null

  const [type, slug] = segments
  const validTypes: EntityType[] = ['articles', 'products', 'services', 'packages', 'blogs']

  if (validTypes.includes(type as EntityType)) {
    return {
      type: type as EntityType,
      slug
    }
  }

  return null
}

/**
 * Content Type Configuration
 * Central configuration for all content types in the CMS
 */

export type ContentType =
  | 'page'
  | 'post'
  | 'category'
  | 'service'
  | 'product'
  | 'package'
  | 'gallery'

export interface ContentTypeConfig {
  apiEndpoint: string // API endpoint to fetch data
  baseRoute: string // Frontend base route
  hasDetail: boolean // Whether it has detail pages
  hasListing: boolean // Whether it has listing pages
  listingEndpoint?: string // Optional different endpoint for listing
  detailRenderer: 'page-builder' | 'blog' | 'product' | 'service' | 'package' | 'gallery' // Which renderer to use
  listingRenderer?: 'blog-list' | 'product-grid' | 'service-grid' | 'gallery-grid' | 'package-list'
  seoFields: {
    title: string
    description: string
    image?: string
  }
}

export const CONTENT_TYPE_CONFIG: Record<ContentType, ContentTypeConfig> = {
  page: {
    apiEndpoint: '/pages',
    baseRoute: '/page',
    hasDetail: true,
    hasListing: false,
    detailRenderer: 'page-builder',
    seoFields: {
      title: 'title',
      description: 'seo.description',
      image: 'seo.image'
    }
  },
  post: {
    apiEndpoint: '/article/posts',
    baseRoute: '/page',
    hasDetail: true,
    hasListing: true,
    listingEndpoint: '/article/posts',
    detailRenderer: 'blog',
    listingRenderer: 'blog-list',
    seoFields: {
      title: 'title',
      description: 'excerpt',
      image: 'featuredImage'
    }
  },
  category: {
    apiEndpoint: '/articles/categories',
    baseRoute: '/page',
    hasDetail: false,
    hasListing: true,
    listingEndpoint: '/article/posts',
    detailRenderer: 'blog',
    listingRenderer: 'blog-list',
    seoFields: {
      title: 'name',
      description: 'description'
    }
  },
  service: {
    apiEndpoint: '/services',
    baseRoute: '/page',
    hasDetail: true,
    hasListing: true,
    listingEndpoint: '/services',
    detailRenderer: 'service',
    listingRenderer: 'service-grid',
    seoFields: {
      title: 'title',
      description: 'excerpt',
      image: 'featuredImage'
    }
  },
  product: {
    apiEndpoint: '/products',
    baseRoute: '/page',
    hasDetail: true,
    hasListing: true,
    listingEndpoint: '/products',
    detailRenderer: 'product',
    listingRenderer: 'product-grid',
    seoFields: {
      title: 'title',
      description: 'description',
      image: 'images[0]'
    }
  },
  package: {
    apiEndpoint: '/packages',
    baseRoute: '/page',
    hasDetail: true,
    hasListing: true,
    listingEndpoint: '/packages',
    detailRenderer: 'package',
    listingRenderer: 'package-list',
    seoFields: {
      title: 'title',
      description: 'description',
      image: 'featuredImage'
    }
  },
  gallery: {
    apiEndpoint: '/gallery',
    baseRoute: '/page',
    hasDetail: true,
    hasListing: true,
    listingEndpoint: '/gallery',
    detailRenderer: 'gallery',
    listingRenderer: 'gallery-grid',
    seoFields: {
      title: 'title',
      description: 'description',
      image: 'coverImage'
    }
  }
}

/**
 * Get content type from route path
 */
export function getContentTypeFromPath(path: string): ContentType | null {
  if (path.startsWith('/page/blogs') || path.startsWith('/article/posts')) return 'post'
  if (path.startsWith('/services')) return 'service'
  if (path.startsWith('/products')) return 'product'
  if (path.startsWith('/packages')) return 'package'
  if (path.startsWith('/gallery')) return 'gallery'
  if (path.startsWith('/page')) return 'page'
  return null
}

/**
 * Build API URL for content type
 */
export function buildContentUrl(
  type: ContentType,
  params: {
    id?: string | null
    categoryId?: string | null
    isListing?: boolean
  }
): string {
  const config = CONTENT_TYPE_CONFIG[type]

  // Listing page
  if (params.isListing) {
    const endpoint = config.listingEndpoint || config.apiEndpoint
    if (params.categoryId && type === 'post') {
      return `${endpoint}?categoryId=${params.categoryId}`
    }
    return endpoint
  }

  // Detail page
  if (params.id) {
    return `${config.apiEndpoint}/${params.id}`
  }

  return config.apiEndpoint
}

/**
 * Get nested property value from object using dot notation
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    if (key.includes('[') && key.includes(']')) {
      const [arrayKey, indexStr] = key.split('[')
      const index = parseInt(indexStr.replace(']', ''))
      return current?.[arrayKey]?.[index]
    }
    return current?.[key]
  }, obj)
}

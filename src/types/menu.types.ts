/**
 * Menu Type Definitions - Refactored Structure
 * Following enterprise CMS pattern with generic, polymorphic design
 */

// ==================== MENU ITEM TYPES ====================

export type MenuItemType =
  | 'page'
  | 'post'
  | 'category'
  | 'service'
  | 'product'
  | 'package'
  | 'gallery'
  | 'custom'
  | 'external'

export type MenuPosition = 'header' | 'footer' | 'sidebar' | 'custom'

// ==================== MENU ITEM INTERFACE ====================

export interface MenuItem {
  id: string
  menuId: string
  title: string
  slug: string
  type: MenuItemType
  referenceId?: string | null // UUID for entity types (page, post, category, service, project)
  url?: string | null // URL for custom/external types
  icon?: string | null
  iconType?: 'icon' | 'image' // Lucide icon name or image URL
  target?: '_self' | '_blank'
  cssClass?: string | null
  parentId?: string | null
  order: number
  isPublished: boolean
  meta?: Record<string, any> | null
  children?: MenuItem[]
  createdAt?: string
  updatedAt?: string
}

// ==================== MENU INTERFACE ====================

export interface Menu {
  id: string
  name: string
  slug: string
  position: MenuPosition
  items: MenuItem[]
  itemsCache?: MenuItem[] // JSON cache for public API
  isPublished: boolean
  version?: number
  cacheKey?: string
  createdAt: string
  updatedAt: string
}

// ==================== INPUT TYPES ====================

export interface CreateMenuItemInput {
  title: string
  slug?: string
  type: MenuItemType
  referenceId?: string | null
  url?: string | null
  icon?: string | null
  iconType?: 'icon' | 'image'
  target?: '_self' | '_blank'
  cssClass?: string | null
  parentId?: string | null
  order?: number
  isPublished?: boolean
  meta?: Record<string, any> | null
}

export type UpdateMenuItemInput = Partial<CreateMenuItemInput>

export interface CreateMenuInput {
  name: string
  slug: string
  position?: MenuPosition
  isPublished?: boolean
}

export interface UpdateMenuInput extends Partial<CreateMenuInput> {
  items?: MenuItem[]
}

// ==================== TYPE GUARDS ====================

/**
 * Check if menu item is an entity reference type
 */
export function isEntityMenuItem(item: MenuItem): boolean {
  return ['page', 'post', 'category', 'service', 'product', 'package', 'gallery'].includes(
    item.type
  )
}

/**
 * Check if menu item is a link type
 */
export function isLinkMenuItem(item: MenuItem): boolean {
  return ['custom', 'external'].includes(item.type)
}

/**
 * Check if menu item has children
 */
export function hasChildren(item: MenuItem): boolean {
  return Array.isArray(item.children) && item.children.length > 0
}

// ==================== VALIDATION HELPERS ====================

/**
 * Validate menu item based on type
 */
export function validateMenuItem(item: CreateMenuItemInput | UpdateMenuItemInput): string | null {
  // Entity types require referenceId
  if (isEntityMenuItemType(item.type)) {
    if (!item.referenceId) {
      return `Reference ID is required for ${item.type} type`
    }
  }

  // Link types require url
  if (isLinkMenuItemType(item.type)) {
    if (!item.url) {
      return `URL is required for ${item.type} type`
    }

    // External links must start with http:// or https://
    if (item.type === 'external' && item.url) {
      if (!item.url.startsWith('http://') && !item.url.startsWith('https://')) {
        return 'External URLs must start with http:// or https://'
      }
    }
  }

  return null
}

function isEntityMenuItemType(type?: MenuItemType): boolean {
  return type
    ? ['page', 'post', 'category', 'service', 'product', 'package', 'gallery'].includes(type)
    : false
}

function isLinkMenuItemType(type?: MenuItemType): boolean {
  return type ? ['custom', 'external'].includes(type) : false
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Find menu item by ID (recursive)
 */
export function findMenuItemById(items: MenuItem[], id: string): MenuItem | null {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findMenuItemById(item.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * Flatten menu tree to array
 */
export function flattenMenuItems(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = []

  function traverse(items: MenuItem[]) {
    for (const item of items) {
      result.push(item)
      if (item.children) {
        traverse(item.children)
      }
    }
  }

  traverse(items)
  return result
}

/**
 * Get menu item URL with fallback
 */
export function getMenuItemUrl(item: MenuItem): string {
  if (item.url) return item.url

  // Fallback for entity types without URL
  if (isEntityMenuItem(item)) {
    const typeMap: Record<string, string> = {
      page: '/page',
      post: '/page/blogs',
      category: '/blog/posts',
      service: '/services',
      product: '/products',
      package: '/packages',
      gallery: '/gallery'
    }
    const basePath = typeMap[item.type] || '#'

    // If referenceId is null, return base path (for "All" option)
    if (!item.referenceId) {
      return basePath
    }

    // For specific items, append the ID
    return `${basePath}/${item.referenceId}`
  }

  return '#'
}

/**
 * Create breadcrumb from menu item
 */
export function createBreadcrumb(items: MenuItem[], targetId: string): MenuItem[] {
  const path: MenuItem[] = []

  function findPath(items: MenuItem[], targetId: string, currentPath: MenuItem[]): boolean {
    for (const item of items) {
      const newPath = [...currentPath, item]

      if (item.id === targetId) {
        path.push(...newPath)
        return true
      }

      if (item.children && findPath(item.children, targetId, newPath)) {
        return true
      }
    }
    return false
  }

  findPath(items, targetId, [])
  return path
}

// ==================== CONSTANTS ====================

export const MENU_ITEM_TYPE_LABELS: Record<MenuItemType, string> = {
  page: 'Page',
  post: 'Blog Post',
  category: 'Category',
  service: 'Service',
  product: 'Product',
  package: 'Package',
  gallery: 'Gallery',
  custom: 'Custom Link',
  external: 'External Link'
}

export const MENU_ITEM_TYPE_DESCRIPTIONS: Record<MenuItemType, string> = {
  page: 'Link to a page',
  post: 'Link to a blog post',
  category: 'Link to a category',
  service: 'Link to a service',
  product: 'Link to a product',
  package: 'Link to a package',
  gallery: 'Link to a gallery',
  custom: 'Custom internal link',
  external: 'External website link'
}

/**
 * Menu Type Definitions - Refactored Structure
 * Following enterprise CMS pattern with generic, polymorphic design
 */

// ==================== MENU ITEM TYPES ====================

export type MenuItemType =
  | 'category-articles'
  | 'single-article'
  | 'gallery'
  | 'page'
  | 'custom-link'
  | 'external-link'

export type MenuPosition = 'header' | 'footer' | 'sidebar' | 'custom'

// ==================== MENU ITEM INTERFACE ====================

export interface MenuItem {
  id: string
  menuId: string
  title: string
  slug: string
  type: MenuItemType
  reference?: string | string[] | null // Single string for entity types (page, single-article) OR array for category-blog OR null for link types
  url?: string | null // URL for custom-link and external-link types
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
  reference?: string | string[] | null
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
 * Check if menu item is an entity reference type (single reference)
 */
export function isEntityMenuItem(item: MenuItem): boolean {
  return ['single-article', 'page', 'gallery'].includes(item.type)
}

/**
 * Check if menu item is category-articles type (array reference)
 */
export function isCategoryArticlesMenuItem(item: MenuItem): boolean {
  return item.type === 'category-articles' && Array.isArray(item.reference)
}

/**
 * Check if menu item is a link type
 */
export function isLinkMenuItem(item: MenuItem): boolean {
  return ['custom-link', 'external-link'].includes(item.type)
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
  // Category-articles requires reference as array
  if (item.type === 'category-articles') {
    if (!Array.isArray(item.reference) || item.reference.length === 0) {
      return 'At least one category reference is required for category-articles type'
    }
  }

  // Entity types require single reference (string)
  if (isEntityMenuItemType(item.type)) {
    if (!item.reference || Array.isArray(item.reference)) {
      return `Reference (slug) is required for ${item.type} type`
    }
  }

  // Link types require url
  if (isLinkMenuItemType(item.type)) {
    if (!item.url) {
      return `URL is required for ${item.type} type`
    }

    // External links must start with http:// or https://
    if (item.type === 'external-link' && item.url) {
      if (!item.url.startsWith('http://') && !item.url.startsWith('https://')) {
        return 'External URLs must start with http:// or https://'
      }
    }
  }

  return null
}

function isEntityMenuItemType(type?: MenuItemType): boolean {
  return type ? ['single-article', 'page', 'gallery'].includes(type) : false
}

function isLinkMenuItemType(type?: MenuItemType): boolean {
  return type ? ['custom-link', 'external-link'].includes(type) : false
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
 * Priority: url (for custom-link/external-link) > slug-based URL for all other types
 */
export function getMenuItemUrl(item: MenuItem): string {
  // Priority 1: Return existing URL if set (for custom-link and external-link)
  if (item.type === 'custom-link' || item.type === 'external-link') {
    return item.url || '#'
  }

  // Priority 2: All other types use slug
  // This includes: category-articles, single-article, page, gallery
  if (item.slug) {
    return `/${item.slug}`
  }

  // Fallback
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
  'category-articles': 'Category Articles',
  'single-article': 'Single Article',
  gallery: 'Gallery',
  page: 'Page',
  'custom-link': 'Custom Link',
  'external-link': 'External Link'
}

export const MENU_ITEM_TYPE_DESCRIPTIONS: Record<MenuItemType, string> = {
  'category-articles': 'Article listing from selected categories',
  'single-article': 'Link to a specific article',
  gallery: 'Link to a gallery folder',
  page: 'Link to a CMS page',
  'custom-link': 'Custom internal or external link',
  'external-link': 'External website link (validated)'
}

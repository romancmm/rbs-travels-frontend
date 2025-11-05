/**
 * CMS API Service
 * Centralized API calls for Menu Manager and Page Builder
 *
 * Architecture:
 * - Menu System: HYBRID (Relational MenuItem table + JSON cache for performance)
 * - Page Builder: PURE JSON (Single content field with versioning)
 *
 * Performance:
 * - Public Menu API: Uses itemsCache (3-5ms response)
 * - Admin Menu API: Uses MenuItem relations (20-30ms response)
 * - Page Builder: Pure JSON (8-20ms response)
 */

import type {
  CMSItemResponse,
  CMSListResponse,
  CreateMenuItemPayload,
  CreateMenuPayload,
  CreatePagePayload,
  Menu,
  MenuItem,
  PageLayout,
  UpdateMenuItemPayload,
  UpdateMenuPayload,
  UpdatePagePayload
} from '@/types/cms'
import requests from '../network/http'

// ==================== MENU MANAGER API ====================

export const menuService = {
  /**
   * Fetch all menus with pagination
   */
  getMenus: (params?: { page?: number; limit?: number; position?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.position) query.append('position', params.position)

    return requests.get<CMSListResponse<Menu>>(`/admin/menus?${query.toString()}`)
  },

  /**
   * Fetch menu by position (for frontend rendering - e.g., 'header', 'footer')
   */
  getMenuByPosition: (position: string) => {
    return requests.get<CMSItemResponse<Menu>>(`/menus/position/${position}`)
  },

  /**
   * Fetch single menu by ID
   */
  getMenuById: (id: string) => {
    return requests.get<CMSItemResponse<Menu>>(`/admin/menu/${id}`)
  },

  /**
   * Fetch menu by slug (for frontend rendering)
   */
  // getMenuBySlug: (slug: string) => {
  //   return requests.get<CMSItemResponse<Menu>>(`/admin/menu/${slug}`)
  // },

  /**
   * Create new menu
   */
  createMenu: (payload: CreateMenuPayload) => {
    return requests.post<CMSItemResponse<Menu>>('/admin/menu', payload)
  },

  /**
   * Update menu (including items)
   */
  updateMenu: (id: string, payload: UpdateMenuPayload) => {
    return requests.put<CMSItemResponse<Menu>>(`/admin/menu/${id}`, payload)
  },

  /**
   * Delete menu
   */
  deleteMenu: (id: string) => {
    return requests.delete(`/admin/menu/${id}`)
  },

  /**
   * Create new menu items
   */
  addMenuItems: (payload: MenuItem & { parentId: string }) => {
    return requests.post<CMSItemResponse<MenuItem>>(
      `/admin/menu/${payload.parentId}/items`,
      payload
    )
  },

  /**
   * Create new menu items
   */
  updateMenuItems: (payload: MenuItem & { parentId: string }) => {
    return requests.put<CMSItemResponse<MenuItem>>(
      `/admin/menu/${payload.parentId}/items/${payload.id}`,
      payload
    )
  },

  /**
   * Duplicate menu
   */
  duplicateMenu: (id: string) => {
    return requests.post<CMSItemResponse<Menu>>(`/admin/menu/${id}/duplicate`)
  },

  /**
   * Publish menu
   */
  publishMenu: (id: string) => {
    return requests.patch<CMSItemResponse<Menu>>(`/admin/menu/${id}`, { isPublished: true })
  },

  /**
   * Unpublish menu
   */
  unpublishMenu: (id: string) => {
    return requests.patch<CMSItemResponse<Menu>>(`/admin/menu/${id}`, { isPublished: false })
  },

  // ==================== MENU ITEM MANAGEMENT ====================

  /**
   * Add menu item (hybrid approach - uses relations, auto-regenerates cache)
   */
  addMenuItem: (menuId: string, payload: CreateMenuItemPayload) => {
    return requests.post<CMSItemResponse<MenuItem>>(`/admin/menu/${menuId}/items`, payload)
  },

  /**
   * Update menu item
   */
  updateMenuItem: (menuId: string, itemId: string, payload: UpdateMenuItemPayload) => {
    return requests.put<CMSItemResponse<MenuItem>>(`/admin/menu/${menuId}/items/${itemId}`, payload)
  },

  /**
   * Delete menu item
   */
  deleteMenuItem: (menuId: string, itemId: string) => {
    return requests.delete(`/admin/menu/${menuId}/items/${itemId}`)
  },

  /**
   * Reorder menu items
   */
  reorderMenuItems: (menuId: string, itemOrders: { itemId: string; order: number }[]) => {
    return requests.patch(`/admin/menu/${menuId}/items/reorder`, { itemOrders })
  },

  /**
   * Get public menu (uses itemsCache for ultra-fast response)
   */
  getPublicMenu: (slug: string) => {
    return requests.get<CMSItemResponse<Menu>>(`/menus/${slug}`)
  },

  /**
   * Regenerate menu cache manually
   */
  regenerateMenuCache: (menuId: string) => {
    return requests.post(`/admin/menu/${menuId}/regenerate-cache`)
  }
}

// ==================== PAGE BUILDER API ====================

export const pageBuilderService = {
  /**
   * Fetch all pages with pagination
   */
  getPages: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.search) query.append('search', params.search)

    return requests.get<CMSListResponse<PageLayout>>(`/admin/pages?${query.toString()}`)
  },

  /**
   * Fetch single page by ID
   */
  getPageById: (id: string) => {
    return requests.get<CMSItemResponse<PageLayout>>(`/admin/pages/${id}`)
  },

  /**
   * Fetch page by slug (for frontend rendering)
   */
  getPageBySlug: (slug: string) => {
    return requests.get<CMSItemResponse<PageLayout>>(`/pages/${slug}`)
  },

  /**
   * Create new page
   */
  createPage: (payload: CreatePagePayload) => {
    return requests.post<CMSItemResponse<PageLayout>>('/admin/pages', payload)
  },

  /**
   * Update page
   */
  updatePage: (id: string, payload: UpdatePagePayload) => {
    return requests.put<CMSItemResponse<PageLayout>>(`/admin/pages/${id}`, payload)
  },

  /**
   * Delete page
   */
  deletePage: (id: string) => {
    return requests.delete(`/admin/pages/${id}`)
  },

  /**
   * Duplicate page
   */
  duplicatePage: (id: string) => {
    return requests.post<CMSItemResponse<PageLayout>>(`/admin/pages/${id}/duplicate`)
  },

  /**
   * Publish page
   */
  publishPage: (id: string) => {
    return requests.post<CMSItemResponse<PageLayout>>(`/admin/pages/${id}/publish`)
  },

  /**
   * Unpublish page
   */
  unpublishPage: (id: string) => {
    return requests.post<CMSItemResponse<PageLayout>>(`/admin/pages/${id}/unpublish`)
  },

  /**
   * Get published page (uses publishedContent cache)
   */
  getPublishedPage: (slug: string) => {
    return requests.get<CMSItemResponse<PageLayout>>(`/pages/${slug}`)
  },

  /**
   * Save as draft
   */
  saveDraft: (id: string, payload: UpdatePagePayload) => {
    return requests.patch<CMSItemResponse<PageLayout>>(`/admin/pages/${id}/draft`, payload)
  },

  /**
   * Get page preview URL
   */
  getPreviewUrl: (id: string) => {
    return `/preview/page/${id}`
  },

  /**
   * Track page view (async, non-blocking)
   */
  trackView: (pageId: string) => {
    return requests.post(`/pages/${pageId}/view`).catch(() => {
      // Silent fail - view tracking shouldn't block page load
    })
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate unique ID for builder elements (UUID v4 format)
 */
export const generateId = (): string => {
  // Generate UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Flatten menu items for easier manipulation (recursive traversal)
 */
export const flattenMenuItems = (items: Menu['items']): Menu['items'][0][] => {
  const flat: Menu['items'][0][] = []
  const traverse = (items: Menu['items']) => {
    items.forEach((item) => {
      flat.push(item)
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    })
  }
  traverse(items)
  return flat
}

/**
 * Count total menu items (including nested)
 */
export const countMenuItems = (items: Menu['items']): number => {
  return flattenMenuItems(items).length
}

/**
 * Validate slug format
 */
export const validateSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Clean menu item data before sending to backend
 * Removes null/empty values and ensures proper structure
 */
export const cleanMenuItem = (item: any): any => {
  const cleaned: any = {
    id: item.id,
    title: item.title,
    type: item.type,
    order: item.order,
    target: item.target || '_self'
  }

  // Only add optional fields if they have non-empty values
  if (item.link && item.link.trim()) cleaned.link = item.link
  if (item.categoryId && item.categoryId.trim()) cleaned.categoryId = item.categoryId
  if (item.pageId && item.pageId.trim()) cleaned.pageId = item.pageId
  if (item.articleId && item.articleId.trim()) cleaned.articleId = item.articleId
  if (item.icon && item.icon.trim()) cleaned.icon = item.icon
  if (item.menuId) cleaned.menuId = item.menuId
  if (item.parentId !== undefined && item.parentId !== null) cleaned.parentId = item.parentId

  // Recursively clean children
  if (item.children && item.children.length > 0) {
    cleaned.children = item.children.map(cleanMenuItem)
  } else {
    cleaned.children = []
  }

  return cleaned
}

/**
 * Clean menu items array
 */
export const cleanMenuItems = (items: any[]): any[] => {
  return items.map(cleanMenuItem)
}

/**
 * CMS API Service
 * Centralized API calls for Menu Manager and Page Builder
 */

import type {
  CMSItemResponse,
  CMSListResponse,
  CreateMenuPayload,
  CreatePagePayload,
  Menu,
  PageLayout,
  UpdateMenuPayload,
  UpdatePagePayload
} from '@/types/cms'
import requests from '../network/http'

// ==================== MENU MANAGER API ====================

export const menuService = {
  /**
   * Fetch all menus with pagination
   */
  getMenus: (params?: { page?: number; limit?: number; location?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.location) query.append('location', params.location)

    return requests.get<CMSListResponse<Menu>>(`/admin/menu?${query.toString()}`)
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
  getMenuBySlug: (slug: string) => {
    return requests.get<CMSItemResponse<Menu>>(`/admin/menu/slug/${slug}`)
  },

  /**
   * Create new menu
   */
  createMenu: (payload: CreateMenuPayload) => {
    return requests.post<CMSItemResponse<Menu>>('/admin/menu', payload)
  },

  /**
   * Update menu
   */
  updateMenu: (id: string, payload: UpdateMenuPayload) => {
    return requests.patch<CMSItemResponse<Menu>>(`/admin/menu/${id}`, payload)
  },

  /**
   * Delete menu
   */
  deleteMenu: (id: string) => {
    return requests.delete(`/admin/menu/${id}`)
  },

  /**
   * Update menu items (nested structure)
   */
  updateMenuItems: (id: string, items: Menu['items']) => {
    return requests.patch<CMSItemResponse<Menu>>(`/admin/menu/${id}/items`, { items })
  },

  /**
   * Reorder menu items
   */
  reorderMenuItems: (id: string, itemOrders: { itemId: string; order: number }[]) => {
    return requests.patch(`/admin/menu/${id}/reorder`, { itemOrders })
  },

  /**
   * Publish/unpublish menu
   */
  updateMenuStatus: (id: string, status: 'published' | 'draft') => {
    return requests.patch<CMSItemResponse<Menu>>(`/admin/menu/${id}/status`, { status })
  }
}

// ==================== PAGE BUILDER API ====================

export const pageBuilderService = {
  /**
   * Fetch all pages with pagination
   */
  getPages: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.status) query.append('status', params.status)
    if (params?.search) query.append('search', params.search)

    return requests.get<CMSListResponse<PageLayout>>(`/admin/page-builder?${query.toString()}`)
  },

  /**
   * Fetch single page by ID
   */
  getPageById: (id: string) => {
    return requests.get<CMSItemResponse<PageLayout>>(`/admin/page-builder/${id}`)
  },

  /**
   * Fetch page by slug (for frontend rendering)
   */
  getPageBySlug: (slug: string) => {
    return requests.get<CMSItemResponse<PageLayout>>(`/admin/page-builder/slug/${slug}`)
  },

  /**
   * Create new page
   */
  createPage: (payload: CreatePagePayload) => {
    return requests.post<CMSItemResponse<PageLayout>>('/admin/page-builder', payload)
  },

  /**
   * Update page
   */
  updatePage: (id: string, payload: UpdatePagePayload) => {
    return requests.patch<CMSItemResponse<PageLayout>>(`/admin/page-builder/${id}`, payload)
  },

  /**
   * Delete page
   */
  deletePage: (id: string) => {
    return requests.delete(`/admin/page-builder/${id}`)
  },

  /**
   * Update page layout (sections, rows, columns, components)
   */
  updatePageLayout: (id: string, layout: PageLayout['layout']) => {
    return requests.patch<CMSItemResponse<PageLayout>>(`/admin/page-builder/${id}/layout`, {
      layout
    })
  },

  /**
   * Duplicate page
   */
  duplicatePage: (id: string, newTitle?: string) => {
    return requests.post<CMSItemResponse<PageLayout>>(`/admin/page-builder/${id}/duplicate`, {
      title: newTitle
    })
  },

  /**
   * Publish/unpublish page
   */
  updatePageStatus: (id: string, status: 'published' | 'draft') => {
    return requests.patch<CMSItemResponse<PageLayout>>(`/admin/page-builder/${id}/status`, {
      status
    })
  },

  /**
   * Get page preview URL
   */
  getPreviewUrl: (id: string) => {
    return `/preview/page/${id}`
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate unique ID for builder elements
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Flatten menu items for easier manipulation
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
 * Build menu tree from flat list
 */
export const buildMenuTree = (items: Menu['items'][0][]): Menu['items'] => {
  const map = new Map<string, Menu['items'][0]>()
  const roots: Menu['items'] = []

  // Create map of all items
  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  // Build tree
  items.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId === null) {
      roots.push(node)
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children.push(node)
      }
    }
  })

  return roots
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

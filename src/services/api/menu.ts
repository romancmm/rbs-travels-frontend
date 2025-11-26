/**
 * Menu API Service
 * Handles fetching menu data from the API
 */

import requests from '@/services/network/http'
import type { Menu, MenuItem } from '@/types/menu.types'

/**
 * Get menu by position (header, footer, etc.)
 */
export async function getMenuByPosition(position: string): Promise<Menu | null> {
  try {
    const response = await requests.get<Menu>(`/menu/position/${position}`)
    return response
  } catch (error) {
    console.error(`Failed to fetch menu for position: ${position}`, error)
    return null
  }
}

/**
 * Get menu by slug
 */
export async function getMenuBySlug(slug: string): Promise<Menu | null> {
  try {
    const response = await requests.get<Menu>(`/menu/slug/${slug}`)
    return response
  } catch (error) {
    console.error(`Failed to fetch menu with slug: ${slug}`, error)
    return null
  }
}

/**
 * Get menu by ID
 */
export async function getMenuById(id: string): Promise<Menu | null> {
  try {
    const response = await requests.get<Menu>(`/menu/${id}`)
    return response
  } catch (error) {
    console.error(`Failed to fetch menu with ID: ${id}`, error)
    return null
  }
}

/**
 * Get all menus (for admin)
 */
export async function getAllMenus(): Promise<Menu[]> {
  try {
    const response = await requests.get<Menu[]>('/admin/menus')
    return response
  } catch (error) {
    console.error('Failed to fetch all menus', error)
    return []
  }
}

/**
 * Create a menu (admin)
 */
export async function createMenu(data: {
  name: string
  slug: string
  position?: string
  items: MenuItem[]
}): Promise<Menu | null> {
  try {
    const response = await requests.post<Menu>('/admin/menus', data)
    return response
  } catch (error) {
    console.error('Failed to create menu', error)
    return null
  }
}

/**
 * Update a menu (admin)
 */
export async function updateMenu(
  id: string,
  data: Partial<{
    name: string
    slug: string
    position?: string
    items: MenuItem[]
  }>
): Promise<Menu | null> {
  try {
    const response = await requests.put<Menu>(`/admin/menus/${id}`, data)
    return response
  } catch (error) {
    console.error(`Failed to update menu with ID: ${id}`, error)
    return null
  }
}

/**
 * Delete a menu (admin)
 */
export async function deleteMenu(id: string): Promise<boolean> {
  try {
    await requests.delete(`/admin/menus/${id}`)
    return true
  } catch (error) {
    console.error(`Failed to delete menu with ID: ${id}`, error)
    return false
  }
}

/**
 * Server-side Menu Fetcher
 * For use in Server Components and Server Actions
 */

import type { Menu } from '@/types/menu.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_ROOT_API || 'http://localhost:8000/api'

/**
 * Get menu by position (header, footer, etc.)
 * Use this in Server Components
 */
export async function getMenuByPosition(position: string): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/position/${position}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Failed to fetch menu for position: ${position}`, response.statusText)
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch menu for position: ${position}`, error)
    return null
  }
}

/**
 * Get menu by slug
 * Use this in Server Components
 */
export async function getMenuBySlug(slug: string): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/slug/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Failed to fetch menu with slug: ${slug}`, response.statusText)
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch menu with slug: ${slug}`, error)
    return null
  }
}

/**
 * Get menu by ID
 * Use this in Server Components
 */
export async function getMenuById(id: string): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Failed to fetch menu with ID: ${id}`, response.statusText)
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch menu with ID: ${id}`, error)
    return null
  }
}

'use client'

import useAsync from '@/hooks/useAsync.hook'
import { MenuItem } from '@/types/menu.types'

interface UseMenuItemResult {
  menuItem: MenuItem | undefined
  loading: boolean
}

/**
 * Resolves a top-level menu item by its slug.
 * Backs the `[...menuSlug]` catch-all route, which dispatches to the
 * appropriate content view based on `menuItem.type`.
 */
export function useMenuItem(slug: string): UseMenuItemResult {
  const { data, loading } = useAsync<{ data: MenuItem }>({
    path: `/menus/item/${slug}`,
    immediate: true
  })

  return { menuItem: data?.data, loading }
}

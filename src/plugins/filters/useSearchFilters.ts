'use client'

import { useQueryStates } from 'nuqs'
import { z } from 'zod'
import { zodShapeToParsers } from './zodSearchParams'

export type UseSearchFilterReturn = ReturnType<typeof useSearchFilters>

const PAGINATION_KEYS = ['page', 'limit', 'sortBy', 'sortOrder']

export const useSearchFilters = (schema: z.ZodObject<any>) => {
  const [filters, setFilters] = useQueryStates(zodShapeToParsers(schema.shape))

  const sanitize = (obj: Record<string, any>) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([, value]) =>
          value !== null &&
          value !== undefined &&
          value !== '' &&
          (!Array.isArray(value) || value.length > 0)
      )
    )

  const smartSetFilters = (updated: Partial<typeof filters>) => {
    const updatedKeys = Object.keys(updated)
    const onlyPagination = updatedKeys.every((key) => PAGINATION_KEYS.includes(key))

    // Convert empty strings and undefined to null to remove from URL
    const cleanedUpdated = Object.fromEntries(
      Object.entries(updated).map(([key, value]) => [
        key,
        value === '' || value === undefined ? null : value
      ])
    )

    // If we're changing other filters, reset page to 1
    if (!onlyPagination) {
      setFilters({
        ...cleanedUpdated,
        page: '1'
      })
      return
    }

    // If we're only changing pagination/sorting, just update normally
    setFilters(cleanedUpdated)
  }

  const resetFilters = () => {
    const resetObj = Object.fromEntries(Object.keys(schema.shape).map((key) => [key, null]))
    setFilters(resetObj)
  }

  // API-ready query string: same filters as the URL, except `page` is
  // converted from the 1-indexed value shown in the UI to the API's
  // 0-indexed value. Always subtracts 1, never sends a negative page.
  const queryString = (() => {
    const sanitized = sanitize(filters)
    const params = new URLSearchParams()

    Object.entries(sanitized).forEach(([key, value]) => {
      if (key === 'page') {
        params.append(key, String(Math.max(Number(value) - 1, 0)))
        return
      }

      if (Array.isArray(value)) {
        // Join array values with comma
        params.append(key, value.join(','))
      } else {
        params.append(key, String(value))
      }
    })

    return params.toString()
  })()

  return {
    filters,
    setFilters: smartSetFilters,
    resetFilters,
    queryString
  }
}

'use client'

import { useQueryStates } from 'nuqs'
import { z } from 'zod'

export type UsePageFiltersReturn = ReturnType<typeof usePageFilters>

export const usePageFilters = (schema: z.ZodObject<any>) => {
  const [filters, setFilters] = useQueryStates(schema.shape)

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
    const onlyPagination = updatedKeys.every((key) => ['page', 'limit', 'sort'].includes(key))

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

    // If we're only changing page/limit/sort, just update normally
    setFilters(cleanedUpdated)
  }

  const resetFilters = () => {
    const resetObj = Object.fromEntries(Object.keys(schema.shape).map((key) => [key, null]))
    setFilters(resetObj)
  }

  const queryString = new URLSearchParams(sanitize(filters)).toString()

  return {
    filters,
    setFilters: smartSetFilters,
    resetFilters,
    queryString
  }
}

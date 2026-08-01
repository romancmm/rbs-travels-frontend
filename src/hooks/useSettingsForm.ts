'use client'

import type { FieldValues } from 'react-hook-form'
import { toast } from 'sonner'
import type { ZodType } from 'zod'

import { revalidateTags } from '@/action/data'
import { showError } from '@/lib/errMsg'
import requests from '@/services/network/http'
import { useEntityForm } from './useEntityForm'

type UseSettingsFormOptions<TFieldValues extends FieldValues> = {
  schema: ZodType<TFieldValues, any, any>
  settingsKey: string
  values: TFieldValues
  isEditing: boolean
  cacheTag: string
  refetch?: () => void
  successMessage?: string
}

/**
 * Every admin "settings" form (homepage sections, site config, theme, ...) reads
 * and writes the same `/admin/setting/settings` endpoint keyed by `settingsKey`,
 * then revalidates the tag the public site reads that key through. This hook
 * centralizes that submit flow on top of useEntityForm's sync fix, so each form
 * only has to describe its own fields.
 */
export function useSettingsForm<TFieldValues extends FieldValues>({
  schema,
  settingsKey,
  values,
  isEditing,
  cacheTag,
  refetch,
  successMessage = 'Settings updated successfully!'
}: UseSettingsFormOptions<TFieldValues>) {
  const form = useEntityForm({ schema, values })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await requests[isEditing ? 'put' : 'post'](
        `/admin/setting/settings${isEditing ? `/key/${settingsKey}` : ''}`,
        { key: settingsKey, value: data }
      )
      if (res?.success) {
        await revalidateTags(cacheTag)
        toast.success(successMessage)
        refetch?.()
      }
    } catch (error) {
      showError(error)
    }
  })

  return { ...form, onSubmit, isEditing }
}

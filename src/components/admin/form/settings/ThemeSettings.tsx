'use client'

import { useMemo } from 'react'

import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DEFAULT_THEME_COLOR_MAP,
  themeSettingsFields,
  type ThemeColorKey
} from '@/config/forms/themeSettings'
import { ensureHex } from '@/components/common/ColorPickerField'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import { SiteSettings, siteSettingsSchema } from '@/lib/validations/schemas/siteSettings'
import { SITE_CONFIG } from '@/types/cache-keys'

type TProps = {
  settingsKey: string
  initialValues?: SiteSettings | undefined
  refetch?: () => void
}

const ThemeSettings = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(() => {
    const themeColorDefaults = {} as Record<ThemeColorKey, string>
    Object.keys(DEFAULT_THEME_COLOR_MAP).forEach((key) => {
      const colorKey = key as ThemeColorKey
      themeColorDefaults[colorKey] = ensureHex(
        initialValues?.theme?.color?.[colorKey] as string | null | undefined,
        DEFAULT_THEME_COLOR_MAP[colorKey]
      )
    })

    return {
      ...initialValues,
      logo: {
        default: initialValues?.logo?.default || '',
        dark: initialValues?.logo?.dark || ''
      },
      theme: {
        ...initialValues?.theme,
        color: themeColorDefaults
      }
    }
  }, [initialValues])

  const form = useSettingsForm<SiteSettings>({
    schema: siteSettingsSchema,
    settingsKey,
    values,
    isEditing: !!initialValues,
    cacheTag: SITE_CONFIG,
    refetch
  })

  return (
    <form onSubmit={form.onSubmit} className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='capitalize'>Theme Colors</CardTitle>
          <CardDescription>
            Adjust your brand palette and interface surfaces to keep the admin experience on
            brand. Updates apply instantly after saving.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicForm form={form} fields={themeSettingsFields} />
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <FormSubmitButton
          className='w-full sm:w-auto'
          isSubmitting={form.formState.isSubmitting}
          isEditing={form.isEditing}
          savingLabel='Saving theme...'
          createLabel='Create Theme'
          updateLabel='Save Theme Updates'
        />
      </div>
    </form>
  )
}

export default ThemeSettings

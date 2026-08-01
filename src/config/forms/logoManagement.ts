import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { SiteSettings } from '@/lib/validations/schemas/siteSettings'

export const logoManagementFields: FieldConfig<SiteSettings>[] = [
  { type: 'image', name: 'logo.default', label: 'Logo (Light)', size: 'large' },
  { type: 'image', name: 'logo.dark', label: 'Logo (Dark)', size: 'large' },
  { type: 'image', name: 'favicon', label: 'Favicon', size: 'large' }
]

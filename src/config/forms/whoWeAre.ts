import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'

// The Features list has icon-type-dependent field rendering and a confirm-before-reset
// dialog, which don't fit static field config - it stays hand-written in WhoWeAre.tsx.
export const whoWeAreFields: FieldConfig<HomepageSettings>[] = [
  {
    type: 'text',
    name: 'whoWeAre.title',
    label: 'Title',
    placeholder: 'Enter who we are title'
  },
  {
    type: 'text',
    name: 'whoWeAre.subTitle',
    label: 'Sub Title',
    placeholder: 'Enter who we are subtitle'
  },
  {
    type: 'textarea',
    name: 'whoWeAre.desc',
    label: 'Description',
    rows: 3,
    placeholder: 'Enter who we are description',
    colSpan: 'full'
  }
]

import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'

// Facilities and Stats have icon-type-dependent field rendering and a confirm-before-reset
// dialog, which don't fit static field config - they stay hand-written in AboutSection.tsx.
export const aboutSectionFields: FieldConfig<HomepageSettings>[] = [
  { type: 'text', name: 'about.title', label: 'Title', placeholder: 'Enter about title' },
  {
    type: 'text',
    name: 'about.subTitle',
    label: 'Sub Title',
    placeholder: 'Enter about subtitle'
  },
  {
    type: 'textarea',
    name: 'about.desc',
    label: 'Description',
    rows: 3,
    placeholder: 'Enter about description',
    colSpan: 'full'
  },
  {
    type: 'group',
    colSpan: 'full',
    fields: [
      {
        type: 'text',
        name: 'about.experience.years',
        label: 'Experience Years',
        placeholder: 'e.g., 25+'
      },
      {
        type: 'text',
        name: 'about.experience.text',
        label: 'Experience Text',
        placeholder: 'e.g., Years of Excellence'
      }
    ]
  },
  { type: 'image', name: 'about.image', label: 'Image', colSpan: 'full' }
]

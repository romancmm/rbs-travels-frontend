import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'

export const homeServicesFields: FieldConfig<HomepageSettings>[] = [
  { type: 'text', name: 'services.title', label: 'Title', placeholder: 'Enter services title' },
  {
    type: 'text',
    name: 'services.subtitle',
    label: 'Subtitle',
    placeholder: 'Enter services subtitle'
  },
  {
    type: 'array',
    name: 'services.services',
    label: 'Services',
    emptyLabel: 'No services added yet. Click "Add Service" to get started.',
    addLabel: 'Add Service',
    maxItems: 10,
    defaultItem: { name: '', image: '', description: '', url: '' },
    itemLabel: (index) => `Service ${index + 1}`,
    itemFields: [
      {
        type: 'text',
        name: 'name',
        label: 'Service Name',
        placeholder: 'e.g., Work Permit Processing'
      },
      {
        type: 'text',
        name: 'url',
        label: 'URL',
        placeholder: 'e.g., https://example.com/services/work-permit'
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Description',
        rows: 3,
        placeholder: 'Enter service description',
        colSpan: 'full'
      },
      { type: 'image', name: 'image', label: 'Image', colSpan: 2 }
    ]
  }
]

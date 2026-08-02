import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { SisterConcernSettings } from '@/lib/validations/schemas/sisterConcernSettings'

export const sisterConcernFields: FieldConfig<SisterConcernSettings>[] = [
  { type: 'text', name: 'title', label: 'Title', placeholder: 'e.g., Our Sister Concerns' },
  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
    placeholder: 'e.g., Companies Under Our Group'
  },
  {
    type: 'textarea',
    name: 'description',
    label: 'Description',
    placeholder: 'e.g., Companies Under Our Group',
    colSpan: 2
  },
  {
    type: 'array',
    name: 'companies',
    label: 'Sister Concern',
    emptyLabel:
      'No sister concern companies added yet. Click the button below to add your first company.',
    addLabel: 'Add Company',
    maxItems: 10,
    defaultItem: { name: '', logo: '', url: '', description: '', isActive: true },
    itemLabel: (index) => `Company #${index + 1}`,
    itemFields: [
      { type: 'image', name: 'logo', label: 'Logo', colSpan: 'full' },
      { type: 'text', name: 'name', label: 'Company Name', placeholder: 'e.g., ABC Corporation' },
      {
        type: 'text',
        name: 'url',
        label: 'Website URL (Optional)',
        placeholder: 'https://example.com'
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Description (Optional)',
        rows: 3,
        placeholder: 'Brief description of the company...',
        colSpan: 'full'
      },
      { type: 'switch', name: 'isActive', label: 'Active - display this company on the website' }
    ]
  }
]

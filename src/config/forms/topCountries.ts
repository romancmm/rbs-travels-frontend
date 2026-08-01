import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'

export const topCountriesFields: FieldConfig<HomepageSettings>[] = [
  {
    type: 'text',
    name: 'topCountries.title',
    label: 'Title',
    placeholder: 'Enter top countries title'
  },
  {
    type: 'text',
    name: 'topCountries.subtitle',
    label: 'Subtitle',
    placeholder: 'Enter top countries subtitle'
  },
  {
    type: 'array',
    name: 'topCountries.destinations',
    label: 'Destinations',
    emptyLabel: 'No destinations added yet. Click "Add Destination" to get started.',
    addLabel: 'Add Destination',
    maxItems: 10,
    defaultItem: {
      name: '',
      image: '',
      workers: '',
      description: '',
      topSectors: [],
      averageSalary: '',
      visaType: ''
    },
    itemLabel: (index) => `Destination ${index + 1}`,
    itemFields: [
      { type: 'text', name: 'name', label: 'Country Name', placeholder: 'e.g., Dubai' },
      {
        type: 'text',
        name: 'visaType',
        label: 'Visa Type',
        placeholder: 'e.g., Work Visa, Student Visa'
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Description',
        rows: 3,
        placeholder: 'Enter destination description',
        colSpan: 'full'
      },
      { type: 'image', name: 'image', label: 'Image', colSpan: 2 }
    ]
  }
]

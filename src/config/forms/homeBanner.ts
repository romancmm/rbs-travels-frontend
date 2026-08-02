import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'

export const DEFAULT_BANNER = {
  title: '',
  subTitle: '',
  desc: '',
  bgImage: '',
  isActive: true,
  buttons: []
}

export const homeBannerFields: FieldConfig<HomepageSettings>[] = [
  {
    type: 'array',
    name: 'banners',
    emptyLabel: 'No banner slides added yet. Click "Add Banner Slide" to get started.',
    addLabel: 'Add New Banner Slide',
    maxItems: 10,
    defaultItem: DEFAULT_BANNER,
    itemLabel: (index) => `Banner ${index + 1}`,
    itemFields: [
      { type: 'image', name: 'bgImage', label: 'Banner Image', colSpan: 'full' },
      { type: 'text', name: 'title', label: 'Title', placeholder: 'Enter banner title' },
      { type: 'text', name: 'subTitle', label: 'Subtitle', placeholder: 'Enter banner subtitle' },
      {
        type: 'textarea',
        name: 'desc',
        label: 'Description',
        rows: 3,
        placeholder: 'Enter banner description',
        colSpan: 'full'
      },
      { type: 'switch', name: 'isActive', label: 'Active' },
      {
        type: 'array',
        name: 'buttons',
        label: 'Call-to-Action Buttons',
        description: 'Add up to 2 buttons for banner actions',
        addLabel: 'Add Button',
        maxItems: 2,
        defaultItem: { title: '', url: '' },
        itemLabel: (index) => `Button ${index + 1}`,
        emptyLabel: 'No buttons added yet. Click "Add Button" to create a call-to-action.',
        itemFields: [
          {
            type: 'text',
            name: 'title',
            label: 'Button Text',
            placeholder: 'e.g., Get Started, Learn More'
          },
          {
            type: 'text',
            name: 'url',
            label: 'Button URL',
            placeholder: '/contact or https://example.com'
          }
        ]
      }
    ]
  }
]

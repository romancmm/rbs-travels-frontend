import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { SiteSettings } from '@/lib/validations/schemas/siteSettings'

export const siteConfigurationBasicFields: FieldConfig<SiteSettings>[] = [
  { type: 'text', name: 'name', label: 'Site Name', placeholder: 'Enter site name', showCharCount: true },
  { type: 'email', name: 'email', label: 'Email', placeholder: 'contact@example.com' },
  { type: 'tel', name: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567', maxLength: 20 },
  { type: 'tel', name: 'hotline', label: 'Hotline', placeholder: '+1 (555) 000-0000', maxLength: 20 },
  { type: 'url', name: 'website', label: 'Website', placeholder: 'https://example.com' },
  {
    type: 'text',
    name: 'workingHours',
    label: 'Working Hours',
    placeholder: 'e.g., Mon-Fri: 9:00 AM - 6:00 PM',
    showCharCount: true
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    rows: 2,
    placeholder: 'Enter full address',
    maxLength: 250,
    showCharCount: true,
    colSpan: 'full'
  },
  {
    type: 'textarea',
    name: 'shortDescription',
    label: 'Short Description',
    rows: 3,
    placeholder: 'Brief description of the site',
    maxLength: 500,
    showCharCount: true,
    colSpan: 'full'
  }
]

// Relative to each item in `addresses` - reused as the array field's itemFields below.
const addressItemFields: FieldConfig<any>[] = [
  {
    type: 'text',
    name: 'title',
    label: 'Title',
    placeholder: 'e.g., Head Office, Branch Office',
    maxLength: 35,
    showCharCount: true,
    colSpan: 'full'
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    rows: 2,
    placeholder: 'Enter full address',
    maxLength: 250,
    showCharCount: true,
    colSpan: 'full'
  },
  { type: 'tel', name: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567', maxLength: 20 },
  { type: 'email', name: 'email', label: 'Email', placeholder: 'contact@example.com' }
]

export const siteConfigurationAddressesFields: FieldConfig<SiteSettings>[] = [
  {
    type: 'array',
    name: 'addresses',
    maxItems: 2,
    defaultItem: { title: '', address: '', phone: '', email: '' },
    itemLabel: (index) => `Address ${index + 1}`,
    emptyLabel: 'No addresses added yet. Click "Add Address" to create one.',
    addLabel: 'Add Address',
    itemFields: addressItemFields
  }
]

export const siteConfigurationFooterFields: FieldConfig<SiteSettings>[] = [
  {
    type: 'textarea',
    name: 'footer.copyright',
    label: 'Copyright Text',
    placeholder: 'Enter copyright text',
    maxLength: 200,
    showCharCount: true,
    colSpan: 'full'
  },
  {
    type: 'text',
    name: 'footer.credit.companyName',
    label: 'Developed by',
    placeholder: 'Enter company name',
    showCharCount: true
  },
  { type: 'url', name: 'footer.credit.url', label: 'Developed by URL', placeholder: 'https://example.com' },
  { type: 'switch', name: 'footer.credit.showCredit', label: 'Show Credit' }
]

export const siteConfigurationSeoFields: FieldConfig<SiteSettings>[] = [
  { type: 'text', name: 'seo.metaName', label: 'Meta Name', placeholder: 'Enter meta name', showCharCount: true },
  {
    type: 'text',
    name: 'seo.metaTitle',
    label: 'Meta Title',
    placeholder: 'Enter meta title',
    showCharCount: true
  },
  {
    type: 'textarea',
    name: 'seo.metaDescription',
    label: 'Meta Description',
    rows: 4,
    placeholder: 'Meta description...',
    maxLength: 160,
    showCharCount: true,
    description: 'Max 160 characters recommended for SEO',
    colSpan: 'full'
  },
  {
    type: 'text',
    name: 'seo.siteAuthor',
    label: 'Site Author',
    placeholder: 'Enter author name',
    showCharCount: true
  },
  { type: 'url', name: 'seo.canonicalUrl', label: 'Canonical URL', placeholder: 'https://example.com' },
  {
    type: 'url',
    name: 'seo.ogImage',
    label: 'OG Image URL',
    placeholder: 'https://example.com/og-image.jpg',
    description: 'Image for social media sharing (Open Graph)',
    colSpan: 'full'
  }
]

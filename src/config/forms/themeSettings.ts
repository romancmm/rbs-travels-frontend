import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { SiteSettings } from '@/lib/validations/schemas/siteSettings'

export type ThemeColorKey = keyof NonNullable<NonNullable<SiteSettings['theme']>['color']>

export const DEFAULT_THEME_COLOR_MAP: Record<ThemeColorKey, string> = {
  primary: '#1677FF',
  secondary: '#13C2C2',
  accent: '#FAAD14',
  text: '#1F1F1F',
  'header-background': '#F5F5F5',
  'header-color': '#1F1F1F',
  'footer-background': '#001529',
  'footer-color': '#FFFFFF'
}

export const THEME_COLOR_SECTIONS: ReadonlyArray<{
  id: 'brand' | 'interface'
  title: string
  description: string
  items: ReadonlyArray<{ key: ThemeColorKey; label: string; hint: string }>
}> = [
  {
    id: 'brand',
    title: 'Brand Palette',
    description: 'Primary accents used across CTAs, highlights, and typography.',
    items: [
      { key: 'primary', label: 'Primary', hint: 'Buttons, active states, key brand actions' },
      { key: 'secondary', label: 'Secondary', hint: 'Alternate accents and supporting UI' },
      { key: 'accent', label: 'Accent', hint: 'Highlights, badges, and subtle emphasis' },
      { key: 'text', label: 'Body Text', hint: 'Default body typography color' }
    ]
  },
  {
    id: 'interface',
    title: 'Interface Surfaces',
    description: 'Header and footer backgrounds, along with their contrasting text colors.',
    items: [
      { key: 'header-background', label: 'Header Background', hint: 'Navigation bar background color' },
      { key: 'header-color', label: 'Header Text', hint: 'Links and icons on the header' },
      { key: 'footer-background', label: 'Footer Background', hint: 'Footer surface color' },
      { key: 'footer-color', label: 'Footer Text', hint: 'Content and links in the footer' }
    ]
  }
]

export const themeSettingsFields: FieldConfig<SiteSettings>[] = THEME_COLOR_SECTIONS.map((section) => ({
  type: 'group',
  title: section.title,
  description: section.description,
  columns: 4,
  colSpan: 'full',
  fields: section.items.map((item) => ({
    type: 'color',
    name: `theme.color.${item.key}` as const,
    label: item.label,
    description: item.hint,
    fallbackValue: DEFAULT_THEME_COLOR_MAP[item.key]
  }))
}))

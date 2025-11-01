/**
 * CMS Type Definitions
 * Core types for Menu Manager and Page Builder systems
 */

// ==================== MENU SYSTEM ====================

export type MenuItemType = 'custom-link' | 'category-blogs' | 'custom-page' | 'article'

export type MenuLocation = 'header' | 'footer' | 'sidebar' | 'custom'

export interface MenuItem {
  id: string
  title: string
  type: MenuItemType
  link?: string // For custom-link
  categoryId?: string // For category-blogs
  pageId?: string // For custom-page
  articleId?: string // For article
  parentId: string | null
  order: number
  children: MenuItem[]
  status: 'published' | 'draft'
  icon?: string
  target?: '_blank' | '_self'
  meta?: Record<string, any>
}

export interface Menu {
  id: string
  name: string
  slug: string
  location: MenuLocation
  items: MenuItem[]
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface CreateMenuPayload {
  name: string
  slug: string
  location: MenuLocation
  status?: 'published' | 'draft'
}

export interface UpdateMenuPayload extends Partial<CreateMenuPayload> {
  items?: MenuItem[]
}

// ==================== PAGE BUILDER SYSTEM ====================

export type ComponentType =
  | 'text'
  | 'heading'
  | 'rich-text'
  | 'image'
  | 'video'
  | 'button'
  | 'link'
  | 'spacer'
  | 'divider'
  | 'icon-box'
  | 'counter'
  | 'gallery'
  | 'carousel'
  | 'banner'
  | 'product-list'
  | 'product-card'
  | 'service-list'
  | 'testimonial-list'
  | 'blog-list'
  | 'featured-posts'
  | 'custom-html'

export interface ComponentConfig {
  variant?: string
  size?: string
  columns?: number
  showPrice?: boolean
  showButton?: boolean
  alignment?: 'left' | 'center' | 'right'
  [key: string]: any
}

export interface Component {
  id: string
  type: ComponentType
  props: Record<string, any>
  config?: ComponentConfig
  // For API-driven components
  api?: string
  dataMap?: string
  // Styling
  className?: string
  style?: Record<string, any>
}

export interface Column {
  id: string
  width: number // 1-12 (Bootstrap grid style)
  elements: Component[]
  settings?: {
    className?: string
    padding?: string
    margin?: string
    background?: string
  }
}

export interface Row {
  id: string
  columns: Column[]
  settings?: {
    columnsGap?: string
    background?: string
    className?: string
    padding?: string
    margin?: string
  }
}

export interface Section {
  id: string
  name: string
  rows: Row[]
  settings?: {
    backgroundColor?: string
    backgroundImage?: string
    padding?: string
    margin?: string
    className?: string
    customId?: string
  }
}

export interface PageLayout {
  id: string
  title: string
  slug: string
  layout: Section[]
  status: 'draft' | 'published'
  meta?: {
    description?: string
    keywords?: string
    ogImage?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface CreatePagePayload {
  title: string
  slug: string
  status?: 'draft' | 'published'
  meta?: PageLayout['meta']
}

export interface UpdatePagePayload extends Partial<CreatePagePayload> {
  layout?: Section[]
}

// ==================== API RESPONSE TYPES ====================

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CMSListResponse<T> {
  data: {
    items: T[]
    pagination: PaginationMeta
  }
}

export interface CMSItemResponse<T> {
  data: T
}

// ==================== BUILDER HELPERS ====================

export interface ColumnLayout {
  label: string
  value: number[]
  description?: string
}

export const COLUMN_LAYOUTS: ColumnLayout[] = [
  { label: '1 Column', value: [12], description: 'Full width' },
  { label: '2 Columns', value: [6, 6], description: '50% - 50%' },
  { label: '3 Columns', value: [4, 4, 4], description: '33% - 33% - 33%' },
  { label: '4 Columns', value: [3, 3, 3, 3], description: '25% each' },
  { label: '2/3 - 1/3', value: [8, 4], description: '66% - 33%' },
  { label: '1/3 - 2/3', value: [4, 8], description: '33% - 66%' },
  { label: '1/4 - 3/4', value: [3, 9], description: '25% - 75%' },
  { label: '3/4 - 1/4', value: [9, 3], description: '75% - 25%' }
]

export interface ComponentDefinition {
  type: ComponentType
  label: string
  icon: string
  category: 'basic' | 'media' | 'dynamic' | 'layout'
  description: string
  defaultProps: Record<string, any>
  requiresApi?: boolean
}

// Component registry for the builder
export const COMPONENT_REGISTRY: ComponentDefinition[] = [
  {
    type: 'text',
    label: 'Text',
    icon: 'Type',
    category: 'basic',
    description: 'Simple text block',
    defaultProps: { content: 'Enter text here', className: '' }
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: 'Heading',
    category: 'basic',
    description: 'Heading with levels (H1-H6)',
    defaultProps: { content: 'Heading', level: 2, className: '' }
  },
  {
    type: 'rich-text',
    label: 'Rich Text',
    icon: 'FileText',
    category: 'basic',
    description: 'HTML/Markdown content',
    defaultProps: { content: '<p>Rich text content</p>', className: '' }
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'Image',
    category: 'media',
    description: 'Single image block',
    defaultProps: { src: '', alt: '', className: '' }
  },
  {
    type: 'button',
    label: 'Button',
    icon: 'Square',
    category: 'basic',
    description: 'Call-to-action button',
    defaultProps: { text: 'Click Me', href: '#', variant: 'primary', className: '' }
  },
  {
    type: 'gallery',
    label: 'Gallery',
    icon: 'Grid',
    category: 'media',
    description: 'Image gallery grid',
    defaultProps: { images: [], columns: 3, className: '' }
  },
  {
    type: 'carousel',
    label: 'Carousel',
    icon: 'Repeat',
    category: 'media',
    description: 'Image/content slider',
    defaultProps: { slides: [], interval: 5000, className: '' }
  },
  {
    type: 'banner',
    label: 'Banner',
    icon: 'Monitor',
    category: 'media',
    description: 'Hero banner section',
    defaultProps: {
      title: 'Welcome',
      subtitle: 'Subtitle here',
      image: '',
      cta: { text: 'Learn More', href: '#' },
      className: ''
    }
  },
  {
    type: 'product-list',
    label: 'Product List',
    icon: 'Package',
    category: 'dynamic',
    description: 'Dynamic product grid from API',
    defaultProps: { config: { variant: 'grid', columns: 4, showPrice: true } },
    requiresApi: true
  },
  {
    type: 'service-list',
    label: 'Service List',
    icon: 'Briefcase',
    category: 'dynamic',
    description: 'Service items from API',
    defaultProps: { config: { variant: 'list' } },
    requiresApi: true
  },
  {
    type: 'testimonial-list',
    label: 'Testimonials',
    icon: 'MessageSquare',
    category: 'dynamic',
    description: 'Customer testimonials',
    defaultProps: { config: { variant: 'slider' } },
    requiresApi: true
  },
  {
    type: 'blog-list',
    label: 'Blog Posts',
    icon: 'FileText',
    category: 'dynamic',
    description: 'Blog post listing',
    defaultProps: { config: { limit: 6, showExcerpt: true } },
    requiresApi: true
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: 'Minus',
    category: 'layout',
    description: 'Horizontal divider line',
    defaultProps: { className: 'my-8' }
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: 'MoveVertical',
    category: 'layout',
    description: 'Vertical spacing',
    defaultProps: { height: '2rem' }
  }
]

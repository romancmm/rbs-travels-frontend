/**
 * CMS Type Definitions
 * Core types for Menu Manager and Page Builder systems
 * Based on JSON structure for optimal performance (single query, no joins)
 */

// ==================== MENU SYSTEM ====================

export type MenuItemType = 'custom-link' | 'category-blogs' | 'custom-page' | 'article' | 'gallery'

export type MenuPosition = 'header' | 'footer' | 'sidebar' | 'custom'

export interface MenuItem {
  id: string
  menuId?: string // Foreign key to Menu
  title: string
  type: MenuItemType
  link?: string // For custom-link
  categoryId?: string // For category-blogs (FK)
  pageId?: string // For custom-page (FK to PageBuilder)
  articleId?: string // For article (FK to Post)
  icon?: string
  target?: '_self' | '_blank'
  cssClass?: string // Custom CSS class for styling
  parentId?: string | null // For relational structure
  order: number
  isPublished?: boolean // Published status
  meta?: Record<string, any> // Additional metadata
  children: MenuItem[] // Nested children for tree structure (from cache or transformed)
  createdAt?: string
  updatedAt?: string
}

export interface Menu {
  id: string
  name: string
  slug: string
  position: MenuPosition
  items: MenuItem[] // Can come from itemsCache (public) or relations (admin)
  itemsCache?: MenuItem[] // JSON cache for public API
  isPublished: boolean
  version?: number // Version tracking
  cacheKey?: string // Cache invalidation key
  createdAt: string
  updatedAt: string
}

export interface CreateMenuPayload {
  name: string
  slug: string
  position?: MenuPosition
  isPublished?: boolean
}

export interface UpdateMenuPayload extends Partial<CreateMenuPayload> {
  items?: MenuItem[] // Allow updating menu items (for hybrid approach)
}

export interface CreateMenuItemPayload {
  title: string
  type: MenuItemType
  link?: string
  categoryId?: string
  pageId?: string
  articleId?: string
  icon?: string
  target?: '_self' | '_blank'
  cssClass?: string
  parentId?: string | null
  order: number
  isPublished?: boolean
  meta?: Record<string, any>
}

export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload>

// ==================== PAGE BUILDER SYSTEM ====================

export type ComponentType =
  | 'heading' // H1-H6 headings
  | 'text' // Paragraph text
  | 'rich-text' // HTML/Markdown content
  | 'image' // Single image
  | 'gallery' // Image gallery/slider
  | 'video' // Video embed
  | 'button' // CTA button
  | 'icon' // Icon/SVG
  | 'spacer' // Vertical spacing
  | 'divider' // Horizontal line
  | 'card' // Card component
  | 'list' // Bullet/numbered list
  | 'table' // Data table
  | 'form' // Form component
  | 'map' // Google Maps embed
  | 'code' // Code block
  | 'html' // Custom HTML
  | 'carousel' // Image carousel
  | 'accordion' // Collapsible sections
  | 'tabs' // Tab navigation
  | 'testimonial' // Review/testimonial
  | 'pricing-table' // Pricing plans
  | 'contact-form' // Contact form
  | 'newsletter' // Email subscription
  | 'social-icons' // Social media links
  | 'blog-grid' // Blog post grid
  | 'service-card' // Service showcase
  | 'project-card' // Project showcase

export interface Component {
  id: string
  type: ComponentType
  order: number
  props: Record<string, any> // Component-specific properties
}

export interface ColumnSettings {
  verticalAlign?: 'top' | 'middle' | 'bottom'
  padding?: string
  margin?: string
  background?: string
  className?: string
}

export interface Column {
  id: string
  width: number // 1-12 (Bootstrap grid style)
  order: number
  settings?: ColumnSettings
  components: Component[]
}

export interface RowSettings {
  columnsGap?: string
  alignment?: 'left' | 'center' | 'right'
  background?: string
  padding?: string
  margin?: string
  className?: string
}

export interface Row {
  id: string
  order: number
  settings?: RowSettings
  columns: Column[]
}

export interface SectionSettings {
  backgroundColor?: string
  backgroundImage?: string
  padding?: string
  margin?: string
  minHeight?: string
  className?: string
  customId?: string
}

export interface Section {
  id: string
  name: string
  order: number
  settings?: SectionSettings
  rows: Row[]
}

export interface PageContent {
  sections: Section[]
}

export interface PageSEO {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  twitterCard?: string
  canonical?: string
}

export interface PageLayout {
  id: string
  title: string
  slug: string
  description?: string
  content: PageContent // JSON field containing entire page structure
  seo?: PageSEO // SEO metadata
  isDraft?: boolean // Draft status
  isPublished: boolean // Published status
  publishedAt?: string
  publishedContent?: PageContent // Cached published version for performance
  version?: number // Version tracking
  viewCount?: number
  cacheKey?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePagePayload {
  title: string
  slug: string
  description?: string
  isDraft?: boolean
  isPublished?: boolean
  seo?: PageSEO
  content?: PageContent
}

export type UpdatePagePayload = Partial<CreatePagePayload>

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
    type: 'heading',
    label: 'Heading',
    icon: 'Heading',
    category: 'basic',
    description: 'H1-H6 headings',
    defaultProps: {
      level: 1,
      text: 'Page Title',
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#333'
    }
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'Type',
    category: 'basic',
    description: 'Paragraph text',
    defaultProps: { content: 'Enter text here', fontSize: '16px', color: '#666' }
  },
  {
    type: 'rich-text',
    label: 'Rich Text',
    icon: 'FileText',
    category: 'basic',
    description: 'HTML/Markdown content',
    defaultProps: { content: '<p>Rich text content</p>' }
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'Image',
    category: 'media',
    description: 'Single image',
    defaultProps: { src: '', alt: 'Image', width: '100%', height: 'auto', objectFit: 'cover' }
  },
  {
    type: 'gallery',
    label: 'Gallery',
    icon: 'Grid',
    category: 'media',
    description: 'Image gallery/slider',
    defaultProps: { images: [], layout: 'grid', columns: 3, gap: '15px', lightbox: true }
  },
  {
    type: 'video',
    label: 'Video',
    icon: 'Video',
    category: 'media',
    description: 'Video embed',
    defaultProps: { src: '', autoplay: false, controls: true }
  },
  {
    type: 'button',
    label: 'Button',
    icon: 'Square',
    category: 'basic',
    description: 'CTA button',
    defaultProps: {
      text: 'Click Me',
      link: '#',
      style: 'primary',
      size: 'medium',
      fullWidth: false
    }
  },
  {
    type: 'icon',
    label: 'Icon',
    icon: 'Star',
    category: 'basic',
    description: 'Icon/SVG',
    defaultProps: { name: 'star', size: '48px', color: '#007bff' }
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: 'MoveVertical',
    category: 'layout',
    description: 'Vertical spacing',
    defaultProps: { height: '2rem' }
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: 'Minus',
    category: 'layout',
    description: 'Horizontal line',
    defaultProps: { style: 'solid', thickness: '1px', color: '#e0e0e0', margin: '20px 0' }
  },
  {
    type: 'card',
    label: 'Card',
    icon: 'Layout',
    category: 'basic',
    description: 'Card component',
    defaultProps: {
      image: '',
      title: 'Card Title',
      description: 'Card description',
      link: '',
      buttonText: 'Read More',
      style: 'elevated'
    }
  },
  {
    type: 'carousel',
    label: 'Carousel',
    icon: 'Repeat',
    category: 'media',
    description: 'Image carousel',
    defaultProps: { slides: [], autoplay: true, interval: 5000 }
  },
  {
    type: 'accordion',
    label: 'Accordion',
    icon: 'ChevronDown',
    category: 'basic',
    description: 'Collapsible sections',
    defaultProps: { items: [], allowMultiple: false }
  },
  {
    type: 'tabs',
    label: 'Tabs',
    icon: 'Layers',
    category: 'basic',
    description: 'Tab navigation',
    defaultProps: { tabs: [], defaultTab: 0 }
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: 'MessageSquare',
    category: 'basic',
    description: 'Review/testimonial',
    defaultProps: { name: '', role: '', content: '', avatar: '', rating: 5 }
  },
  {
    type: 'pricing-table',
    label: 'Pricing Table',
    icon: 'DollarSign',
    category: 'basic',
    description: 'Pricing plans',
    defaultProps: { plans: [], currency: '$', highlighted: 1 }
  },
  {
    type: 'contact-form',
    label: 'Contact Form',
    icon: 'Mail',
    category: 'basic',
    description: 'Contact form',
    defaultProps: { fields: ['name', 'email', 'message'], submitText: 'Send Message' }
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    icon: 'Send',
    category: 'basic',
    description: 'Email subscription',
    defaultProps: {
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
      title: 'Subscribe to Newsletter'
    }
  },
  {
    type: 'social-icons',
    label: 'Social Icons',
    icon: 'Share2',
    category: 'basic',
    description: 'Social media links',
    defaultProps: { platforms: [], size: 'medium', style: 'circle' }
  },
  {
    type: 'blog-grid',
    label: 'Blog Grid',
    icon: 'FileText',
    category: 'dynamic',
    description: 'Blog post grid',
    defaultProps: { limit: 6, columns: 3, showExcerpt: true, showImage: true },
    requiresApi: true
  },
  {
    type: 'service-card',
    label: 'Service Card',
    icon: 'Briefcase',
    category: 'dynamic',
    description: 'Service showcase',
    defaultProps: { variant: 'grid' },
    requiresApi: true
  },
  {
    type: 'project-card',
    label: 'Project Card',
    icon: 'FolderOpen',
    category: 'dynamic',
    description: 'Project showcase',
    defaultProps: { variant: 'grid', columns: 3 },
    requiresApi: true
  },
  {
    type: 'list',
    label: 'List',
    icon: 'List',
    category: 'basic',
    description: 'Bullet/numbered list',
    defaultProps: { items: [], style: 'bullet', icon: 'check' }
  },
  {
    type: 'table',
    label: 'Table',
    icon: 'Table',
    category: 'basic',
    description: 'Data table',
    defaultProps: { headers: [], rows: [], striped: true }
  },
  {
    type: 'form',
    label: 'Form',
    icon: 'FormInput',
    category: 'basic',
    description: 'Form component',
    defaultProps: { fields: [], submitText: 'Submit' }
  },
  {
    type: 'map',
    label: 'Map',
    icon: 'MapPin',
    category: 'media',
    description: 'Google Maps embed',
    defaultProps: { latitude: 0, longitude: 0, zoom: 12, height: '400px' }
  },
  {
    type: 'code',
    label: 'Code',
    icon: 'Code',
    category: 'basic',
    description: 'Code block',
    defaultProps: { code: '', language: 'javascript', theme: 'dark' }
  },
  {
    type: 'html',
    label: 'HTML',
    icon: 'Code2',
    category: 'basic',
    description: 'Custom HTML',
    defaultProps: { html: '' }
  }
]

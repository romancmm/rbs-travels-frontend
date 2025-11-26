# Quick Reference: JSON-based Menu & PageBuilder

## Menu JSON Structure

### TypeScript Types

```typescript
type MenuItemType = 'custom-link' | 'category-blogs' | 'custom-page' | 'article'
type MenuPosition = 'header' | 'footer' | 'sidebar' | 'custom'

interface MenuItem {
  id: string
  title: string
  type: MenuItemType
  link?: string // For custom-link
  categoryId?: string // For category-blogs
  pageId?: string // For custom-page
  articleId?: string // For article
  icon?: string
  target?: '_self' | '_blank'
  order: number
  children: MenuItem[] // Nested children for tree structure
}

interface Menu {
  id: string
  name: string
  slug: string
  position: MenuPosition
  items: MenuItem[] // JSON array - entire tree stored as JSON
  isPublished: boolean
  createdAt: string
  updatedAt: string
}
```

### Creating a Menu

```typescript
const menu = await prisma.menu.create({
  data: {
    name: 'Main Navigation',
    slug: 'main-nav',
    position: 'header',
    isPublished: true,
    items: [
      {
        id: 'home',
        title: 'Home',
        type: 'custom-link',
        link: '/',
        icon: 'home',
        target: '_self',
        order: 0,
        children: []
      },
      {
        id: 'services',
        title: 'Services',
        type: 'custom-link',
        link: '/services',
        order: 1,
        children: [
          {
            id: 'web-dev',
            title: 'Web Development',
            type: 'custom-link',
            link: '/services/web-development',
            order: 0,
            children: []
          },
          {
            id: 'mobile-dev',
            title: 'Mobile Development',
            type: 'custom-link',
            link: '/services/mobile-development',
            order: 1,
            children: []
          }
        ]
      }
    ]
  }
})
```

### Fetching a Menu (Single Query!)

```typescript
// Old way (5+ queries with joins)
const menu = await prisma.menu.findUnique({
  where: { slug: 'main-nav' },
  include: {
    items: {
      include: {
        children: {
          include: {
            children: true // Nested!
          }
        }
      }
    }
  }
})

// New way (1 query, no joins!)
const menu = await prisma.menu.findUnique({
  where: { slug: 'main-nav' }
})
// menu.items already contains the entire tree!
```

## PageBuilder JSON Structure

### TypeScript Types

```typescript
type ComponentType =
  | 'heading'
  | 'text'
  | 'rich-text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'button'
  | 'icon'
  | 'spacer'
  | 'divider'
  | 'card'
  | 'list'
  | 'table'
  | 'form'
  | 'map'
  | 'code'
  | 'html'
  | 'carousel'
  | 'accordion'
  | 'tabs'
  | 'testimonial'
  | 'pricing-table'
  | 'contact-form'
  | 'newsletter'
  | 'social-icons'
  | 'blog-grid'
  | 'service-card'
  | 'project-card'

interface Component {
  id: string
  type: ComponentType
  order: number
  props: Record<string, any>
}

interface Column {
  id: string
  width: number // 1-12 (Bootstrap grid style)
  order: number
  settings?: {
    verticalAlign?: 'top' | 'middle' | 'bottom'
    padding?: string
    margin?: string
    background?: string
    className?: string
  }
  components: Component[]
}

interface Row {
  id: string
  order: number
  settings?: {
    columnsGap?: string
    alignment?: 'left' | 'center' | 'right'
    background?: string
    padding?: string
    margin?: string
    className?: string
  }
  columns: Column[]
}

interface Section {
  id: string
  name: string
  order: number
  settings?: {
    backgroundColor?: string
    backgroundImage?: string
    padding?: string
    margin?: string
    minHeight?: string
    className?: string
    customId?: string
  }
  rows: Row[]
}

interface PageContent {
  sections: Section[]
}

interface PageSEO {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  twitterCard?: string
  canonical?: string
}

interface PageLayout {
  id: string
  title: string
  slug: string
  description?: string
  content: PageContent
  seo?: PageSEO
  isPublished: boolean
  publishedAt?: string
  publishedContent?: PageContent
  viewCount?: number
  cacheKey?: string
  createdAt: string
  updatedAt: string
}
```

### Creating a Page

```typescript
const page = await prisma.pageBuilder.create({
  data: {
    title: 'Homepage',
    slug: 'home',
    description: 'Welcome to our website',
    content: {
      sections: [
        {
          id: 'hero-section',
          name: 'Hero',
          order: 0,
          settings: {
            backgroundColor: '#1a1a1a',
            backgroundImage: '/images/hero-bg.jpg',
            padding: '100px 0',
            minHeight: '600px'
          },
          rows: [
            {
              id: 'hero-row',
              order: 0,
              settings: {
                columnsGap: '40px',
                alignment: 'center'
              },
              columns: [
                {
                  id: 'hero-col-1',
                  width: 6,
                  order: 0,
                  settings: {
                    verticalAlign: 'middle'
                  },
                  components: [
                    {
                      id: 'hero-heading',
                      type: 'heading',
                      order: 0,
                      props: {
                        level: 1,
                        text: 'Welcome to Our Agency',
                        fontSize: '56px',
                        fontWeight: 'bold',
                        color: '#ffffff'
                      }
                    },
                    {
                      id: 'hero-text',
                      type: 'text',
                      order: 1,
                      props: {
                        content: 'We build amazing digital experiences',
                        fontSize: '20px',
                        color: '#cccccc'
                      }
                    },
                    {
                      id: 'hero-button',
                      type: 'button',
                      order: 2,
                      props: {
                        text: 'Get Started',
                        link: '/contact',
                        style: 'primary',
                        size: 'large'
                      }
                    }
                  ]
                },
                {
                  id: 'hero-col-2',
                  width: 6,
                  order: 1,
                  components: [
                    {
                      id: 'hero-image',
                      type: 'image',
                      order: 0,
                      props: {
                        src: '/images/hero-illustration.png',
                        alt: 'Hero illustration',
                        width: '100%',
                        height: 'auto'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'features-section',
          name: 'Features',
          order: 1,
          settings: {
            backgroundColor: '#ffffff',
            padding: '80px 0'
          },
          rows: [
            {
              id: 'features-row',
              order: 0,
              settings: {
                columnsGap: '30px'
              },
              columns: [
                {
                  id: 'feature-1',
                  width: 4,
                  order: 0,
                  components: [
                    {
                      id: 'feature-1-icon',
                      type: 'icon',
                      order: 0,
                      props: {
                        name: 'rocket',
                        size: '48px',
                        color: '#007bff'
                      }
                    },
                    {
                      id: 'feature-1-heading',
                      type: 'heading',
                      order: 1,
                      props: {
                        level: 3,
                        text: 'Fast Performance',
                        fontSize: '24px'
                      }
                    },
                    {
                      id: 'feature-1-text',
                      type: 'text',
                      order: 2,
                      props: {
                        content: 'Lightning-fast load times guaranteed'
                      }
                    }
                  ]
                },
                {
                  id: 'feature-2',
                  width: 4,
                  order: 1,
                  components: [
                    {
                      id: 'feature-2-icon',
                      type: 'icon',
                      order: 0,
                      props: {
                        name: 'shield',
                        size: '48px',
                        color: '#28a745'
                      }
                    },
                    {
                      id: 'feature-2-heading',
                      type: 'heading',
                      order: 1,
                      props: {
                        level: 3,
                        text: 'Secure',
                        fontSize: '24px'
                      }
                    },
                    {
                      id: 'feature-2-text',
                      type: 'text',
                      order: 2,
                      props: {
                        content: 'Enterprise-grade security'
                      }
                    }
                  ]
                },
                {
                  id: 'feature-3',
                  width: 4,
                  order: 2,
                  components: [
                    {
                      id: 'feature-3-icon',
                      type: 'icon',
                      order: 0,
                      props: {
                        name: 'users',
                        size: '48px',
                        color: '#ffc107'
                      }
                    },
                    {
                      id: 'feature-3-heading',
                      type: 'heading',
                      order: 1,
                      props: {
                        level: 3,
                        text: 'User Friendly',
                        fontSize: '24px'
                      }
                    },
                    {
                      id: 'feature-3-text',
                      type: 'text',
                      order: 2,
                      props: {
                        content: 'Intuitive and easy to use'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    seo: {
      title: 'Home | Our Agency',
      description: 'Welcome to our agency - we build amazing digital experiences',
      keywords: ['agency', 'web development', 'design'],
      ogImage: '/images/og-home.jpg',
      ogTitle: 'Home | Our Agency - Digital Experiences',
      ogDescription: 'Welcome to our agency',
      twitterCard: 'summary_large_image',
      canonical: 'https://example.com'
    },
    isPublished: true,
    publishedAt: new Date(),
    viewCount: 0,
    cacheKey: 'page:home'
  }
})
```

### Fetching a Page (Single Query!)

```typescript
// Old way (20+ queries!)
const page = await prisma.pageBuilder.findUnique({
  where: { slug: 'home' },
  include: {
    sections: {
      include: {
        rows: {
          include: {
            columns: {
              include: {
                components: true
              }
            }
          }
        }
      }
    }
  }
})

// New way (1 query!)
const page = await prisma.pageBuilder.findUnique({
  where: { slug: 'home' }
})
// page.content already contains everything!
```

## Component Types Reference

### Available Component Types (28 Total)

```typescript
type ComponentType =
  // Basic Components (13)
  | 'heading' // H1-H6 headings with level, fontSize, fontWeight
  | 'text' // Paragraph text with fontSize, color
  | 'rich-text' // HTML/Markdown content
  | 'button' // CTA button with text, link, style, size
  | 'icon' // Icon/SVG with name, size, color
  | 'card' // Card component with image, title, description
  | 'accordion' // Collapsible sections with items array
  | 'tabs' // Tab navigation with tabs array
  | 'testimonial' // Review/testimonial with name, role, content, avatar
  | 'pricing-table' // Pricing plans with plans array
  | 'contact-form' // Contact form with fields array
  | 'newsletter' // Email subscription with placeholder, buttonText
  | 'social-icons' // Social media links with platforms array

  // Media Components (5)
  | 'image' // Single image with src, alt, width, height
  | 'gallery' // Image gallery with images array, layout, columns
  | 'video' // Video embed with src, autoplay, controls
  | 'carousel' // Image carousel with slides array
  | 'map' // Google Maps embed with latitude, longitude

  // Layout Components (2)
  | 'spacer' // Vertical spacing with height
  | 'divider' // Horizontal line with style, thickness

  // Data Components (5)
  | 'list' // Bullet/numbered list with items array
  | 'table' // Data table with headers and rows
  | 'form' // Form component with fields array
  | 'code' // Code block with code, language, theme
  | 'html' // Custom HTML with html string

  // Dynamic API Components (3)
  | 'blog-grid' // Article post grid (requires API)
  | 'service-card' // Service showcase (requires API)
  | 'project-card' // Project showcase (requires API)
```

### Component Props Examples

```typescript
// Basic Components
{
  id: 'heading-1',
  type: 'heading',
  order: 0,
  props: {
    level: 1,                    // 1-6 (H1-H6)
    text: 'Page Title',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#333'
  }
}

{
  id: 'text-1',
  type: 'text',
  order: 1,
  props: {
    content: 'Enter text here',
    fontSize: '16px',
    color: '#666'
  }
}

{
  id: 'button-1',
  type: 'button',
  order: 2,
  props: {
    text: 'Click Me',
    link: '#',
    style: 'primary',            // primary, secondary, outline
    size: 'medium',              // small, medium, large
    fullWidth: false
  }
}

// Media Components
{
  id: 'image-1',
  type: 'image',
  order: 0,
  props: {
    src: '/images/photo.jpg',
    alt: 'Description',
    width: '100%',
    height: 'auto',
    objectFit: 'cover'
  }
}

{
  id: 'gallery-1',
  type: 'gallery',
  order: 1,
  props: {
    images: [],
    layout: 'grid',              // grid, masonry, slider
    columns: 3,
    gap: '15px',
    lightbox: true
  }
}

{
  id: 'video-1',
  type: 'video',
  order: 2,
  props: {
    src: '',
    autoplay: false,
    controls: true
  }
}

// Layout Components
{
  id: 'spacer-1',
  type: 'spacer',
  order: 0,
  props: {
    height: '2rem'
  }
}

{
  id: 'divider-1',
  type: 'divider',
  order: 1,
  props: {
    style: 'solid',
    thickness: '1px',
    color: '#e0e0e0',
    margin: '20px 0'
  }
}

// Advanced Components
{
  id: 'card-1',
  type: 'card',
  order: 0,
  props: {
    image: '',
    title: 'Card Title',
    description: 'Card description',
    link: '',
    buttonText: 'Read More',
    style: 'elevated'            // flat, elevated, outlined
  }
}

{
  id: 'testimonial-1',
  type: 'testimonial',
  order: 1,
  props: {
    name: '',
    role: '',
    content: '',
    avatar: '',
    rating: 5
  }
}

{
  id: 'accordion-1',
  type: 'accordion',
  order: 2,
  props: {
    items: [],
    allowMultiple: false
  }
}

// Dynamic API Components
{
  id: 'blog-grid-1',
  type: 'blog-grid',
  order: 0,
  props: {
    limit: 6,
    columns: 3,
    showExcerpt: true,
    showImage: true
  }
}

{
  id: 'service-card-1',
  type: 'service-card',
  order: 1,
  props: {
    variant: 'grid'
  }
}
```

## API Endpoints Quick Reference

### Frontend Service Methods

```typescript
// Menu Service
menuService.getMenus(params?: { page?, limit?, position? })
menuService.getMenuById(id: string)
menuService.getMenuBySlug(slug: string)
menuService.getMenuByPosition(position: string)
menuService.createMenu(payload: CreateMenuPayload)
menuService.updateMenu(id: string, payload: UpdateMenuPayload)
menuService.deleteMenu(id: string)
menuService.duplicateMenu(id: string)
menuService.publishMenu(id: string)
menuService.unpublishMenu(id: string)

// Page Builder Service
pageBuilderService.getPages(params?: { page?, limit?, search? })
pageBuilderService.getPageById(id: string)
pageBuilderService.getPageBySlug(slug: string)
pageBuilderService.createPage(payload: CreatePagePayload)
pageBuilderService.updatePage(id: string, payload: UpdatePagePayload)
pageBuilderService.deletePage(id: string)
pageBuilderService.duplicatePage(id: string)
pageBuilderService.publishPage(id: string)
pageBuilderService.unpublishPage(id: string)
pageBuilderService.getPreviewUrl(id: string)
```

### Backend API Endpoints

#### Public Endpoints (No Auth Required)

```bash
# Menus
GET /menus                      # Get all published menus
GET /menus/{slug}              # Get menu by slug
GET /menus/position/{position} # Get menu by position (header/footer/etc)

# Pages
GET /pages                     # Get all published pages
GET /pages/{slug}              # Get page by slug
```

#### Admin Endpoints (Auth Required)

```bash
# Menu Management
GET    /admin/menus           # List all menus (with pagination)
POST   /admin/menus           # Create new menu
GET    /admin/menus/{id}      # Get menu by ID
PUT    /admin/menus/{id}      # Update menu (including items)
PATCH  /admin/menus/{id}      # Partial update (e.g., isPublished)
DELETE /admin/menus/{id}      # Delete menu
POST   /admin/menus/{id}/duplicate # Duplicate menu

# Page Management
GET    /admin/pages           # List all pages (with pagination)
POST   /admin/pages           # Create new page
GET    /admin/pages/{id}      # Get page by ID
PUT    /admin/pages/{id}      # Update page (including content)
DELETE /admin/pages/{id}      # Delete page
POST   /admin/pages/{id}/duplicate  # Duplicate page
POST   /admin/pages/{id}/publish    # Publish page
POST   /admin/pages/{id}/unpublish  # Unpublish page
```

## Performance Tips

### 1. Use Select to Limit Fields

```typescript
// Don't load full content in list views
const pages = await prisma.pageBuilder.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    isPublished: true
    // content: false  // Don't load heavy JSON
  }
})
```

### 2. Use Published Content Cache

```typescript
// For public pages, use cached version
const page = await prisma.pageBuilder.findUnique({
  where: { slug, isPublished: true },
  select: {
    publishedContent: true, // Pre-cached published version
    seo: true
  }
})
```

### 3. Leverage Indexes

```sql
-- All these queries are indexed:
WHERE slug = 'home'           -- slug index
WHERE position = 'header'     -- position index
WHERE isPublished = true      -- isPublished index
WHERE cacheKey = 'page:home'  -- cacheKey index
```

### 4. Async View Tracking

```typescript
// Don't wait for view count update
incrementViewCount(pageId).catch(() => {})
// Continue returning response immediately
```

## Frontend Implementation Details

### Component Registry (28 Components)

The frontend maintains a `COMPONENT_REGISTRY` array with definitions for all 28 component types:

```typescript
interface ComponentDefinition {
  type: ComponentType
  label: string
  icon: string
  category: 'basic' | 'media' | 'dynamic' | 'layout'
  description: string
  defaultProps: Record<string, any>
  requiresApi?: boolean
}
```

Categories:

- **Basic** (13): heading, text, rich-text, button, icon, card, accordion, tabs, testimonial, pricing-table, contact-form, newsletter, social-icons
- **Media** (5): image, gallery, video, carousel, map
- **Layout** (2): spacer, divider
- **Data** (5): list, table, form, code, html
- **Dynamic** (3): blog-grid, service-card, project-card (require API)

### Column Layouts

8 predefined grid layouts available:

```typescript
COLUMN_LAYOUTS = [
  { label: '1 Column', value: [12] },
  { label: '2 Columns', value: [6, 6] },
  { label: '3 Columns', value: [4, 4, 4] },
  { label: '4 Columns', value: [3, 3, 3, 3] },
  { label: '2/3 - 1/3', value: [8, 4] },
  { label: '1/3 - 2/3', value: [4, 8] },
  { label: '1/4 - 3/4', value: [3, 9] },
  { label: '3/4 - 1/4', value: [9, 3] }
]
```

### Helper Functions

```typescript
// Generate unique IDs for elements
generateId(): string

// Flatten nested menu items for iteration
flattenMenuItems(items: MenuItem[]): MenuItem[]

// Count total menu items (including nested)
countMenuItems(items: MenuItem[]): number

// Validate slug format
validateSlug(slug: string): boolean

// Generate slug from title
generateSlug(title: string): string
```

## Migration from Old Structure

### Field Name Changes

| Old Field       | New Field               | Type Change                        |
| --------------- | ----------------------- | ---------------------------------- |
| `menu.location` | `menu.position`         | Same values                        |
| `menu.status`   | `menu.isPublished`      | `'published'\|'draft'` → `boolean` |
| `page.status`   | `page.isPublished`      | `'published'\|'draft'` → `boolean` |
| `page.meta`     | `page.seo`              | Object structure updated           |
| `page.layout`   | `page.content.sections` | Wrapped in content object          |

### MenuItem Structure

**Before:**

```typescript
interface MenuItem {
  id: string
  parentId: string | null // Flat structure
  // ... other fields
}
```

**After:**

```typescript
interface MenuItem {
  id: string
  children: MenuItem[] // Nested tree structure
  // ... other fields (no parentId)
}
```

### API Method Changes

**Before:**

```typescript
menuService.updateMenuItems(id, items)
menuService.updateMenuStatus(id, 'published')
pageBuilderService.updatePageLayout(id, layout)
pageBuilderService.updatePageStatus(id, 'draft')
```

**After:**

```typescript
menuService.updateMenu(id, { items })
menuService.publishMenu(id) / menuService.unpublishMenu(id)
pageBuilderService.updatePage(id, { content })
pageBuilderService.publishPage(id) / pageBuilderService.unpublishPage(id)
```

### Database Performance

**Before (Relational):**

```typescript
// Required 5+ database queries with joins
const menu = await prisma.menu.findUnique({
  where: { id },
  include: {
    items: {
      include: { children: { include: { children: true } } }
    }
  }
})
```

**After (JSON):**

```typescript
// Single database query - no joins!
const menu = await prisma.menu.findUnique({
  where: { id }
})
// menu.items already contains the entire tree structure
```

---

## Summary

✅ **Menu System**: 4 item types, nested tree structure, position-based placement  
✅ **Page Builder**: 28 component types, section/row/column hierarchy, full SEO support  
✅ **Performance**: Single-query architecture, no N+1 problems, CDN-friendly  
✅ **Type Safety**: Full TypeScript definitions, strict type checking  
✅ **Developer Experience**: Simple API methods, helper functions, comprehensive docs

**Ready to use!** The database schema is optimized and ready for high-performance CMS operations.

# Unified CMS Routing System

## 🎯 Overview

All content types (pages, blogs, services, products, packages, galleries) are rendered through a **single dynamic route**: `/page/[slug]`

The content type is automatically detected from the API response, not from the URL structure.

## 🌐 URL Structure

**ALL content uses the same URL pattern:**

```
/page/{slug}
```

### Examples

| Type    | Item       | URL                | API Response                     |
| ------- | ---------- | ------------------ | -------------------------------- |
| Page    | About      | `/page/about`      | `{data: {...}, type: 'page'}`    |
| Blog    | My Post    | `/page/my-post`    | `{data: {...}, type: 'post'}`    |
| Service | Web Design | `/page/web-design` | `{data: {...}, type: 'service'}` |
| Product | Product 1  | `/page/product-1`  | `{data: {...}, type: 'product'}` |
| Package | Bali Tour  | `/page/bali-tour`  | `{data: {...}, type: 'package'}` |

## 📁 File Structure

```
src/
├── config/
│   └── contentTypes.ts              # Config for all types
├── components/frontend/content-renderers/
│   ├── ContentRenderer.tsx          # Routes to correct renderer
│   ├── BlogDetailRenderer.tsx
│   ├── ServiceDetailRenderer.tsx
│   ├── ProductDetailRenderer.tsx
│   ├── GalleryDetailRenderer.tsx
│   └── PackageDetailRenderer.tsx
└── app/(front)/page/
    └── [slug]/page.tsx              # SINGLE route for ALL types
```

## 🔧 API Requirements

Your backend must provide a unified endpoint:

**`GET /api/content/{slug}`**

Response format:

```json
{
  "data": {
    "id": "123",
    "slug": "web-design",
    "title": "Web Design Services",
    "type": "service" // ← Type identifier
    // ... type-specific fields
  },
  "type": "service" // ← Can be at root or in data
}
```

## 🔄 How It Works

```
User clicks menu → /page/web-design
                ↓
Frontend fetches → /content/web-design
                ↓
API returns → {data: {...}, type: 'service'}
                ↓
System selects → ServiceDetailRenderer
                ↓
Content rendered with service layout
```

## 📝 Implementation

### Single Route Component

**`src/app/(front)/page/[slug]/page.tsx`**

```typescript
export default function DynamicPage() {
  const { slug } = useParams()

  // Fetch with unified endpoint
  const { data } = useAsync(() => `/content/${slug}`)

  // Extract type from response
  const contentType = data.type || data.data.type || 'page'
  const config = CONTENT_TYPE_CONFIG[contentType]

  // Render with appropriate renderer
  return <ContentRenderer data={data.data} config={config} />
}
```

### Menu URL Generation

All menu items generate `/page/{slug}`:

```typescript
// menu.types.ts
export function getMenuItemUrl(item: MenuItem): string {
  if (item.url) return item.url

  if (isEntityMenuItem(item)) {
    const slug = item.referenceId || '#'

    // Specific item
    if (item.referenceId) {
      return `/page/${slug}`
    }

    // "All" option for listings
    return `/page?type=${item.type}`
  }

  return '#'
}
```

## ✅ Benefits

1. **Clean URLs** - Single pattern for all content
2. **Flexible** - Change type without URL changes
3. **Maintainable** - One route file, not dozens
4. **SEO-Friendly** - Consistent structure
5. **Backend-Driven** - API controls rendering
6. **Simple Menus** - All items use same pattern

## 🚀 Configuration

All content types now use `/page` as base route:

```typescript
// contentTypes.ts
{
  page: { baseRoute: '/page', ... },
  post: { baseRoute: '/page', ... },
  service: { baseRoute: '/page', ... },
  // ... all use /page
}

// MenuItemForm.tsx
{
  page: { frontendBase: '/page', ... },
  post: { frontendBase: '/page', ... },
  service: { frontendBase: '/page', ... },
  // ... all use /page
}
```

## 🔍 Testing

All content now at `/page/{slug}`:

```bash
/page/about         # Page
/page/my-blog      # Blog post
/page/web-design   # Service
/page/product-1    # Product
/page/bali-tour    # Package
```

---

**Version:** 2.0.0 - Unified Route Architecture

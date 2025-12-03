# Unified Grid Component

## Overview

The **Grid Component** is a flexible, unified layout component that replaces the previous `blog-grid` and `product-grid` components. It supports two modes:

1. **API Mode** - Dynamically fetch data from an API endpoint and render with a specified card type
2. **Manual Mode** - Define custom grid items with different card components per item

## Features

✅ **Flexible Data Source** - API-driven or manually defined items  
✅ **Multiple Card Types** - BlogCard, ProductCard, ServiceCard, TourPackageCard, IconBox, etc.  
✅ **Customizable Layout** - 1-6 columns, adjustable gap, grid or masonry layout  
✅ **Responsive Design** - Different column counts for mobile, tablet, desktop  
✅ **Card Styling** - Default, minimal, bordered, elevated styles  
✅ **Hover Effects** - None, lift, zoom, glow  
✅ **Pagination Support** - Optional pagination for API mode

---

## Component Type

```typescript
type: 'grid'
```

---

## Props Schema

### Display Options

| Prop        | Type      | Default          | Description      |
| ----------- | --------- | ---------------- | ---------------- |
| `title`     | `string`  | `'Grid Section'` | Section title    |
| `subtitle`  | `string`  | `''`             | Section subtitle |
| `showTitle` | `boolean` | `true`           | Show/hide title  |

### Layout Options

| Prop             | Type                  | Default  | Description                 |
| ---------------- | --------------------- | -------- | --------------------------- |
| `columns`        | `number`              | `3`      | Number of columns (1-6)     |
| `gap`            | `string`              | `'24'`   | Gap between items in pixels |
| `layout`         | `'grid' \| 'masonry'` | `'grid'` | Layout type                 |
| `columnsMobile`  | `number`              | `1`      | Columns on mobile           |
| `columnsTablet`  | `number`              | `2`      | Columns on tablet           |
| `columnsDesktop` | `number`              | `3`      | Columns on desktop          |

### Data Source Options

| Prop         | Type                | Default | Description      |
| ------------ | ------------------- | ------- | ---------------- |
| `dataSource` | `'api' \| 'manual'` | `'api'` | Data source mode |

### API Mode Options

| Prop               | Type           | Default       | Description                 |
| ------------------ | -------------- | ------------- | --------------------------- |
| `apiEndpoint`      | `string`       | `'/api/blog'` | API endpoint URL            |
| `apiParams`        | `object`       | `{}`          | Additional query parameters |
| `itemsPerPage`     | `number`       | `6`           | Items per page              |
| `enablePagination` | `boolean`      | `true`        | Enable pagination           |
| `cardType`         | `GridCardType` | `'BlogCard'`  | Card component to render    |

### Manual Mode Options

| Prop        | Type         | Default | Description         |
| ----------- | ------------ | ------- | ------------------- |
| `gridItems` | `GridItem[]` | `[]`    | Array of grid items |

### Card Styling Options

| Prop          | Type     | Default     | Description                                       |
| ------------- | -------- | ----------- | ------------------------------------------------- |
| `cardProps`   | `object` | `{}`        | Props passed to all card components               |
| `cardStyle`   | `string` | `'default'` | Card style (default, minimal, bordered, elevated) |
| `hoverEffect` | `string` | `'lift'`    | Hover effect (none, lift, zoom, glow)             |

---

## Available Card Types

```typescript
type GridCardType =
  | 'BlogCard'
  | 'ProductCard'
  | 'ServiceCard'
  | 'TourPackageCard'
  | 'TestimonialCard'
  | 'TeamMemberCard'
  | 'PricingCard'
  | 'IconBox'
  | 'FeatureCard'
  | 'PortfolioCard'
  | 'custom'
```

---

## Usage Examples

### Example 1: API Mode - Blog Grid

```json
{
  "type": "grid",
  "props": {
    "title": "Latest Blog Posts",
    "subtitle": "Read our latest articles and insights",
    "showTitle": true,
    "dataSource": "api",
    "apiEndpoint": "/api/blog",
    "apiParams": {
      "category": "travel",
      "sortBy": "date-desc"
    },
    "cardType": "BlogCard",
    "columns": 3,
    "gap": "24",
    "itemsPerPage": 9,
    "enablePagination": true,
    "cardStyle": "elevated",
    "hoverEffect": "lift"
  }
}
```

### Example 2: API Mode - Product Grid

```json
{
  "type": "grid",
  "props": {
    "title": "Our Products",
    "subtitle": "Browse our collection",
    "dataSource": "api",
    "apiEndpoint": "/api/products",
    "cardType": "ProductCard",
    "columns": 4,
    "columnsMobile": 1,
    "columnsTablet": 2,
    "columnsDesktop": 4,
    "cardStyle": "bordered",
    "hoverEffect": "zoom"
  }
}
```

### Example 3: Manual Mode - Mixed Cards

```json
{
  "type": "grid",
  "props": {
    "title": "Our Services",
    "dataSource": "manual",
    "columns": 3,
    "gap": "32",
    "gridItems": [
      {
        "id": "item-1",
        "order": 0,
        "cardType": "IconBox",
        "props": {
          "icon": "Package",
          "title": "Fast Delivery",
          "description": "Quick and reliable shipping"
        }
      },
      {
        "id": "item-2",
        "order": 1,
        "cardType": "IconBox",
        "props": {
          "icon": "Shield",
          "title": "Secure Payment",
          "description": "100% secure transactions"
        }
      },
      {
        "id": "item-3",
        "order": 2,
        "cardType": "PricingCard",
        "props": {
          "title": "Premium Plan",
          "price": "$99/mo",
          "features": ["Feature 1", "Feature 2", "Feature 3"]
        }
      }
    ],
    "cardStyle": "elevated",
    "hoverEffect": "glow"
  }
}
```

### Example 4: Manual Mode - Tour Packages

```json
{
  "type": "grid",
  "props": {
    "title": "Featured Destinations",
    "dataSource": "manual",
    "columns": 2,
    "layout": "grid",
    "gridItems": [
      {
        "id": "pkg-1",
        "order": 0,
        "cardType": "TourPackageCard",
        "props": {
          "title": "Bali Adventure",
          "duration": "7 Days / 6 Nights",
          "price": "$1,299",
          "image": "/images/bali.jpg",
          "destination": "Bali, Indonesia"
        }
      },
      {
        "id": "pkg-2",
        "order": 1,
        "cardType": "TourPackageCard",
        "props": {
          "title": "Paris Romance",
          "duration": "5 Days / 4 Nights",
          "price": "$1,899",
          "image": "/images/paris.jpg",
          "destination": "Paris, France"
        }
      }
    ]
  }
}
```

---

## Grid Item Structure

When using **Manual Mode**, each grid item has this structure:

```typescript
interface GridItem {
  id: string // Unique identifier
  order: number // Sort order
  cardType: GridCardType // Which card component to use
  props: Record<string, any> // Props for the card component
}
```

---

## Card Styles

### Default

Standard card with border

### Minimal

Clean card without border

### Bordered

Card with prominent 2px border

### Elevated

Card with shadow for depth

---

## Hover Effects

### None

No hover effect

### Lift

Card moves up slightly on hover

### Zoom

Card scales up on hover

### Glow

Card gets a glowing shadow on hover

---

## API Response Format

When using **API Mode**, the endpoint should return:

```json
{
  "data": [
    {
      "id": "1",
      "title": "Item Title",
      "description": "Item description",
      "image": "/images/item.jpg"
      // ... other card-specific fields
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 9,
    "total": 27,
    "totalPages": 3
  }
}
```

---

## Creating Custom Card Components

See `/src/components/frontend/page-builder/cards/README.md` for detailed instructions on creating custom card components.

### Quick Start

1. Create a new card component:

```tsx
// BlogCard.tsx
export interface BlogCardProps {
  title: string
  excerpt?: string
  image?: string
  author?: string
  date?: string
}

export function BlogCard({ title, excerpt, image, author, date }: BlogCardProps) {
  return (
    <div className='bg-white rounded-lg border overflow-hidden'>
      {image && <img src={image} alt={title} className='w-full aspect-video object-cover' />}
      <div className='p-4 space-y-2'>
        <h3 className='font-semibold text-lg'>{title}</h3>
        {excerpt && <p className='text-gray-600 text-sm'>{excerpt}</p>}
        {author && <p className='text-xs text-gray-500'>By {author}</p>}
      </div>
    </div>
  )
}
```

2. Register it in `cards/index.ts`:

```typescript
import { BlogCard } from './BlogCard'

export const cardComponents = {
  BlogCard: BlogCard
  // ... other cards
}
```

3. Add the type to `types/page-builder.ts`:

```typescript
export type GridCardType =
  | 'BlogCard'
  | 'YourNewCard'  // Add here
  | ...
```

4. Update widget options in `widgets/content-widgets.ts`:

```typescript
{
  name: 'cardType',
  label: 'Card Type',
  type: 'select',
  options: [
    { label: 'Your New Card', value: 'YourNewCard' }
  ]
}
```

---

## Migration from Old Components

### From `blog-grid`

**Before:**

```json
{
  "type": "blog-grid",
  "props": {
    "title": "Blog Posts",
    "columns": 3,
    "apiEndpoint": "/api/blog"
  }
}
```

**After:**

```json
{
  "type": "grid",
  "props": {
    "title": "Blog Posts",
    "dataSource": "api",
    "cardType": "BlogCard",
    "columns": 3,
    "apiEndpoint": "/api/blog"
  }
}
```

### From `product-grid`

**Before:**

```json
{
  "type": "product-grid",
  "props": {
    "title": "Products",
    "columns": 4,
    "apiEndpoint": "/api/products"
  }
}
```

**After:**

```json
{
  "type": "grid",
  "props": {
    "title": "Products",
    "dataSource": "api",
    "cardType": "ProductCard",
    "columns": 4,
    "apiEndpoint": "/api/products"
  }
}
```

---

## Best Practices

1. **Use API Mode** for dynamic content that changes frequently
2. **Use Manual Mode** for curated, static content or mixed card types
3. **Set appropriate column counts** for different screen sizes
4. **Choose card styles** that match your design system
5. **Implement pagination** for large datasets
6. **Create reusable card components** instead of duplicating code
7. **Pass consistent props** to card components for uniform styling

---

## Troubleshooting

### Grid items not showing

- Check that `dataSource` is set correctly
- For API mode, verify `apiEndpoint` is correct
- For manual mode, ensure `gridItems` array has items
- Check browser console for errors

### Card styling not working

- Verify `cardStyle` prop is one of: default, minimal, bordered, elevated
- Check that Tailwind classes are properly applied
- Ensure card components are using the correct class names

### Hover effects not applied

- Confirm `hoverEffect` prop is set (none, lift, zoom, glow)
- Check that transition classes are present
- Verify CSS is loaded correctly

---

## Future Enhancements

- [ ] Masonry layout implementation
- [ ] Lazy loading for images
- [ ] Infinite scroll option
- [ ] Sorting and filtering UI
- [ ] Skeleton loading states
- [ ] Animation on scroll
- [ ] Card drag-and-drop reordering (manual mode)

# Grid Component - Quick Reference

## Component Type

```typescript
type: 'grid'
```

## Two Modes

### 🔌 API Mode (Dynamic)

Fetch data from API and render with one card type

```json
{
  "dataSource": "api",
  "apiEndpoint": "/api/blog",
  "cardType": "BlogCard",
  "itemsPerPage": 6,
  "enablePagination": true
}
```

### ✏️ Manual Mode (Custom)

Define each item individually with different card types

```json
{
  "dataSource": "manual",
  "gridItems": [
    { "id": "1", "cardType": "IconBox", "props": {...} },
    { "id": "2", "cardType": "PricingCard", "props": {...} }
  ]
}
```

## Card Types

- `BlogCard` - Blog posts
- `ProductCard` - Products/shop items
- `ServiceCard` - Service offerings
- `TourPackageCard` - Travel packages
- `TestimonialCard` - Customer reviews
- `TeamMemberCard` - Team profiles
- `PricingCard` - Pricing plans
- `IconBox` - Icon with text
- `FeatureCard` - Feature highlights
- `PortfolioCard` - Portfolio items
- `custom` - Custom card

## Layout Props

| Prop             | Type   | Default  | Options       |
| ---------------- | ------ | -------- | ------------- |
| `columns`        | number | `3`      | 1-6           |
| `gap`            | string | `'24'`   | Any px value  |
| `layout`         | string | `'grid'` | grid, masonry |
| `columnsMobile`  | number | `1`      | 1-2           |
| `columnsTablet`  | number | `2`      | 1-4           |
| `columnsDesktop` | number | `3`      | 1-6           |

## Styling Props

| Prop          | Type   | Default     | Options                              |
| ------------- | ------ | ----------- | ------------------------------------ |
| `cardStyle`   | string | `'default'` | default, minimal, bordered, elevated |
| `hoverEffect` | string | `'lift'`    | none, lift, zoom, glow               |

## Quick Examples

### Blog Grid

```json
{
  "type": "grid",
  "props": {
    "title": "Latest Posts",
    "dataSource": "api",
    "apiEndpoint": "/api/blog",
    "cardType": "BlogCard",
    "columns": 3
  }
}
```

### Product Grid

```json
{
  "type": "grid",
  "props": {
    "title": "Products",
    "dataSource": "api",
    "apiEndpoint": "/api/products",
    "cardType": "ProductCard",
    "columns": 4
  }
}
```

### Mixed Cards

```json
{
  "type": "grid",
  "props": {
    "dataSource": "manual",
    "columns": 3,
    "gridItems": [
      {"id": "1", "cardType": "IconBox", "props": {...}},
      {"id": "2", "cardType": "PricingCard", "props": {...}},
      {"id": "3", "cardType": "TestimonialCard", "props": {...}}
    ]
  }
}
```

## Files Location

- **Types:** `/src/types/page-builder.ts`
- **Widget:** `/src/lib/page-builder/widgets/content-widgets.ts`
- **Admin Preview:** `/src/components/admin/page-builder/ComponentRenderer.tsx`
- **Frontend Render:** `/src/components/frontend/page-builder/Renderer.tsx`
- **Cards:** `/src/components/frontend/page-builder/cards/`
- **Docs:** `/docs/GRID_COMPONENT.md`

## Creating New Cards

1. Create component in `/cards/YourCard.tsx`
2. Export interface and component
3. Register in `/cards/index.ts`
4. Add type to `GridCardType` in types
5. Add option to widget config

## Migration

Replace old components:

```diff
- "type": "blog-grid"
+ "type": "grid"
+ "dataSource": "api"
+ "cardType": "BlogCard"
```

```diff
- "type": "product-grid"
+ "type": "grid"
+ "dataSource": "api"
+ "cardType": "ProductCard"
```

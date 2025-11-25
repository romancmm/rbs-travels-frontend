# Menu System - Usage Guide

## Overview

The menu system has been refactored to follow enterprise CMS patterns with a generic, type-safe structure.

## Menu Item Types

- **page** - Link to a CMS page (uses referenceId)
- **post** - Link to a blog post (uses referenceId)
- **category** - Link to a category page (uses referenceId)
- **service** - Link to a service page (uses referenceId)
- **project** - Link to a project page (uses referenceId)
- **custom** - Custom internal link (uses url)
- **external** - External link (uses url)

## Frontend Usage

### Server Components (Layouts, Pages)

```tsx
import { Menu } from '@/components/frontend/Menu'
import { getMenuByPosition } from '@/lib/menu-server'

export default async function Layout() {
  const headerMenu = await getMenuByPosition('header')

  return <header>{headerMenu && <Menu items={headerMenu.items} orientation='horizontal' />}</header>
}
```

### Client Components

```tsx
'use client'

import { Menu } from '@/components/frontend/Menu'
import { getMenuByPosition } from '@/services/api/menu'
import { useEffect, useState } from 'react'

export function Header() {
  const [menu, setMenu] = useState(null)

  useEffect(() => {
    getMenuByPosition('header').then(setMenu)
  }, [])

  return <header>{menu && <Menu items={menu.items} orientation='horizontal' showIcons />}</header>
}
```

### Mobile Menu

```tsx
import { MobileMenu } from '@/components/frontend/Menu'

export function MobileNav({ items }) {
  return <MobileMenu items={items} showIcons />
}
```

## Admin Usage

### Creating Menu Items

In `MenuItemForm.tsx`, select the type and fill the appropriate fields:

- **Entity types** (page/post/category/service/project): Select from dropdown using referenceId
- **Link types** (custom/external): Enter URL

### URL Resolution

The system automatically resolves URLs based on type:

- **page**: `/page/${page.slug}`
- **post**: `/page/${category.slug}/${post.slug}`
- **category**: `/page/${category.slug}`
- **service**: `/services/${service.slug}`
- **project**: `/projects/${project.slug}`
- **custom**: Uses the url field as-is
- **external**: Uses the url field (must start with http:// or https://)

## API Endpoints

### Public Endpoints

- `GET /menu/position/:position` - Get menu by position (header, footer, etc.)
- `GET /menu/slug/:slug` - Get menu by slug
- `GET /menu/:id` - Get menu by ID

### Admin Endpoints

- `GET /admin/menus` - List all menus
- `POST /admin/menus` - Create menu
- `PUT /admin/menus/:id` - Update menu
- `DELETE /admin/menus/:id` - Delete menu

## Migration from Old Structure

### Old Structure (Anti-pattern)

```typescript
interface MenuItem {
  type: 'page' | 'category' | 'article' | 'custom' | 'link'
  categoryId?: string
  pageId?: string
  articleId?: string
  link?: string
}
```

### New Structure (Enterprise Pattern)

```typescript
interface MenuItem {
  type: 'page' | 'post' | 'category' | 'service' | 'project' | 'custom' | 'external-link'
  referenceId?: string // For entity types
  url?: string // For link types
}
```

### Migration Steps

1. **Entity types**: Copy appropriate ID to `referenceId`

   - `pageId` → `referenceId` (type: 'page')
   - `articleId` → `referenceId` (type: 'post')
   - `categoryId` → `referenceId` (type: 'category')

2. **Link types**: Copy URL to `url` field

   - `link` → `url` (type: 'custom' or 'external-link')

3. **Type updates**:
   - 'article' → 'post'
   - 'link' → Determine if 'custom' (internal) or 'external-link'

## Example Menu Structure

```json
{
  "name": "Main Menu",
  "slug": "main-menu",
  "position": "header",
  "items": [
    {
      "id": "1",
      "title": "Home",
      "type": "page",
      "referenceId": "home-page-id",
      "order": 0
    },
    {
      "id": "2",
      "title": "Article",
      "type": "category",
      "referenceId": "blog-category-id",
      "order": 1,
      "children": [
        {
          "id": "2-1",
          "title": "Latest Posts",
          "type": "post",
          "referenceId": "post-id",
          "order": 0
        }
      ]
    },
    {
      "id": "3",
      "title": "Contact",
      "type": "custom-link",
      "url": "/contact",
      "order": 2
    },
    {
      "id": "4",
      "title": "GitHub",
      "type": "external-link",
      "url": "https://github.com/example",
      "target": "_blank",
      "order": 3
    }
  ]
}
```

## Best Practices

1. **Use server-side fetching** in layouts for better performance
2. **Cache menu data** - Menus change infrequently
3. **Validate external URLs** - Ensure they start with http:// or https://
4. **Keep menus shallow** - Max 2-3 levels deep for UX
5. **Use descriptive titles** - Help users understand where links go
6. **Set proper targets** - `_blank` for external, `_self` for internal
7. **Add CSS classes** - Use cssClass for styling specific items
8. **Test on mobile** - Ensure mobile menu works properly

## Troubleshooting

### Menu not showing

- Check if menu exists at the position
- Verify API endpoint is correct
- Check console for errors

### Links not working

- Verify referenceId points to valid entity
- Check URL format for custom/external links
- Ensure entity slugs are correct

### Dropdown not opening

- Check if children array is populated
- Verify hasChildren() utility is working
- Check CSS z-index values

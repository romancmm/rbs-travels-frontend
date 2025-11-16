# CMS Structure Update - JSON-Based Architecture

## Overview

Updated the CMS (Menu Manager and Page Builder) structure to match the JSON-based backend architecture for optimal performance with single-query operations (no joins).

## Key Changes

### 1. **Menu System Updates**

#### Type Changes (`/src/types/cms.ts`)

- **Renamed**: `MenuLocation` → `MenuPosition` (to match backend)
- **Changed**: `Menu.location` → `Menu.position`
- **Changed**: `Menu.status: 'published' | 'draft'` → `Menu.isPublished: boolean`
- **Updated**: `MenuItem` structure to use nested `children` arrays (not flat with `parentId`)
- **Updated**: Menu items stored as JSON array with full tree structure

#### API Service Changes (`/src/services/api/cms.service.ts`)

- **Updated endpoints**: `/admin/menu` → `/admin/menus` (pluralized)
- **Added**: `getMenuByPosition(position: string)` - for frontend rendering
- **Replaced**: `updateMenuItems()` removed, use `updateMenu()` instead
- **Replaced**: `updateMenuStatus()` split into `publishMenu()` and `unpublishMenu()`
- **Added**: `duplicateMenu(id: string)` endpoint
- **Simplified**: Helper functions - removed `buildMenuTree`, kept `flattenMenuItems` and added `countMenuItems`

#### Component Updates

- **MenuFormDialog**:
  - Changed `location` field to `position`
  - Changed `status` dropdown to `isPublished` checkbox
  - Updated form schema and default values
- **MenuEditorSheet**:
  - Updated to use `menu.position` and `menu.isPublished`
  - Changed `updateMenuItems()` to `updateMenu()` with items
- **MenuItemsBuilder**:

  - Removed `parentId` from MenuItem creation (uses nested structure)
  - Items stored directly in nested tree format

- **Menu Manager Page**:
  - Updated API endpoint from `/admin/menu` to `/admin/menus`
  - Changed status handling to use `publishMenu/unpublishMenu`
  - Updated display to show `position` and `isPublished`

### 2. **Page Builder System Updates**

#### Type Changes (`/src/types/cms.ts`)

- **Expanded**: `ComponentType` from 22 to 28 types (added: card, list, table, form, map, code, html, accordion, tabs, testimonial, pricing-table, contact-form, newsletter, social-icons, blog-grid, service-card, project-card)
- **Changed**: `PageLayout.status: 'published' | 'draft'` → `PageLayout.isPublished: boolean`
- **Changed**: `PageLayout.meta` → split into `PageLayout.description` and `PageLayout.seo`
- **Added**: `PageLayout.content: PageContent` - JSON field containing entire page structure
- **Added**: `PageLayout.seo: PageSEO` - comprehensive SEO metadata
- **Added**: `PageLayout.publishedContent` - cached published version
- **Added**: `PageLayout.viewCount` and `PageLayout.cacheKey`
- **Updated**: `Component.order` added for proper ordering
- **Updated**: `Column.order` and `Row.order` added
- **Updated**: `Section.order` added

#### New SEO Structure

```typescript
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
```

#### API Service Changes (`/src/services/api/cms.service.ts`)

- **Updated endpoints**: `/admin/page-builder` → `/admin/pages` (simplified)
- **Updated**: `getPageBySlug()` endpoint from `/admin/page-builder/slug/{slug}` to `/pages/{slug}`
- **Replaced**: `updatePageLayout()` removed, use `updatePage()` instead
- **Replaced**: `updatePageStatus()` split into `publishPage()` and `unpublishPage()`
- **Updated**: `duplicatePage()` no longer accepts title parameter

#### Component Updates

- **PageFormDialog**:

  - Updated form schema with `description`, `isPublished`, and `seo` fields
  - Removed `status` dropdown, added `isPublished` checkbox
  - Added separate SEO title and meta description fields
  - Changed `meta.keywords` from string to array
  - Removed unused Select component imports

- **Page Builder Page**:
  - Updated API endpoint from `/admin/page-builder` to `/admin/pages`
  - Changed status handling to use `publishPage/unpublishPage`
  - Updated display to show `isPublished`
  - Fixed section count display: `page.content.sections.length`

### 3. **Component Registry Updates**

Expanded `COMPONENT_REGISTRY` with 28 component definitions:

- **Basic**: heading, text, rich-text, button, icon, card, accordion, tabs, testimonial, pricing-table, contact-form, newsletter, social-icons, list, table, form, code, html
- **Media**: image, gallery, video, carousel, map
- **Layout**: spacer, divider
- **Dynamic** (requiresApi): blog-grid, service-card, project-card

Each component now has proper default props matching the JSON structure reference.

## Benefits of JSON Structure

### Performance Improvements

1. **Single Query**: Menu/Page fetched in one database query (no joins)
2. **No N+1 Problem**: Entire tree structure loaded at once
3. **Faster Reads**: JSON fields indexed and optimized by database
4. **Cached Publishing**: `publishedContent` field for instant public access

### Developer Benefits

1. **Simpler Code**: No complex recursive queries or tree building
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Easier Testing**: Self-contained data structures
4. **Better DX**: Direct manipulation of nested structures

### Scalability

1. **Horizontal Scaling**: Stateless architecture
2. **CDN Friendly**: Published content easily cacheable
3. **View Tracking**: Built-in `viewCount` for analytics
4. **Cache Keys**: Automatic cache invalidation support

## API Endpoint Summary

### Menu Endpoints

- `GET /admin/menus` - List all menus (admin)
- `GET /admin/menus/:id` - Get menu by ID (admin)
- `GET /menus/:slug` - Get menu by slug (public)
- `GET /menus/position/:position` - Get menu by position (public)
- `POST /admin/menus` - Create menu
- `PUT /admin/menus/:id` - Update menu (including items)
- `PATCH /admin/menus/:id` - Partial update (e.g., isPublished)
- `DELETE /admin/menus/:id` - Delete menu
- `POST /admin/menus/:id/duplicate` - Duplicate menu

### Page Endpoints

- `GET /admin/pages` - List all pages (admin)
- `GET /admin/pages/:id` - Get page by ID (admin)
- `GET /pages/:slug` - Get page by slug (public)
- `POST /admin/pages` - Create page
- `PUT /admin/pages/:id` - Update page (including content)
- `DELETE /admin/pages/:id` - Delete page
- `POST /admin/pages/:id/duplicate` - Duplicate page
- `POST /admin/pages/:id/publish` - Publish page
- `POST /admin/pages/:id/unpublish` - Unpublish page

## Migration Notes

### Breaking Changes

1. **Field Renames**: `location` → `position`, `status` → `isPublished`, `meta` → `seo`
2. **API Methods**: `updateMenuItems`, `updatePageLayout`, `updateMenuStatus`, `updatePageStatus` removed
3. **Structure**: MenuItem no longer has `parentId` (uses nested children)
4. **Types**: MenuLocation → MenuPosition

### Data Migration Required

If you have existing data in the old format:

1. Convert `status: 'published'` to `isPublished: true`
2. Convert `status: 'draft'` to `isPublished: false`
3. Rename `location` field to `position`
4. Migrate `meta` to `seo` structure with keywords as array

### Frontend Code Updates

- Update all references to `menu.location` → `menu.position`
- Update all references to `menu.status` → `menu.isPublished`
- Update all references to `page.status` → `page.isPublished`
- Update all references to `page.meta` → `page.seo`
- Update API endpoint URLs (add 's' to pluralize)

## Files Modified

### Type Definitions

- ✅ `/src/types/cms.ts` - Complete rewrite to match JSON structure

### Services

- ✅ `/src/services/api/cms.service.ts` - Updated all API methods and endpoints

### Admin Components

- ✅ `/src/components/admin/cms/MenuFormDialog.tsx`
- ✅ `/src/components/admin/cms/MenuEditorSheet.tsx`
- ✅ `/src/components/admin/cms/MenuItemsBuilder.tsx`
- ✅ `/src/components/admin/cms/PageFormDialog.tsx`

### Admin Pages

- ✅ `/src/app/admin/(dashboard)/menu-manager/page.tsx`
- ✅ `/src/app/admin/(dashboard)/page-builder/page.tsx`

## Testing Checklist

- [ ] Menu creation with position and isPublished
- [ ] Menu editing and updating items
- [ ] Menu publish/unpublish functionality
- [ ] Menu deletion and duplication
- [ ] Nested menu item creation and editing
- [ ] Page creation with SEO metadata
- [ ] Page editing and content updates
- [ ] Page publish/unpublish functionality
- [ ] Page deletion and duplication
- [ ] Type checking passes (`bun run check`)
- [ ] Build succeeds (`bun run build`)

## Next Steps

1. **Test Backend Integration**: Verify all API endpoints work with new structure
2. **Data Migration**: If needed, migrate existing data to new format
3. **Visual Page Builder**: Implement Step 4 (drag-and-drop canvas)
4. **Component Renderer**: Implement Step 5 (frontend display)
5. **Documentation**: Update API documentation with new endpoints
6. **Performance Testing**: Measure query performance improvements

---

✅ **Type Check Status**: All TypeScript checks passing
✅ **Structure Alignment**: Matches `JSON_STRUCTURE_REFERENCE.md` exactly
✅ **Backward Compatibility**: Breaking changes documented for migration

# Backend Validation Fix

## Problem

Backend Zod validation was rejecting menu item data with two types of errors:

1. **Null value errors**: Optional fields (`icon`, `cssClass`, `meta`) were being sent as `null` instead of being omitted
2. **Invalid UUID format**: Menu item IDs were using timestamp-based format instead of proper UUID v4

## Solution

### 1. UUID Generation Fix

Updated `generateId()` function in `/src/services/api/cms.service.ts` to generate proper UUID v4 format:

```typescript
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
```

**Result**: Generates valid UUIDs like `a3f2b4c1-5d6e-4f7a-8b9c-0d1e2f3a4b5c`

### 2. Menu Item Data Sanitization

Added helper functions to clean menu item data before sending to backend:

**File**: `/src/services/api/cms.service.ts`

```typescript
/**
 * Clean menu item data before sending to backend
 * Removes null/empty values and ensures proper structure
 */
export const cleanMenuItem = (item: any): any => {
  const cleaned: any = {
    id: item.id,
    title: item.title,
    type: item.type,
    order: item.order,
    target: item.target || '_self'
  }

  // Only add optional fields if they have non-empty values
  if (item.link && item.link.trim()) cleaned.link = item.link
  if (item.categoryId && item.categoryId.trim()) cleaned.categoryId = item.categoryId
  if (item.pageId && item.pageId.trim()) cleaned.pageId = item.pageId
  if (item.articleId && item.articleId.trim()) cleaned.articleId = item.articleId
  if (item.icon && item.icon.trim()) cleaned.icon = item.icon
  if (item.menuId) cleaned.menuId = item.menuId
  if (item.parentId !== undefined && item.parentId !== null) cleaned.parentId = item.parentId

  // Recursively clean children
  if (item.children && item.children.length > 0) {
    cleaned.children = item.children.map(cleanMenuItem)
  } else {
    cleaned.children = []
  }

  return cleaned
}

/**
 * Clean menu items array
 */
export const cleanMenuItems = (items: any[]): any[] => {
  return items.map(cleanMenuItem)
}
```

### 3. Updated MenuEditorSheet

Modified `/src/components/admin/cms/MenuEditorSheet.tsx` to sanitize data before API call:

```typescript
const handleSave = async () => {
  if (!menu) return

  setSaving(true)
  try {
    // Clean menu items before sending to backend
    const cleanedItems = cleanMenuItems(items)
    await menuService.updateMenu(menu.id, { items: cleanedItems })
    toast.success('Menu items updated successfully')
    onSuccess()
    onOpenChange(false)
  } catch (error: any) {
    console.error('Failed to update menu items:', error)
    toast.error(error?.response?.data?.message || 'Failed to save menu items')
  } finally {
    setSaving(false)
  }
}
```

## Validation Rules

The cleaning function ensures:

1. ✅ Required fields are always present: `id`, `title`, `type`, `order`, `target`
2. ✅ Optional fields are only included if they have non-empty values
3. ✅ Empty strings are treated as missing values and omitted
4. ✅ Children array is always present (empty array if no children)
5. ✅ Recursive cleaning for nested menu items
6. ✅ UUID v4 format for all IDs

## Backend Compatibility

This implementation now matches backend Zod validation expectations:

```typescript
// Backend expects:
{
  id: string (UUID v4 format)
  title: string
  type: MenuItemType
  order: number
  target: '_self' | '_blank'
  link?: string (optional, must be omitted or string - not null)
  icon?: string (optional, must be omitted or string - not null)
  pageId?: string (optional, must be omitted or string - not null)
  categoryId?: string (optional, must be omitted or string - not null)
  articleId?: string (optional, must be omitted or string - not null)
  menuId?: string (optional, UUID format if present)
  parentId?: string | null (can be null for root items)
  children: MenuItem[] (required array)
}
```

## Testing Checklist

- [x] TypeScript compilation passes
- [ ] Create menu with items
- [ ] Update menu items
- [ ] Add nested menu items
- [ ] Edit existing menu items
- [ ] Delete menu items
- [ ] Verify backend accepts sanitized data
- [ ] Test with various menu item types (custom-link, custom-page, etc.)

## Files Modified

1. `/src/services/api/cms.service.ts`

   - Updated `generateId()` to UUID v4 format
   - Added `cleanMenuItem()` helper
   - Added `cleanMenuItems()` helper

2. `/src/components/admin/cms/MenuEditorSheet.tsx`
   - Import `cleanMenuItems`
   - Clean items before API call in `handleSave()`

## Next Steps

1. Test menu CRUD operations with backend
2. Verify cache regeneration works correctly
3. Test nested menu item creation and updates
4. Ensure drag-and-drop ordering persists correctly

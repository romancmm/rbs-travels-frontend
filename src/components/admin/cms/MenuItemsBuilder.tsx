'use client'

/**
 * Menu Items Builder
 * Drag-and-drop interface for managing nested menu items
 */

import {
  ChevronRight,
  Edit,
  ExternalLink,
  FileText,
  FolderOpen,
  Link as LinkIcon,
  Plus,
  Trash2
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { revalidateTags } from '@/action/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'
import { cn } from '@/lib/utils'
import { menuService } from '@/services/api/cms.service'
import type { CreateMenuItemPayload, UpdateMenuItemPayload } from '@/types/cms'
import type { MenuItem, MenuItemType } from '@/types/menu.types'
import { MENU_ITEM_TYPE_LABELS } from '@/types/menu.types'
import MenuItemForm from './MenuItemForm'

// A menu item can only be nested two levels deep below the root (root ->
// child -> grandchild) - the "Add child" action stops appearing past that.
const MAX_NESTING_LEVEL = 2

const MENU_ITEM_ICONS: Record<MenuItemType, typeof FileText> = {
  page: FileText,
  'single-article': FileText,
  'category-blog': FolderOpen,
  gallery: FolderOpen,
  'custom-link': LinkIcon,
  'external-link': ExternalLink
}

function getMenuItemSubtext(item: MenuItem): string {
  if (item.url) return item.url
  if (item.type === 'category-blog' && Array.isArray(item.reference)) {
    return `${item.reference.length} ${item.reference.length === 1 ? 'category' : 'categories'}`
  }
  if (item.reference && typeof item.reference === 'string') {
    return `Slug: ${item.reference.slice(0, 20)}${item.reference.length > 20 ? '...' : ''}`
  }
  return 'No link'
}

// ─── Presentational row ──────────────────────────────────────────────────────

interface MenuItemRowProps {
  item: MenuItem
  level: number
  hasChildren: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  onAddChild: () => void
  onEdit: () => void
  onDelete: () => void
  onTogglePublished: () => void
}

function MenuItemRow({
  item,
  level,
  hasChildren,
  isExpanded,
  onToggleExpand,
  onAddChild,
  onEdit,
  onDelete,
  onTogglePublished
}: MenuItemRowProps) {
  const Icon = MENU_ITEM_ICONS[item.type] ?? LinkIcon

  return (
    <div className='group flex items-center gap-4 bg-background p-3 border rounded-lg transition-colors'>
      {/* Expand/Collapse */}
      {hasChildren ? (
        <button
          type='button'
          onClick={onToggleExpand}
          className='text-muted-foreground hover:text-foreground'
        >
          <ChevronRight
            className={cn('w-4 h-4 transition-transform duration-200', isExpanded && 'rotate-90')}
          />
        </button>
      ) : (
        <span className='w-4' />
      )}

      {/* Icon */}
      <Icon className='w-4 h-4 text-muted-foreground shrink-0' />

      {/* Content */}
      <div className='flex-1 space-y-1'>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>{item.title}</span>
          <Badge variant='secondary' className='text-xs'>
            {MENU_ITEM_TYPE_LABELS[item.type]}
          </Badge>
          {/* <Badge variant='outline' className='text-xs' title='Display order'>
            {item.order}
          </Badge> */}
          {item.target === '_blank' && <ExternalLink className='w-3 h-3' />}
        </div>
        <p className='text-muted-foreground text-xs'>{getMenuItemSubtext(item)}</p>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity'>
        <Switch
          checked={item.isPublished ?? false}
          onCheckedChange={onTogglePublished}
          onClick={(e) => e.stopPropagation()}
        />

        <div className='bg-border w-px h-4' />

        {level < MAX_NESTING_LEVEL && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={onAddChild}
            title='Add child item'
          >
            <Plus className='w-4 h-4' />
          </Button>
        )}
        <Button type='button' variant='ghost' size='icon' onClick={onEdit} title='Edit'>
          <Edit className='w-4 h-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          title='Delete'
          className='text-destructive hover:text-destructive'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </div>
    </div>
  )
}

// ─── Recursive tree, with a connector spine down each sibling group ─────────

interface MenuItemTreeProps {
  items: MenuItem[]
  level: number
  expandedItems: Set<string>
  onToggleExpand: (id: string) => void
  onAddChild: (parentId: string) => void
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
  onTogglePublished: (item: MenuItem) => void
}

function MenuItemTree({
  items,
  level,
  expandedItems,
  onToggleExpand,
  onAddChild,
  onEdit,
  onDelete,
  onTogglePublished
}: MenuItemTreeProps) {
  if (items.length === 0) return null

  return (
    <ul className='relative space-y-1 pl-6 border-border border-l-2'>
      {items.map((item) => {
        const hasChildren = (item.children?.length ?? 0) > 0
        const isExpanded = expandedItems.has(item.id)

        return (
          <li key={item.id}>
            <div className='relative'>
              {/* Elbow connecting this row to the sibling-group's spine */}
              <span className='top-1/2 -left-6 absolute border-border border-t-2 w-6 h-px -translate-y-1/2' />
              <MenuItemRow
                item={item}
                level={level}
                hasChildren={hasChildren}
                isExpanded={isExpanded}
                onToggleExpand={() => onToggleExpand(item.id)}
                onAddChild={() => onAddChild(item.id)}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item.id)}
                onTogglePublished={() => onTogglePublished(item)}
              />
            </div>

            <AnimatePresence initial={false}>
              {hasChildren && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className='overflow-hidden'
                >
                  <div className='mt-1'>
                    <MenuItemTree
                      items={item.children!}
                      level={level + 1}
                      expandedItems={expandedItems}
                      onToggleExpand={onToggleExpand}
                      onAddChild={onAddChild}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onTogglePublished={onTogglePublished}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

interface MenuItemsBuilderProps {
  groupId: string
  groupSlug?: string
  items: MenuItem[]
  refetch?: () => Promise<void>
  isSheetOpen?: boolean
  setIsSheetOpen?: (open: boolean) => void
}

export function MenuItemsBuilder({
  items,
  groupId,
  groupSlug,
  refetch,
  isSheetOpen: externalIsSheetOpen,
  setIsSheetOpen: externalSetIsSheetOpen
}: MenuItemsBuilderProps) {
  // The public site tags its menu fetches by the menu's own slug (see
  // src/app/(front)/layout.tsx) - reuse that same value here so revalidation
  // always targets the right cache regardless of which menu group this is.
  const cacheTag = groupSlug
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // editor drawer state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [internalIsSheetOpen, setInternalIsSheetOpen] = useState(false)
  const [parentItemId, setParentItemId] = useState<string | undefined>(undefined)

  // Use external state if provided, otherwise use internal
  const isSheetOpen = externalIsSheetOpen ?? internalIsSheetOpen
  const setIsSheetOpen = externalSetIsSheetOpen ?? setInternalIsSheetOpen

  // Confirmation modal for delete action
  const deleteModal = useConfirmationModal({
    title: 'Delete Menu Item',
    description:
      'Are you sure you want to delete this menu item? This will also delete all child items. This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
    icon: Trash2
  })

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const closeEditor = () => {
    setIsSheetOpen(false)
    setEditingItem(null)
    setParentItemId(undefined)
  }

  const openEditor = (item: MenuItem) => {
    setEditingItem(item)
    setParentItemId(undefined)
    setIsSheetOpen(true)
  }

  const openAddItemForm = (parentId?: string) => {
    setEditingItem(null)
    setParentItemId(parentId)
    setIsSheetOpen(true)
  }

  const addItem = async (parentId: string | undefined, itemData: Partial<MenuItem>) => {
    if (!groupId) {
      toast.error('Menu group not found')
      return
    }

    try {
      await menuService.addMenuItem(groupId, {
        ...itemData,
        parentId: parentId || null
      } as CreateMenuItemPayload)
      if (cacheTag) await revalidateTags(cacheTag)
      toast.success('Menu item added')
      await refetch?.()
      closeEditor()
    } catch (err) {
      console.error('Failed to add menu item', err)
      toast.error('Failed to add menu item')
    }
  }

  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      if (groupId) {
        await menuService.updateMenuItem(groupId, id, updates as UpdateMenuItemPayload)
        if (cacheTag) await revalidateTags(cacheTag)
      }
      await refetch?.()
      toast.success('Menu item updated')
      closeEditor()
    } catch (err) {
      console.error('Failed to update menu item', err)
      toast.error('Failed to update menu item')
    }
  }

  const handleFormSave = async (updates: Partial<MenuItem>) => {
    if (editingItem) {
      await updateItem(editingItem.id, updates)
    } else {
      await addItem(parentItemId, updates)
    }
  }

  const deleteItem = (id: string) => {
    deleteModal.openModal(async () => {
      try {
        if (groupId) {
          await menuService.deleteMenuItem(groupId, id)
          if (cacheTag) await revalidateTags(cacheTag)
        }
        toast.success('Menu item deleted')
      } catch (err) {
        console.error('Failed to delete menu item', err)
        toast.error('Failed to delete menu item')
        throw err // Re-throw to prevent modal from closing on error
      } finally {
        refetch?.()
      }
    })
  }

  const togglePublished = async (item: MenuItem) => {
    try {
      if (groupId) {
        await menuService.updateMenuItem(groupId, item.id, {
          isPublished: !item.isPublished
        } as UpdateMenuItemPayload)
        if (cacheTag) await revalidateTags(cacheTag)
      }
      await refetch?.()
      toast.success(`Menu item ${item.isPublished ? 'unpublished' : 'published'}`)
    } catch (err) {
      console.error('Failed to update menu item status', err)
      toast.error('Failed to update menu item status')
    }
  }

  return (
    <div className='space-y-4'>
      {/* Delete Confirmation Modal */}
      <deleteModal.ModalComponent />

      {/* Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className='lg:min-w-lg'>
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <div className='px-4 pb-8 overflow-y-auto'>
            <MenuItemForm item={editingItem} onSave={handleFormSave} onCancel={closeEditor} />
          </div>
        </SheetContent>
      </Sheet>

      {items.length === 0 ? (
        <div className='flex flex-col justify-center items-center p-12 border border-dashed rounded-lg text-center'>
          <LinkIcon className='mb-4 w-12 h-12 text-muted-foreground' />
          <h3 className='mb-2 font-semibold text-lg'>No menu items yet</h3>
          <p className='mb-4 text-muted-foreground text-sm'>
            Start building your menu by adding your first item.
          </p>
          <Button type='button' onClick={() => openAddItemForm()}>
            <Plus className='mr-2 w-4 h-4' />
            Add First Item
          </Button>
        </div>
      ) : (
        <MenuItemTree
          items={items}
          level={0}
          expandedItems={expandedItems}
          onToggleExpand={toggleExpand}
          onAddChild={openAddItemForm}
          onEdit={openEditor}
          onDelete={deleteItem}
          onTogglePublished={togglePublished}
        />
      )}
    </div>
  )
}

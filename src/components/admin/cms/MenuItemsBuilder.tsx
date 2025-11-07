'use client'

/**
 * Menu Items Builder
 * Drag-and-drop interface for managing nested menu items
 */

import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderOpen,
  Link as LinkIcon,
  Plus,
  Trash2
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'
import { cn } from '@/lib/utils'
import { menuService } from '@/services/api/cms.service'
import type { MenuItem, MenuItemType } from '@/types/cms'
import MenuItemForm from './MenuItemForm'

interface MenuItemsBuilderProps {
  groupId: string
  items: MenuItem[]
  refetch?: () => Promise<void>
  isSheetOpen?: boolean
  setIsSheetOpen?: (open: boolean) => void
}

export function MenuItemsBuilder({ items, groupId, refetch, isSheetOpen: externalIsSheetOpen, setIsSheetOpen: externalSetIsSheetOpen }: MenuItemsBuilderProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // editor drawer state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [internalIsSheetOpen, setInternalIsSheetOpen] = useState(false)
  const [parentItemId, setParentItemId] = useState<string | undefined>(undefined)

  // Use external state if provided, otherwise use internal
  const isSheetOpen = externalIsSheetOpen !== undefined ? externalIsSheetOpen : internalIsSheetOpen
  const setIsSheetOpen = externalSetIsSheetOpen || setInternalIsSheetOpen

  // maintain a local copy of items so we can optimistically update UI
  const [localItems, setLocalItems] = useState<MenuItem[]>(items)

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

  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
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
    try {
      if (!groupId) {
        toast.error('Menu group not found')
        return
      }

      const payload = { ...itemData, parentId: parentId || null }
      await menuService.addMenuItem(groupId, payload as any)

      toast.success('Menu item added')
      await refetch?.()
      setIsSheetOpen(false)
      setEditingItem(null)
      setParentItemId(undefined)
    } catch (err) {
      console.error('Failed to add menu item', err)
      toast.error('Failed to add menu item')
    }
  }

  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      if (groupId) {
        await menuService.updateMenuItem(groupId, id, updates as any)
      }
      await refetch?.()
      toast.success('Menu item updated')
      setIsSheetOpen(false)
      setEditingItem(null)
      setParentItemId(undefined)
    } catch (err) {
      console.error('Failed to update menu item', err)
      toast.error('Failed to update menu item')
    }
  }

  const handleFormSave = async (updates: Partial<MenuItem>) => {
    if (editingItem) {
      // Edit existing item
      await updateItem(editingItem.id, updates)
    } else {
      // Add new item
      await addItem(parentItemId, updates)
    }
  }

  const deleteItem = async (id: string) => {
    deleteModal.openModal(async () => {
      try {
        if (groupId) {
          await menuService.deleteMenuItem(groupId, id)
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

  const togglePublished = async (item: MenuItem, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus
      if (groupId) {
        await menuService.updateMenuItem(groupId, item.id, { isPublished: newStatus } as any)
      }

      refetch?.()
      toast.success(`Menu item ${newStatus ? 'published' : 'unpublished'}`)
    } catch (err) {
      console.error('Failed to update menu item status', err)
      toast.error('Failed to update menu item status')
    }
  }

  const getMenuItemIcon = (type: MenuItemType) => {
    switch (type) {
      case 'custom-link':
        return <LinkIcon className='w-4 h-4' />
      case 'custom-page':
        return <FileText className='w-4 h-4' />
      case 'category-blogs':
        return <FolderOpen className='w-4 h-4' />
      case 'article':
        return <FileText className='w-4 h-4' />
      default:
        return <LinkIcon className='w-4 h-4' />
    }
  }

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id)
    const hasChildren = item.children?.length > 0

    return (
      <div key={item.id} className='space-y-1'>
        {/* Menu Item Row */}
        <div
          className={cn(
            'group flex items-center gap-4 bg-background p-3 border rounded-lg transition-colors',
            level > 0 && 'ml-8'
          )}
        >
          {/* Expand/Collapse */}
          {hasChildren && (
            <button
              type='button'
              onClick={() => toggleExpand(item.id)}
              className='text-muted-foreground hover:text-foreground'
            >
              {isExpanded ? (
                <ChevronDown className='w-4 h-4' />
              ) : (
                <ChevronRight className='w-4 h-4' />
              )}
            </button>
          )}

          {/* Icon */}
          <div className='text-muted-foreground'>{getMenuItemIcon(item.type)}</div>

          {/* Content */}
          <div className='flex-1'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>{item.title}</span>
                <Badge variant='secondary' className='text-xs'>
                  {item.type.replace('-', ' ')}
                </Badge>
                {item.target === '_blank' && <ExternalLink className='w-3 h-3' />}
              </div>
              <p className='text-muted-foreground text-xs'>
                {item.link || item.pageId || item.categoryId || item.articleId}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity'>
            {/* Published Toggle */}
            <Switch
              checked={(item as any).isPublished || false}
              onCheckedChange={() => togglePublished(item, (item as any).isPublished || false)}
              onClick={(e) => e.stopPropagation()}
            />

            <div className='bg-border w-px h-4' />

            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => openAddItemForm(item.id)}
              title='Add child item'
            >
              <Plus className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => openEditor(item)}
              title='Edit'
            >
              <FileText className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={(e) => {
                e.stopPropagation()
                deleteItem(item.id)
              }}
              title='Delete'
              className='text-destructive hover:text-destructive'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className='space-y-1'>
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Delete Confirmation Modal */}
      <deleteModal.ModalComponent />

      {/* Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <div className="px-4 pb-8 overflow-y-auto">
            <MenuItemForm
              item={editingItem}
              onSave={handleFormSave}
              onCancel={() => {
                setEditingItem(null)
                setParentItemId(undefined)
                setIsSheetOpen(false)
              }}
            />
          </div>
        </SheetContent>
      </Sheet>


      {localItems?.length === 0 ? (
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
        <div className='space-y-2'>{localItems.map((item) => renderMenuItem(item))}</div>
      )}
    </div>
  )
}

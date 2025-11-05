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

import { Typography } from '@/components/common/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'
import { cn } from '@/lib/utils'
import { generateId, menuService } from '@/services/api/cms.service'
import type { MenuItem, MenuItemType } from '@/types/cms'
import MenuItemForm from './MenuItemForm'

interface MenuItemsBuilderProps {
  groupId: string
  items: MenuItem[]
}

export function MenuItemsBuilder({ items, groupId }: MenuItemsBuilderProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // editor drawer state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

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
    setIsSheetOpen(true)
  }

  const addItem = async (parentId?: string) => {
    const newItem: MenuItem = {
      id: generateId(),
      title: 'New Menu Item',
      type: 'custom-link',
      link: '/',
      order: 0,
      children: []
    }

    // Persist to backend when groupId is available
    if (groupId) {
      try {
        const payload = { ...newItem, parentId: parentId || null }
        const res = await menuService.addMenuItem(groupId, payload as any)
        const created: MenuItem = res.data

        if (parentId) {
          setLocalItems((prev) => addChildRecursive(prev, parentId, created))
        } else {
          setLocalItems((prev) => [...prev, created])
        }

        openEditor(created)
        toast.success('Menu item added')
      } catch (err) {
        console.error('Failed to add menu item', err)
        toast.error('Failed to add menu item')
      }
      return
    }

    // Local-only fallback
    const created = newItem
    if (parentId) {
      setLocalItems((prev) => addChildRecursive(prev, parentId, created))
    } else {
      setLocalItems((prev) => [...prev, created])
    }
    openEditor(created)
  }

  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      if (groupId) {
        // prefer the explicit updateMenuItem(menuId, itemId, payload)
        await menuService.updateMenuItem(groupId, id, updates as any)
      }

      setLocalItems((prev) => updateItemRecursive(prev, id, updates))
      toast.success('Menu item updated')
      // close sheet after save
      setIsSheetOpen(false)
      setEditingItem(null)
    } catch (err) {
      console.error('Failed to update menu item', err)
      toast.error('Failed to update menu item')
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
      }
    })
  }

  // recursive helpers
  const addChildRecursive = (items: MenuItem[], parentId: string, child: MenuItem): MenuItem[] => {
    return items.map((it) => {
      if (it.id === parentId) return { ...it, children: [...(it.children || []), child] }
      if (it.children && it.children?.length > 0)
        return { ...it, children: addChildRecursive(it.children, parentId, child) }
      return it
    })
  }

  const updateItemRecursive = (
    items: MenuItem[],
    id: string,
    updates: Partial<MenuItem>
  ): MenuItem[] => {
    return items.map((item) => {
      if (item.id === id) return { ...item, ...updates }
      if (item.children && item.children?.length > 0)
        return { ...item, children: updateItemRecursive(item.children, id, updates) }
      return item
    })
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
          <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => setIsSheetOpen(true)}
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
                console.log('[Button] Delete button clicked for item:', item.id)
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
            <SheetTitle>Edit Menu Item</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <MenuItemForm
            item={editingItem}
            onSave={(updates) => editingItem && updateItem(editingItem.id, updates)}
            onCancel={() => {
              setEditingItem(null)
              setIsSheetOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>

      <div className='flex justify-between items-center'>
        <div>
          <Typography variant={'h6'}>Menu Items</Typography>
          <Typography variant={'body2'} className='text-muted-foreground'>
            Add and organize menu items. You can nest items by adding child items.
          </Typography>
        </div>
        <Button type='button' onClick={() => setIsSheetOpen(true)}>
          <Plus className='mr-2 w-4 h-4' />
          Add Item
        </Button>
      </div>

      {localItems?.length === 0 ? (
        <div className='flex flex-col justify-center items-center p-12 border border-dashed rounded-lg text-center'>
          <LinkIcon className='mb-4 w-12 h-12 text-muted-foreground' />
          <h3 className='mb-2 font-semibold text-lg'>No menu items yet</h3>
          <p className='mb-4 text-muted-foreground text-sm'>
            Start building your menu by adding your first item.
          </p>
          <Button type='button' onClick={() => setIsSheetOpen(true)}>
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

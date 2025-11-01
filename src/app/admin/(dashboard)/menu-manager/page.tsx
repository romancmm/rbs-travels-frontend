'use client'

import { Copy, Eye, Menu as MenuIcon, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Suspense, useState } from 'react'

import { MenuEditorSheet } from '@/components/admin/cms/MenuEditorSheet'
import { MenuFormDialog } from '@/components/admin/cms/MenuFormDialog'
import PageHeader from '@/components/common/PageHeader'
import { AddButton } from '@/components/common/PermissionGate'
import { CMSEmptyState, CMSListSkeleton, CMSStatusBadge } from '@/components/common/cms'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useAsync from '@/hooks/useAsync'
import { useFilter } from '@/hooks/useFilter'
import { menuService } from '@/services/api/cms.service'
import { Menu } from '@/types/cms'

function MenuList() {
  const { page, limit } = useFilter(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)

  const { data, loading, mutate } = useAsync<{
    data: {
      items: Menu[]
      pagination: any
    }
  }>(() => {
    const url = '/admin/menu' + (page ? `?page=${page}` : '') + (limit ? `&limit=${limit}` : '')
    return url
  })

  const handleCreate = () => {
    setSelectedMenu(null)
    setIsDialogOpen(true)
  }

  const handleEditBasic = (menu: Menu) => {
    setSelectedMenu(menu)
    setIsDialogOpen(true)
  }

  const handleEditItems = (menu: Menu) => {
    setSelectedMenu(menu)
    setIsEditorOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return

    try {
      await menuService.deleteMenu(id)
      mutate()
    } catch (error) {
      console.error('Failed to delete menu:', error)
    }
  }

  const handleStatusToggle = async (menu: Menu) => {
    try {
      if (menu.isPublished) {
        await menuService.unpublishMenu(menu.id)
      } else {
        await menuService.publishMenu(menu.id)
      }
      mutate()
    } catch (error) {
      console.error('Failed to update menu status:', error)
    }
  }

  if (loading) {
    return (
      <div className='w-full max-w-full overflow-x-hidden'>
        <PageHeader
          title='Menu Manager'
          subTitle='Create and manage navigation menus for your website'
          extra={<AddButton resource='menu' onClick={handleCreate} />}
        />
        <div className='mt-6'>
          <CMSListSkeleton rows={5} />
        </div>
      </div>
    )
  }

  const menus = data?.data?.items || []

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      {/* Header */}
      <PageHeader
        title='Menu Manager'
        subTitle='Create and manage navigation menus for your website'
        extra={<AddButton resource='menu' onClick={handleCreate} />}
      />

      {/* Body */}
      <div className='mt-6'>
        {menus.length === 0 ? (
          <CMSEmptyState
            icon={MenuIcon}
            title='No menus created yet'
            description='Get started by creating your first navigation menu. You can create menus for header, footer, sidebar, and more.'
            actionLabel='Create First Menu'
            onAction={handleCreate}
          />
        ) : (
          <div className='space-y-4'>
            {menus.map((menu) => (
              <div
                key={menu.id}
                className='p-4 border hover:border-primary/50 rounded-lg transition-colors'
              >
                <div className='flex justify-between items-start'>
                  {/* Menu Info */}
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h3 className='font-semibold text-lg'>{menu.name}</h3>
                      <CMSStatusBadge status={menu.isPublished ? 'published' : 'draft'} />
                      <Badge variant='outline' className='capitalize'>
                        {menu.position}
                      </Badge>
                    </div>
                    <p className='mb-2 text-muted-foreground text-sm'>
                      Slug: <code className='bg-muted px-1.5 py-0.5 rounded'>{menu.slug}</code>
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {menu.items.length} menu item{menu.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEditItems(menu)}
                    >
                      <Pencil className='mr-2 w-4 h-4' />
                      Edit Items
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEditBasic(menu)}>
                          <Pencil className='mr-2 w-4 h-4' />
                          Edit Menu Info
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditItems(menu)}>
                          <Pencil className='mr-2 w-4 h-4' />
                          Manage Items
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className='mr-2 w-4 h-4' />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className='mr-2 w-4 h-4' />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusToggle(menu)}>
                          {menu.isPublished ? 'Unpublish' : 'Publish'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => handleDelete(menu.id)}
                        >
                          <Trash2 className='mr-2 w-4 h-4' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <MenuFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        menu={selectedMenu}
        onSuccess={mutate}
      />

      <MenuEditorSheet
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        menuId={selectedMenu?.id || null}
        onSuccess={mutate}
      />
    </div>
  )
}

export default function MenuManagerPage() {
  return (
    <Suspense fallback={<CMSListSkeleton />}>
      <MenuList />
    </Suspense>
  )
}

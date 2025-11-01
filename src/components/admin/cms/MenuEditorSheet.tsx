'use client'

/**
 * Menu Editor Sheet
 * Full-screen drawer for editing menu and its items
 */

import { Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { cleanMenuItems, menuService } from '@/services/api/cms.service'
import type { Menu, MenuItem } from '@/types/cms'
import { toast } from 'sonner'
import { MenuItemsBuilder } from './MenuItemsBuilder'

interface MenuEditorSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    menuId: string | null
    onSuccess: () => void
}

export function MenuEditorSheet({ open, onOpenChange, menuId, onSuccess }: MenuEditorSheetProps) {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [menu, setMenu] = useState<Menu | null>(null)
    const [items, setItems] = useState<MenuItem[]>([])

    // Fetch menu data
    useEffect(() => {
        if (!menuId || !open) {
            setMenu(null)
            setItems([])
            return
        }

        const fetchMenu = async () => {
            setLoading(true)
            try {
                const response = await menuService.getMenuById(menuId)
                setMenu(response.data)
                setItems(response.data.items || [])
            } catch (error) {
                console.error('Failed to fetch menu:', error)
                toast.error('Failed to load menu')
                onOpenChange(false)
            } finally {
                setLoading(false)
            }
        }

        fetchMenu()
    }, [menuId, open, onOpenChange])

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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side='right' className='flex flex-col p-0 w-full sm:max-w-3xl'>
                {/* Header */}
                <SheetHeader className='px-6 py-4 border-b'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <SheetTitle className='text-xl'>
                                {menu?.name || 'Edit Menu'}
                            </SheetTitle>
                            <SheetDescription>
                                Manage menu items and their hierarchy
                            </SheetDescription>
                        </div>
                        {/* <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                        >
                            <X className='w-5 h-5' />
                        </Button> */}
                    </div>
                </SheetHeader>

                {/* Content */}
                <div className='flex-1 px-6 py-6 overflow-y-auto'>
                    {loading ? (
                        <div className='flex justify-center items-center py-12'>
                            <div className='text-center'>
                                <Loader2 className='mx-auto w-8 h-8 text-primary animate-spin' />
                                <p className='mt-2 text-muted-foreground text-sm'>Loading menu...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Menu Info */}
                            {menu && (
                                <div className='bg-muted/50 mb-6 p-4 border rounded-lg'>
                                    <div className='gap-2 grid text-sm'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-muted-foreground'>Location:</span>
                                            <span className='font-medium capitalize'>{menu.position}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-muted-foreground'>Slug:</span>
                                            <code className='bg-background px-2 py-1 rounded text-xs'>
                                                {menu.slug}
                                            </code>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-muted-foreground'>Status:</span>
                                            <span className='font-medium capitalize'>{menu.isPublished ? 'Published' : 'Draft'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Separator className='my-6' />

                            {/* Menu Items Builder */}
                            <MenuItemsBuilder items={items} onChange={setItems} />
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className='px-6 py-4 border-t'>
                    <div className='flex justify-between items-center'>
                        <p className='text-muted-foreground text-sm'>
                            {items.length} menu item{items.length !== 1 ? 's' : ''}
                        </p>
                        <div className='flex gap-2'>
                            <Button
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving || loading}>
                                {saving && <Loader2 className='mr-2 w-4 h-4 animate-spin' />}
                                <Save className='mr-2 w-4 h-4' />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

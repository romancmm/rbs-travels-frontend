'use client'

import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { MenuItemsBuilder } from '@/components/admin/cms/MenuItemsBuilder'
import { Typography } from '@/components/common/typography'
import { Separator } from '@/components/ui/separator'
import { cleanMenuItems, menuService } from '@/services/api/cms.service'
import type { Menu, MenuItem } from '@/types/cms'

export default function MenuGroupPage() {
    const params = useParams()
    const router = useRouter()
    const groupSlug = params.groupSlug as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [menu, setMenu] = useState<Menu | null>(null)
    const [items, setItems] = useState<MenuItem[]>([])

    // Fetch menu data
    useEffect(() => {
        if (!groupSlug) return

        const fetchMenu = async () => {
            setLoading(true)
            try {
                const response = await menuService.getMenuBySlug(groupSlug)
                setMenu(response.data)
                setItems(response.data.items || [])
            } catch (error) {
                console.error('Failed to fetch menu:', error)
                toast.error('Failed to load menu')
                router.push('/admin/menu-manager')
            } finally {
                setLoading(false)
            }
        }

        fetchMenu()
    }, [groupSlug, router])

    const handleSave = async () => {
        if (!menu) return

        setSaving(true)
        try {
            // Clean menu items before sending to backend
            const cleanedItems = cleanMenuItems(items)
            await menuService.updateMenu(menu.id, { items: cleanedItems })
            toast.success('Menu items updated successfully')
            router.push('/admin/menu-manager')
        } catch (error: any) {
            console.error('Failed to update menu items:', error)
            toast.error(error?.response?.data?.message || 'Failed to save menu items')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='text-center'>
                    <Loader2 className='mx-auto w-8 h-8 text-primary animate-spin' />
                    <p className='mt-2 text-muted-foreground text-sm'>Loading menu...</p>
                </div>
            </div>
        )
    }

    if (!menu) {
        return null
    }

    return (
        <div className='flex-1 gap-5 grid grid-cols-none lg:grid-cols-4 py-6 overflow-y-auto'>
            {/* Sidebar: Menu Info */}
            <div className='bg-white p-4 border rounded-lg'>
                <div>
                    <Typography variant='h6' weight={'semibold'}>{menu.name}</Typography>
                    <Typography variant='body2' className='text-muted-foreground'>
                        Manage menu items and their hierarchy
                    </Typography>
                </div>

                <Separator className='my-6' />

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
                        <span className='font-medium capitalize'>
                            {menu.isPublished ? 'Published' : 'Draft'}
                        </span>
                    </div>
                </div>
            </div>


            {/* Menu Items Builder */}
            <div className="lg:col-span-3">
                <MenuItemsBuilder items={items} onChange={setItems} />
            </div>
        </div>
    )
}

'use client'

import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { MenuItemsBuilder } from '@/components/admin/cms/MenuItemsBuilder'
import { Typography } from '@/components/common/typography'
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
        <div className='flex-1 gap-6 grid grid-cols-none lg:grid-cols-4 py-6 overflow-y-auto'>
            {/* Sidebar: Menu Info */}
            <div className='space-y-4'>
                {/* Main Info Card */}
                <div className='bg-white border rounded-2xl overflow-hidden shadow-lg'>
                    <div className='bg-slate-50 px-6 py-5 border-b'>
                        <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                                <Typography variant='h6' weight={'semibold'} className='text-slate-900'>
                                    {menu.name}
                                </Typography>
                                <Typography variant='body2' className='mt-1.5 text-slate-500'>
                                    Menu Configuration
                                </Typography>
                            </div>
                            <span
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                    menu.isPublished
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-orange-100 text-orange-700'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                    menu.isPublished ? 'bg-emerald-500' : 'bg-orange-500'
                                }`} />
                                {menu.isPublished ? 'Live' : 'Draft'}
                            </span>
                        </div>
                    </div>

                    <div className='p-6 space-y-4'>
                        {/* Location */}
                        <div className='flex items-center justify-between py-3 border-b border-slate-100'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                    <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                    </svg>
                                </div>
                                <div>
                                    <p className='text-xs text-slate-500 font-medium'>Location</p>
                                    <p className='text-sm font-semibold text-slate-900 capitalize mt-0.5'>{menu.position}</p>
                                </div>
                            </div>
                        </div>

                        {/* Slug */}
                        <div className='flex items-center justify-between py-3 border-b border-slate-100'>
                            <div className='flex items-center gap-3 flex-1 min-w-0'>
                                <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0'>
                                    <svg className='w-4 h-4 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' />
                                    </svg>
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <p className='text-xs text-slate-500 font-medium'>Slug</p>
                                    <code className='text-xs font-mono text-slate-700 mt-0.5 block truncate'>{menu.slug}</code>
                                </div>
                            </div>
                        </div>

                        {/* Total Items */}
                        <div className='flex items-center justify-between py-3'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center'>
                                    <svg className='w-4 h-4 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 10h16M4 14h16M4 18h16' />
                                    </svg>
                                </div>
                                <div>
                                    <p className='text-xs text-slate-500 font-medium'>Total Items</p>
                                    <p className='text-sm font-semibold text-slate-900 mt-0.5'>{items.length} items</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className='bg-slate-50 border border-slate-200 rounded-2xl p-5'>
                    <h4 className='text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3'>Quick Actions</h4>
                    <div className='space-y-2'>
                        <button className='w-full flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-left'>
                            <svg className='w-4 h-4 text-slate-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                            </svg>
                            <span className='text-sm font-medium text-slate-700'>Add Item</span>
                        </button>
                        <button className='w-full flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-left'>
                            <svg className='w-4 h-4 text-slate-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                            </svg>
                            <span className='text-sm font-medium text-slate-700'>Bulk Edit</span>
                        </button>
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

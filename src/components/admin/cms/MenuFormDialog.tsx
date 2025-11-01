'use client'

/**
 * Menu Form Dialog
 * Create and edit menu basic information
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { generateSlug, menuService } from '@/services/api/cms.service'
import type { Menu } from '@/types/cms'
import { toast } from 'sonner'

const menuSchema = z.object({
    name: z.string().min(1, 'Menu name is required').max(100),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
    position: z.enum(['header', 'footer', 'sidebar', 'custom']),
    isPublished: z.boolean(),
})

type MenuFormData = z.infer<typeof menuSchema>

interface MenuFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    menu?: Menu | null
    onSuccess: () => void
}

export function MenuFormDialog({ open, onOpenChange, menu, onSuccess }: MenuFormDialogProps) {
    const [loading, setLoading] = useState(false)
    const isEdit = !!menu

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<MenuFormData>({
        resolver: zodResolver(menuSchema),
        defaultValues: {
            name: '',
            slug: '',
            position: 'header',
            isPublished: false,
        },
    })

    const nameValue = watch('name')
    const slugValue = watch('slug')

    // Auto-generate slug from name
    useEffect(() => {
        if (!isEdit && nameValue && !slugValue) {
            setValue('slug', generateSlug(nameValue))
        }
    }, [nameValue, slugValue, isEdit, setValue])

    // Load menu data for editing
    useEffect(() => {
        if (menu) {
            reset({
                name: menu.name,
                slug: menu.slug,
                position: menu.position,
                isPublished: menu.isPublished,
            })
        } else {
            reset({
                name: '',
                slug: '',
                position: 'header',
                isPublished: false,
            })
        }
    }, [menu, reset])

    const onSubmit = async (data: MenuFormData) => {
        setLoading(true)

        try {
            if (isEdit) {
                await menuService.updateMenu(menu.id, data)
                toast.success('Menu updated successfully')
            } else {
                await menuService.createMenu(data)
                toast.success('Menu created successfully')
            }

            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            console.error('Failed to save menu:', error)
            toast.error(error?.response?.data?.message || 'Failed to save menu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Menu' : 'Create New Menu'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update menu basic information. You can manage menu items after saving.'
                            : 'Create a new navigation menu. You can add menu items after creation.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    {/* Menu Name */}
                    <div className='space-y-2'>
                        <Label htmlFor='name'>
                            Menu Name <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                            id='name'
                            placeholder='e.g., Main Menu, Footer Links'
                            {...register('name')}
                            disabled={loading}
                        />
                        {errors.name && <p className='text-destructive text-sm'>{errors.name.message}</p>}
                    </div>

                    {/* Slug */}
                    <div className='space-y-2'>
                        <Label htmlFor='slug'>
                            Slug <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                            id='slug'
                            placeholder='e.g., main-menu, footer-links'
                            {...register('slug')}
                            disabled={loading}
                        />
                        <p className='text-muted-foreground text-xs'>
                            URL-friendly identifier (lowercase, hyphens only)
                        </p>
                        {errors.slug && <p className='text-destructive text-sm'>{errors.slug.message}</p>}
                    </div>

                    {/* Position */}
                    <div className='space-y-2'>
                        <Label htmlFor='position'>
                            Position <span className='text-destructive'>*</span>
                        </Label>
                        <Select
                            value={watch('position')}
                            onValueChange={(value) => setValue('position', value as 'header' | 'footer' | 'sidebar' | 'custom')}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select menu position' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='header'>Header Menu</SelectItem>
                                <SelectItem value='footer'>Footer Menu</SelectItem>
                                <SelectItem value='sidebar'>Sidebar Menu</SelectItem>
                                <SelectItem value='custom'>Custom Menu</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.position && (
                            <p className='text-destructive text-sm'>{errors.position.message}</p>
                        )}
                    </div>

                    {/* Published Status */}
                    <div className='flex items-center space-x-2'>
                        <input
                            type='checkbox'
                            id='isPublished'
                            {...register('isPublished')}
                            disabled={loading}
                            className='border-gray-300 rounded w-4 h-4'
                        />
                        <Label htmlFor='isPublished' className='cursor-pointer'>
                            Publish immediately
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type='submit' disabled={loading}>
                            {loading && <Loader2 className='mr-2 w-4 h-4 animate-spin' />}
                            {isEdit ? 'Update Menu' : 'Create Menu'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

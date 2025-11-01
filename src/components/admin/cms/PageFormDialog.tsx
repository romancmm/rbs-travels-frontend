'use client'

/**
 * Page Form Dialog
 * Create and edit page basic information
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
import { Textarea } from '@/components/ui/textarea'
import { generateSlug, pageBuilderService } from '@/services/api/cms.service'
import type { PageLayout } from '@/types/cms'
import { toast } from 'sonner'

const pageSchema = z.object({
    title: z.string().min(1, 'Page title is required').max(200),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
    status: z.enum(['published', 'draft']),
    meta: z
        .object({
            description: z.string().optional(),
            keywords: z.string().optional(),
        })
        .optional(),
})

type PageFormData = z.infer<typeof pageSchema>

interface PageFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    page?: PageLayout | null
    onSuccess?: () => void
}

export function PageFormDialog({ open, onOpenChange, page, onSuccess }: PageFormDialogProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const isEdit = !!page

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<PageFormData>({
        resolver: zodResolver(pageSchema),
        defaultValues: {
            title: '',
            slug: '',
            status: 'draft',
            meta: {
                description: '',
                keywords: '',
            },
        },
    })

    const titleValue = watch('title')
    const slugValue = watch('slug')

    // Auto-generate slug from title
    useEffect(() => {
        if (!isEdit && titleValue && !slugValue) {
            setValue('slug', generateSlug(titleValue))
        }
    }, [titleValue, slugValue, isEdit, setValue])

    // Load page data for editing
    useEffect(() => {
        if (page) {
            reset({
                title: page.title,
                slug: page.slug,
                status: page.status,
                meta: {
                    description: page.meta?.description || '',
                    keywords: page.meta?.keywords || '',
                },
            })
        } else {
            reset({
                title: '',
                slug: '',
                status: 'draft',
                meta: {
                    description: '',
                    keywords: '',
                },
            })
        }
    }, [page, reset])

    const onSubmit = async (data: PageFormData) => {
        setLoading(true)

        try {
            if (isEdit) {
                await pageBuilderService.updatePage(page.id, data)
                toast.success('Page updated successfully')
                onSuccess?.()
            } else {
                const response = await pageBuilderService.createPage(data)
                toast.success('Page created successfully')
                onOpenChange(false)
                // Redirect to page builder editor
                router.push(`/admin/administration/page-builder/${response.data.id}`)
            }
        } catch (error: any) {
            console.error('Failed to save page:', error)
            toast.error(error?.response?.data?.message || 'Failed to save page')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[600px]'>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Page' : 'Create New Page'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update page basic information.'
                            : 'Create a new page. You can design the layout in the page builder after creation.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    {/* Page Title */}
                    <div className='space-y-2'>
                        <Label htmlFor='title'>
                            Page Title <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                            id='title'
                            placeholder='e.g., About Us, Contact Page'
                            {...register('title')}
                            disabled={loading}
                        />
                        {errors.title && <p className='text-destructive text-sm'>{errors.title.message}</p>}
                    </div>

                    {/* Slug */}
                    <div className='space-y-2'>
                        <Label htmlFor='slug'>
                            Slug <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                            id='slug'
                            placeholder='e.g., about-us, contact'
                            {...register('slug')}
                            disabled={loading}
                        />
                        <p className='text-muted-foreground text-xs'>
                            URL-friendly identifier (lowercase, hyphens only)
                        </p>
                        {errors.slug && <p className='text-destructive text-sm'>{errors.slug.message}</p>}
                    </div>

                    {/* SEO Meta Description */}
                    <div className='space-y-2'>
                        <Label htmlFor='description'>Meta Description</Label>
                        <Textarea
                            id='description'
                            placeholder='Brief description for SEO (recommended: 150-160 characters)'
                            {...register('meta.description')}
                            disabled={loading}
                            rows={3}
                        />
                        <p className='text-muted-foreground text-xs'>
                            This will appear in search engine results
                        </p>
                    </div>

                    {/* SEO Keywords */}
                    <div className='space-y-2'>
                        <Label htmlFor='keywords'>Meta Keywords</Label>
                        <Input
                            id='keywords'
                            placeholder='keyword1, keyword2, keyword3'
                            {...register('meta.keywords')}
                            disabled={loading}
                        />
                        <p className='text-muted-foreground text-xs'>Comma-separated keywords for SEO</p>
                    </div>

                    {/* Status */}
                    <div className='space-y-2'>
                        <Label htmlFor='status'>Status</Label>
                        <Select
                            value={watch('status')}
                            onValueChange={(value) => setValue('status', value as 'published' | 'draft')}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='draft'>Draft</SelectItem>
                                <SelectItem value='published'>Published</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className='text-destructive text-sm'>{errors.status.message}</p>}
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
                            {isEdit ? 'Update Page' : 'Create & Open Builder'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

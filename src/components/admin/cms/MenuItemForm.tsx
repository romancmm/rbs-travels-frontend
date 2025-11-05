import IconPickerModal from '@/components/admin/common/IconPickerModal'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import type { MenuItem } from '@/types/cms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

// Menu Item Editor Component — uses react-hook-form + zod (same concept as BlogCategory)
const MenuItemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['custom-link', 'custom-page', 'category-blogs', 'article']),
    link: z.string().optional(),
    pageId: z.string().optional(),
    categoryId: z.string().optional(),
    articleId: z.string().optional(),
    target: z.enum(['_self', '_blank']),
    icon: z.string().optional(),
})

type MenuItemFormType = z.infer<typeof MenuItemSchema>

interface MenuItemEditorProps {
    item?: MenuItem | null
    onSave: (updates: Partial<MenuItem>) => void
    onCancel: () => void
}

export default function MenuItemForm({ item, onSave, onCancel }: MenuItemEditorProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        watch
    } = useForm<MenuItemFormType>({
        resolver: zodResolver(MenuItemSchema),
        defaultValues: {
            title: item?.title || '',
            type: (item?.type || 'custom-link') as MenuItemFormType['type'],
            link: item?.link || '',
            pageId: item?.pageId || '',
            categoryId: item?.categoryId || '',
            articleId: item?.articleId || '',
            target: (item?.target as '_self' | '_blank') || '_self',
            icon: item?.icon || ''
        }
    })

    const watchType = watch('type')

    const onSubmit = (data: MenuItemFormType) => {
        // send only relevant fields (partial MenuItem)
        const payload: Partial<MenuItem> = {
            title: data.title,
            type: data.type,
            target: data.target,
            icon: data.icon || undefined,
        }

        if (data.type === 'custom-link') payload.link = data.link || undefined
        if (data.type === 'custom-page') payload.pageId = data.pageId || undefined
        if (data.type === 'category-blogs') payload.categoryId = data.categoryId || undefined
        if (data.type === 'article') payload.articleId = data.articleId || undefined

        onSave(payload)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3 bg-muted/50 p-4 border rounded-lg'>
            <div className='gap-3 grid sm:grid-cols-2'>
                <CustomInput
                    label='Title'
                    placeholder='Menu title'
                    required
                    size='small'
                    labelClassName='text-xs'
                    {...register('title')}
                    error={errors.title?.message}
                />

                <Controller
                    control={control}
                    name='type'
                    render={({ field }) => (
                        <CustomInput
                            label='Type'
                            name='type'
                            type='select'
                            value={field.value}
                            onValueChange={field.onChange}
                            options={[
                                { value: 'custom-link', label: 'Custom Link' },
                                { value: 'custom-page', label: 'Custom Page' },
                                { value: 'category-blogs', label: 'Category Blogs' },
                                { value: 'article', label: 'Article' }
                            ]}
                            size='small'
                            labelClassName='text-xs'
                        />
                    )}
                />

                {watchType === 'custom-link' && (
                    <CustomInput
                        label='URL'
                        placeholder='/about or https://...'
                        required
                        size='small'
                        labelClassName='text-xs'
                        {...register('link')}
                        error={errors.link?.message}
                    />
                )}

                {watchType === 'custom-page' && (
                    <CustomInput
                        label='Page Slug'
                        placeholder='about-us'
                        required
                        size='small'
                        labelClassName='text-xs'
                        {...register('pageId')}
                        error={errors.pageId?.message}
                    />
                )}

                {watchType === 'category-blogs' && (
                    <CustomInput
                        label='Category Slug'
                        placeholder='news'
                        required
                        size='small'
                        labelClassName='text-xs'
                        {...register('categoryId')}
                        error={errors.categoryId?.message}
                    />
                )}

                {watchType === 'article' && (
                    <CustomInput
                        label='Article Slug'
                        placeholder='my-article'
                        required
                        size='small'
                        labelClassName='text-xs'
                        {...register('articleId')}
                        error={errors.articleId?.message}
                    />
                )}

                <Controller
                    control={control}
                    name='target'
                    render={({ field }) => (
                        <CustomInput
                            label='Open In'
                            name='target'
                            type='select'
                            value={field.value}
                            onValueChange={field.onChange}
                            options={[{ value: '_self', label: 'Same Window' }, { value: '_blank', label: 'New Tab' }]}
                            size='small'
                            labelClassName='text-xs'
                        />
                    )}
                />

                <div className='space-y-1'>
                    <label className='font-medium text-xs'>Icon (optional)</label>
                    <Controller
                        control={control}
                        name='icon'
                        render={({ field }) => (
                            <IconPickerModal value={field.value as string} onChange={(val) => field.onChange(val)} />
                        )}
                    />
                </div>
            </div>

            <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' size='sm' onClick={onCancel}>
                    Cancel
                </Button>
                <Button type='submit' size='sm' disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    )
}

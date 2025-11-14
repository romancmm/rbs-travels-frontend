import IconPickerModal from '@/components/admin/common/IconPickerModal'
import CustomInput from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import { Button } from '@/components/ui/button'
import type { MenuItem } from '@/types/cms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

// Menu Item Editor Component — uses react-hook-form + zod (same concept as BlogCategory)
const MenuItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['custom-link', 'custom-page', 'category-blogs', 'article', 'gallery']),
  link: z.string().optional(),
  pageId: z.string().optional(),
  categoryId: z.string().optional(),
  articleId: z.string().optional(),
  target: z.enum(['_self', '_blank']),
  icon: z.string().optional(),
  cssClass: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
  meta: z.record(z.string(), z.any()).optional()
})

type MenuItemFormType = z.infer<typeof MenuItemSchema>

interface MenuItemEditorProps {
  item?: MenuItem | null
  onSave: (updates: Partial<MenuItem>) => void
  onCancel: () => void
}

export default function MenuItemForm({ item, onSave, onCancel }: MenuItemEditorProps) {
  const {
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
      icon: item?.icon || '',
      cssClass: (item as any)?.cssClass || '',
      order: (item as any)?.order || 0,
      isPublished: (item as any)?.isPublished ?? true,
      meta: (item as any)?.meta || {}
    }
  })
  const watchType = watch('type')

  const onSubmit = (data: MenuItemFormType) => {
    // send only relevant fields (partial MenuItem)
    const payload: Partial<MenuItem> = {
      title: data.title,
      type: data.type,
      target: data.target,
      link: data.link || '',
      icon: data.icon || undefined,
      cssClass: data.cssClass || undefined,
      order: data.order ?? 0,
      isPublished: data.isPublished ?? true,
      meta: data.meta || {}
    }

    if (data.type === 'custom-link') payload.link = data.link || undefined
    if (data.type === 'custom-page') payload.pageId = data.pageId || undefined
    if (data.type === 'category-blogs') payload.categoryId = data.categoryId || undefined
    if (data.type === 'article') payload.articleId = data.articleId || undefined

    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* Basic Information */}
      <div className='flex flex-wrap *:flex-1 gap-3 *:min-w-[95%]'>
        <Controller
          control={control}
          name='title'
          render={({ field }) => (
            <CustomInput
              label='Title'
              placeholder='Menu title'
              error={errors.title?.message}
              {...field}
            />
          )}
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
                { value: 'article', label: 'Article' },
                { value: 'gallery', label: 'Gallery' }
              ]}
            />
          )}
        />

        {watchType === 'custom-link' && (
          <Controller
            control={control}
            name='link'
            render={({ field }) => (
              <CustomInput
                label='URL'
                placeholder='/about or https://...'
                error={errors.link?.message}
                {...field}
              />
            )}
          />
        )}

        {watchType === 'gallery' && (
          <Controller
            control={control}
            name='link'
            render={({ field }) => (
              <CustomInput
                label='Gallery Folder Name'
                placeholder='vacation-photos'
                error={errors.link?.message}
                helperText='Enter the folder name from /gallery/ directory (e.g., "vacation-photos" for /gallery/vacation-photos)'
                {...field}
              />
            )}
          />
        )}

        {watchType === 'custom-page' && (
          <Controller
            control={control}
            name='pageId'
            render={({ field }) => (
              <CustomSelect
                label='Page Slug'
                placeholder='about-us'
                value={field.value}
                url='/admin/pages'
                options={(data) =>
                  data?.data?.items?.map((item: any) => ({
                    value: item.id,
                    label: item.title
                  }))
                }
                onChange={field.onChange}
              />
            )}
          />
        )}

        {watchType === 'category-blogs' && (
          <Controller
            control={control}
            name='categoryId'
            render={({ field }) => (
              <CustomInput
                label='Category Slug'
                placeholder='news'
                error={errors.categoryId?.message}
                {...field}
              />
            )}
          />
        )}

        {watchType === 'article' && (
          <Controller
            control={control}
            name='articleId'
            render={({ field }) => (
              <CustomInput
                label='Article Slug'
                placeholder='my-article'
                error={errors.articleId?.message}
                {...field}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name='cssClass'
          render={({ field }) => (
            <CustomInput
              label='CSS Class (optional)'
              placeholder='custom-class'
              error={errors.cssClass?.message}
              {...field}
            />
          )}
        />

        <div className="flex flex-wrap *:flex-1 gap-4 w-full">
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
                options={[
                  { value: '_self', label: 'Same Window' },
                  { value: '_blank', label: 'New Tab' }
                ]}
              />
            )}
          />
          <Controller
            control={control}
            name='order'
            render={({ field }) => (
              <CustomInput
                label='Order'
                placeholder='0'
                type='number'
                error={errors.order?.message}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </div>





        <Controller
          control={control}
          name='icon'
          render={({ field }) => (
            <div className='space-y-2'>
              <label className='font-medium text-sm'>Icon (optional)</label>
              <IconPickerModal
                value={field.value as string}
                onChange={(val) => field.onChange(val)}
              />
            </div>
          )}
        />

        {/* Status */}
        <div className='flex flex-col gap-2'>
          <Controller
            control={control}
            name='isPublished'
            render={({ field }) => (
              <div className='flex flex-col gap-2'>
                <label className='font-medium text-sm'>Status</label>

                <CustomInput
                  type='switch'
                  label={`${field.value ? 'Published' : 'Unpublished'}`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </div>
      </div>




      {/* Form Actions */}
      <div className='flex gap-3 pt-4'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

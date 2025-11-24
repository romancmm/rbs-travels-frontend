import CustomInput from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import FileUploader from '@/components/common/FileUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { MenuItem } from '@/types/menu.types'
import { MENU_ITEM_TYPE_LABELS } from '@/types/menu.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image as ImageIcon, Sparkles } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import IconPickerModal from '../common/IconPickerModal'

// Configuration for different menu types
const MENU_TYPE_CONFIG: Record<
  string,
  {
    adminEndpoint: string
    frontendBase: string
    label: string
    supportsAll: boolean
  }
> = {
  page: {
    adminEndpoint: '/admin/pages',
    frontendBase: '/page',
    label: 'Page',
    supportsAll: false
  },
  post: {
    adminEndpoint: '/admin/blog/posts',
    frontendBase: '/page',
    label: 'Blog Post',
    supportsAll: true
  },
  category: {
    adminEndpoint: '/admin/blog/categories',
    frontendBase: '/page',
    label: 'Blog Category',
    supportsAll: true
  },
  service: {
    adminEndpoint: '/admin/services',
    frontendBase: '/page',
    label: 'Service',
    supportsAll: true
  },
  product: {
    adminEndpoint: '/admin/products',
    frontendBase: '/page',
    label: 'Product',
    supportsAll: true
  },
  package: {
    adminEndpoint: '/admin/packages',
    frontendBase: '/page',
    label: 'Package',
    supportsAll: true
  },
  gallery: {
    adminEndpoint: '/admin/gallery',
    frontendBase: '/page',
    label: 'Gallery',
    supportsAll: true
  }
}

// Menu Item Editor Component — Refactored Structure
const MenuItemSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum([
      'page',
      'post',
      'category',
      'service',
      'product',
      'package',
      'gallery',
      'custom',
      'external'
    ]),
    reference: z.union([z.string(), z.null()]).optional(),
    url: z.union([z.string(), z.null()]).optional(),
    target: z.enum(['_self', '_blank']),
    icon: z.union([z.string(), z.null()]).optional(),
    iconType: z.enum(['icon', 'image']).optional(),
    cssClass: z.union([z.string(), z.null()]).optional(),
    order: z.number().optional(),
    isPublished: z.boolean().optional(),
    meta: z.record(z.string(), z.any()).optional()
  })
  .refine(
    (data) => {
      // Entity types require reference (except when "All" is selected - null is valid)
      const entityTypes = ['page', 'post', 'category', 'service', 'product', 'package', 'gallery']
      if (entityTypes.includes(data.type)) {
        // For page type, reference is required
        if (data.type === 'page') {
          return !!data.reference
        }
        // For other types, null (All) or a valid slug is acceptable
        return data.reference !== undefined
      }
      return true
    },
    {
      message: 'Reference (slug) is required',
      path: ['reference']
    }
  )
  .refine(
    (data) => {
      // Link types require url
      if (['custom', 'external'].includes(data.type)) {
        return !!data.url
      }
      return true
    },
    {
      message: 'URL is required for link types',
      path: ['url']
    }
  )
  .refine(
    (data) => {
      // External links must start with http:// or https://
      if (data.type === 'external' && data.url) {
        return data.url.startsWith('http://') || data.url.startsWith('https://')
      }
      return true
    },
    {
      message: 'External URLs must start with http:// or https://',
      path: ['url']
    }
  )

type MenuItemFormType = z.infer<typeof MenuItemSchema>

interface MenuItemEditorProps {
  item?: MenuItem | null
  onSave: (updates: Partial<MenuItem>) => void
  onCancel: () => void
}

export default function MenuItemForm({ item, onSave, onCancel }: MenuItemEditorProps) {
  // Helper function to detect if icon value is an image URL
  const detectIconType = (iconValue?: string | null): 'icon' | 'image' => {
    if (!iconValue) return 'icon'
    // Check if it's a URL (starts with http://, https://, or /)
    if (
      iconValue.startsWith('http://') ||
      iconValue.startsWith('https://') ||
      iconValue.startsWith('/') ||
      iconValue.includes('.')
    ) {
      return 'image'
    }
    return 'icon'
  }

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch
  } = useForm<MenuItemFormType>({
    resolver: zodResolver(MenuItemSchema),
    defaultValues: {
      title: item?.title || '',
      type: (item?.type || 'custom') as MenuItemFormType['type'],
      reference: item?.reference || '',
      url: item?.url || '',
      target: (item?.target as '_self' | '_blank') || '_self',
      icon: item?.icon || '',
      iconType: item?.iconType || detectIconType(item?.icon),
      cssClass: item?.cssClass || '',
      order: item?.order || 0,
      isPublished: item?.isPublished ?? true,
      meta: item?.meta || {}
    }
  })
  const watchType = watch('type')
  const watchIconType = watch('iconType')

  const isEntityType = [
    'page',
    'post',
    'category',
    'service',
    'product',
    'package',
    'gallery'
  ].includes(watchType)
  const isLinkType = ['custom', 'external'].includes(watchType)

  // Get configuration for current type
  const typeConfig = MENU_TYPE_CONFIG[watchType]
  const supportsAll = typeConfig?.supportsAll ?? false

  const onSubmit = (data: MenuItemFormType) => {
    const payload: Partial<MenuItem> = {
      title: data.title,
      type: data.type,
      target: data.target,
      icon: data.icon || undefined,
      iconType: data.iconType || 'icon',
      cssClass: data.cssClass || undefined,
      order: data.order ?? 0,
      isPublished: data.isPublished ?? true,
      meta: data.meta || {}
    }

    // Add appropriate field based on type
    if (isEntityType) {
      payload.reference = data.reference || null
      payload.url = null
    } else if (isLinkType) {
      payload.url = data.url || undefined
      payload.reference = null
    }

    onSave(payload)
  }

  return (
    <div className='bg-white rounded-xl'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='gap-6 space-y-6'>
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Configure the menu item title and type</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 pt-6'>
              <Controller
                control={control}
                name='title'
                render={({ field }) => (
                  <CustomInput
                    label='Menu Title'
                    placeholder='e.g., Home, About Us, Contact'
                    error={errors.title?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                control={control}
                name='type'
                render={({ field }) => (
                  <CustomInput
                    label='Menu Type'
                    name='type'
                    type='select'
                    value={field.value}
                    onValueChange={field.onChange}
                    required
                    options={[
                      { value: 'page', label: MENU_ITEM_TYPE_LABELS.page },
                      { value: 'post', label: MENU_ITEM_TYPE_LABELS.post },
                      { value: 'category', label: MENU_ITEM_TYPE_LABELS.category },
                      { value: 'service', label: MENU_ITEM_TYPE_LABELS.service },
                      { value: 'product', label: MENU_ITEM_TYPE_LABELS.product },
                      { value: 'package', label: MENU_ITEM_TYPE_LABELS.package },
                      { value: 'gallery', label: MENU_ITEM_TYPE_LABELS.gallery },
                      { value: 'custom', label: MENU_ITEM_TYPE_LABELS.custom },
                      { value: 'external', label: MENU_ITEM_TYPE_LABELS.external }
                    ]}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Link/Reference Card */}
          {(isEntityType || isLinkType) && (
            <Card>
              <CardHeader>
                <CardTitle>{isEntityType ? 'Select Content' : 'URL Configuration'}</CardTitle>
                <CardDescription>
                  {isEntityType
                    ? `Choose the ${watchType} to link to`
                    : 'Enter the destination URL'}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Entity types - Show reference selector */}
                {isEntityType && (
                  <Controller
                    control={control}
                    name='reference'
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <CustomSelect
                          label={`Select ${typeConfig?.label || watchType}`}
                          placeholder={`Choose a ${typeConfig?.label || watchType}...`}
                          value={field.value || undefined}
                          url={typeConfig?.adminEndpoint || `/admin/${watchType}s`}
                          options={(data) => {
                            const items =
                              data?.data?.items?.map((item: any) => ({
                                value: item.slug,
                                label: item.title || item.name
                              })) || []

                            // Add "All" option for types that support it
                            if (supportsAll) {
                              return [{ value: null, label: 'All' }, ...items]
                            }
                            return items
                          }}
                          onChange={(value) => {
                            // Convert 'null' string to actual null for "All" option
                            field.onChange(value === 'null' ? null : value)
                          }}
                        />
                        {errors.reference && (
                          <p className='text-red-600 text-sm'>
                            {errors.reference.message as string}
                          </p>
                        )}
                      </div>
                    )}
                  />
                )}

                {/* Link types - Show URL input */}
                {isLinkType && (
                  <Controller
                    control={control}
                    name='url'
                    render={({ field }) => (
                      <CustomInput
                        label='URL'
                        placeholder={
                          watchType === 'external' ? 'https://example.com' : '/about or /contact'
                        }
                        error={errors.url?.message}
                        required
                        helperText={
                          watchType === 'external'
                            ? 'Must start with http:// or https://'
                            : 'Internal path starting with /'
                        }
                        {...field}
                        value={field.value || ''}
                      />
                    )}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Advanced Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
              <CardDescription>Optional configuration</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Controller
                control={control}
                name='cssClass'
                render={({ field }) => (
                  <CustomInput
                    label='CSS Class (optional)'
                    placeholder='custom-class'
                    error={errors.cssClass?.message}
                    {...field}
                    value={field.value || ''}
                  />
                )}
              />

              <div className='gap-4 grid grid-cols-2'>
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
                      label='Display Order'
                      placeholder='0'
                      type='number'
                      error={errors.order?.message}
                      helperText='Lower = first'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name='isPublished'
                  render={({ field }) => (
                    <div className='space-y-3'>
                      <CustomInput
                        type='switch'
                        label={field.value ? 'Published' : 'Draft'}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <p className='text-muted-foreground text-xs'>
                        {field.value ? 'Visible to visitors' : 'Hidden from visitors'}
                      </p>
                    </div>
                  )}
                />

                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <Label>Select Icon (optional)</Label>
                    <Controller
                      control={control}
                      name='iconType'
                      render={({ field }) => (
                        <div className='inline-flex items-center gap-1.5 bg-muted/40 p-1 rounded-lg'>
                          <Button
                            type='button'
                            variant={field.value === 'icon' ? 'default' : 'ghost'}
                            size='icon'
                            onClick={() => field.onChange('icon')}
                            className='size-6!'
                          >
                            <Sparkles className='w-4 h-4' />
                          </Button>
                          <Button
                            type='button'
                            variant={field.value === 'image' ? 'default' : 'ghost'}
                            size='icon'
                            onClick={() => field.onChange('image')}
                            className='size-6!'
                          >
                            <ImageIcon className='w-4 h-4' />
                          </Button>
                        </div>
                      )}
                    />
                  </div>

                  <Controller
                    control={control}
                    name='icon'
                    render={({ field }) => (
                      <>
                        {watchIconType === 'image' ? (
                          <FileUploader
                            value={field.value as string}
                            onChangeAction={(val: string | string[]) => field.onChange(val)}
                            size='small'
                          />
                        ) : (
                          <IconPickerModal
                            value={field.value as string}
                            onChange={(val) => field.onChange(val)}
                          />
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className='flex flex-row *:flex-1 gap-4 w-full'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
            </Button>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

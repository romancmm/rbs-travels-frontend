import CustomInput from '@/components/common/CustomInput'
import { CustomSelect, Option } from '@/components/common/CustomSelect'
import FilePicker from '@/components/common/FilePicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { MenuItem, MenuItemType } from '@/types/menu.types'
import { MENU_ITEM_TYPE_LABELS } from '@/types/menu.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image as ImageIcon, Sparkles } from 'lucide-react'
import { Control, Controller, FieldErrors, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import IconPickerModal from '../common/IconPickerModal'

// ─── Menu type configuration ────────────────────────────────────────────────

const MENU_ITEM_TYPES = [
  'category-blog',
  'single-article',
  'gallery',
  'page',
  'custom-link',
  'external-link'
] as const satisfies readonly MenuItemType[]

type MenuTypeEndpointConfig = { adminEndpoint: string; label: string }

// Only types with a list to pick from need an endpoint - link types collect
// a URL instead (see LinkUrlField).
const MENU_TYPE_CONFIG: Partial<Record<MenuItemType, MenuTypeEndpointConfig>> = {
  'category-blog': {
    adminEndpoint: '/admin/articles/categories',
    label: 'Article Categories'
  },
  'single-article': {
    adminEndpoint: '/admin/articles/posts',
    label: 'Article'
  },
  page: {
    adminEndpoint: '/admin/pages',
    label: 'Page'
  },
  gallery: {
    adminEndpoint: '/admin/media?fileType=all&path=/&page=0&limit=100',
    label: 'Gallery Folder'
  }
}

// ─── Option mappers - keep response-shape knowledge out of the JSX ─────────

/** Article/page/category list endpoints share the same {data:{items}} envelope. */
function mapSlugOptions(data: any): Option[] {
  return (
    data?.data?.items?.map((item: any) => ({
      value: item.slug,
      label: item.title || item.name
    })) || []
  )
}

/** The media endpoint returns folders directly (unwrapped), keyed by folderPath. */
function mapGalleryFolderOptions(data: any): Option[] {
  return (
    data?.folders?.map((item: any) => ({
      value: item.folderPath,
      label: item.title || item.name
    })) || []
  )
}

function detectIconType(iconValue?: string | null): 'icon' | 'image' {
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

// ─── Validation schema ──────────────────────────────────────────────────────

const MenuItemSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(MENU_ITEM_TYPES),
    reference: z
      .union([z.string(), z.array(z.string())])
      .nullable()
      .optional(),
    url: z.union([z.string(), z.null()]).optional(),
    target: z.enum(['_self', '_blank']),
    icon: z.union([z.string(), z.null()]).optional(),
    iconType: z.enum(['icon', 'image']).optional(),
    cssClass: z.union([z.string(), z.null()]).optional(),
    order: z.number().optional(),
    isPublished: z.boolean().optional(),
    bgImage: z.union([z.string(), z.null()]).optional(),
    showTitle: z.boolean().optional(),
    meta: z.record(z.string(), z.any()).optional()
  })
  .superRefine((data, ctx) => {
    // category-blog requires an array of references
    if (data.type === 'category-blog') {
      if (!Array.isArray(data.reference) || data.reference.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one category is required for category-blog type',
          path: ['reference']
        })
      }
    }

    // Entity types require a single string reference
    if (['single-article', 'page', 'gallery'].includes(data.type)) {
      if (!data.reference || typeof data.reference !== 'string') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Reference (${data.type === 'gallery' ? 'path' : 'slug'}) is required for ${
            data.type
          } type`,
          path: ['reference']
        })
      }
    }

    // Link types require a URL
    if (['custom-link', 'external-link'].includes(data.type)) {
      if (!data.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `URL is required for ${data.type} type`,
          path: ['url']
        })
      } else if (
        data.type === 'external-link' &&
        !data.url.startsWith('http://') &&
        !data.url.startsWith('https://')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'External links must start with http:// or https://',
          path: ['url']
        })
      }
    }
  })

type MenuItemFormType = z.infer<typeof MenuItemSchema>

// ─── Reference field - the part of the form that varies by menu type ──────

type ReferenceFieldProps = {
  control: Control<MenuItemFormType>
  errors: FieldErrors<MenuItemFormType>
  watchType: MenuItemFormType['type']
  typeConfig?: MenuTypeEndpointConfig
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className='text-red-600 text-sm'>{message}</p>
}

function EntityReferenceField({ control, errors, watchType, typeConfig }: ReferenceFieldProps) {
  const isGallery = watchType === 'gallery'

  return (
    <Controller
      control={control}
      name='reference'
      render={({ field }) => (
        <div className='space-y-2'>
          <CustomSelect
            showSearch
            // tree={isGallery}
            multiple={watchType === 'category-blog'}
            label={`Select ${typeConfig?.label || watchType}`}
            placeholder={`Choose a ${typeConfig?.label || watchType}...`}
            value={field.value ?? []}
            url={typeConfig?.adminEndpoint || `/admin/${watchType}s`}
            options={isGallery ? mapGalleryFolderOptions : mapSlugOptions}
            onChange={(value) => field.onChange(value === 'null' ? null : value)}
          />
          <FieldError message={errors.reference?.message as string} />
        </div>
      )}
    />
  )
}

function LinkUrlField({ control, errors, watchType }: Omit<ReferenceFieldProps, 'typeConfig'>) {
  return (
    <Controller
      control={control}
      name='url'
      render={({ field }) => (
        <CustomInput
          label='URL'
          placeholder={watchType === 'external-link' ? 'https://example.com' : '/about or /contact'}
          error={errors.url?.message}
          required
          helperText={
            watchType === 'external-link'
              ? 'Must start with http:// or https://'
              : 'Internal path starting with /'
          }
          {...field}
          value={field.value || ''}
        />
      )}
    />
  )
}

// ─── Advanced settings sub-fields ───────────────────────────────────────────

function ToggleField({
  label,
  description,
  checked,
  onCheckedChange
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className='space-y-2'>
      <CustomInput
        type='switch'
        label={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <p className='text-muted-foreground text-xs'>{description}</p>
    </div>
  )
}

function IconField({ control }: { control: Control<MenuItemFormType> }) {
  const iconType = useWatch({ control, name: 'iconType' })

  return (
    <div className='space-y-3 bg-muted/20 p-3 border rounded-lg'>
      <div className='flex justify-between items-center'>
        <Label>Icon (optional)</Label>
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
                title='Use an icon'
              >
                <Sparkles className='w-4 h-4' />
              </Button>
              <Button
                type='button'
                variant={field.value === 'image' ? 'default' : 'ghost'}
                size='icon'
                onClick={() => field.onChange('image')}
                className='size-6!'
                title='Use an image'
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
        render={({ field }) =>
          iconType === 'image' ? (
            <FilePicker
              value={field.value || ''}
              onChangeAction={field.onChange}
              multiple={false}
              maxAllow={1}
              size='large'
              allowedTypes={['image']}
            />
          ) : (
            <IconPickerModal
              value={field.value as string}
              onChange={(val) => field.onChange(val)}
            />
          )
        }
      />
    </div>
  )
}

// ─── Main form ──────────────────────────────────────────────────────────────

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
      reference: item?.reference || (item?.type === 'category-blog' ? [] : ''),
      url: item?.url || '',
      target: (item?.target as '_self' | '_blank') || '_self',
      icon: item?.icon || '',
      iconType: item?.iconType || detectIconType(item?.icon),
      cssClass: item?.cssClass || '',
      order: item?.order || 0,
      isPublished: item?.isPublished ?? true,
      bgImage: item?.bgImage || '',
      showTitle: item?.showTitle ?? true,
      meta: item?.meta || {}
    }
  })

  const watchType = watch('type')
  const watchShowTitle = watch('showTitle')

  const isCategoryBlog = watchType === 'category-blog'
  // const isEntityType =
  //   watchType === 'category-blog' ||
  //   'single-article' ||
  //   watchType === 'page' ||
  //   watchType === 'gallery'
  const isLinkType = watchType === 'custom-link' || watchType === 'external-link'

  const typeConfig = MENU_TYPE_CONFIG[watchType]

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
      bgImage: data.bgImage || undefined,
      showTitle: data.showTitle ?? true,
      meta: data.meta || {}
    }

    if (isCategoryBlog) {
      payload.reference = Array.isArray(data.reference) ? data.reference : []
      payload.url = null
    } else if (!isLinkType) {
      payload.reference = typeof data.reference === 'string' ? data.reference : null
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
            <CardHeader className='border-b'>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Configure the menu item title, type, and target</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
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
                  <CustomSelect
                    label='Menu Type'
                    name='type'
                    value={field.value}
                    onChange={field.onChange}
                    staticOptions={MENU_ITEM_TYPES.map((type) => ({
                      value: type,
                      label: MENU_ITEM_TYPE_LABELS[type]
                    }))}
                  />
                )}
              />

              {/* {isCategoryBlog && (
                <CategoryReferenceField
                  control={control}
                  errors={errors}
                  watchType={watchType}
                  typeConfig={typeConfig}
                />
              )} */}

              {isLinkType ? (
                <LinkUrlField control={control} errors={errors} watchType={watchType} />
              ) : (
                <EntityReferenceField
                  control={control}
                  errors={errors}
                  watchType={watchType}
                  typeConfig={typeConfig}
                />
              )}
            </CardContent>
          </Card>

          {/* Advanced Settings Card */}
          <Card>
            <CardHeader className='border-b'>
              <CardTitle>Additional Settings</CardTitle>
              <CardDescription>Optional configuration</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Status */}
              <div className='gap-4 grid sm:grid-cols-2'>
                <Controller
                  control={control}
                  name='isPublished'
                  render={({ field }) => (
                    <ToggleField
                      label={field.value ? 'Published' : 'Draft'}
                      description={field.value ? 'Visible to visitors' : 'Hidden from visitors'}
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='showTitle'
                  render={({ field }) => (
                    <ToggleField
                      label='Show Title'
                      description={
                        field.value
                          ? 'Title will be visible'
                          : 'Title will be hidden (useful for icon/image-only menu items)'
                      }
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <Separator />

              {/* Display */}
              <div className='gap-4 grid sm:grid-cols-2'>
                <Controller
                  control={control}
                  name='target'
                  render={({ field }) => (
                    <CustomSelect
                      label='Open In'
                      name='target'
                      value={field.value}
                      onChange={field.onChange}
                      staticOptions={[
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
              </div>

              <IconField control={control} />

              <Separator />

              {/* Appearance */}
              {watchShowTitle && (
                <Controller
                  control={control}
                  name='bgImage'
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <Label>Background Image (optional)</Label>
                      <FilePicker
                        value={field.value || ''}
                        onChangeAction={field.onChange}
                        multiple={false}
                        maxAllow={1}
                        size='large'
                        allowedTypes={['image']}
                      />
                    </div>
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
                    value={field.value || ''}
                  />
                )}
              />
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

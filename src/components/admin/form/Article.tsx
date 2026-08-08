'use client'

import CustomInput from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import FilePicker from '@/components/common/FilePicker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEntityForm } from '@/hooks/useEntityForm'
import { showError } from '@/lib/errMsg'
import { CreateArticleSchema, CreateArticleType } from '@/lib/validations/schemas/article'
import requests from '@/services/network/http'
import { Image as ImageIcon, Search, Tag, Text, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import TextEditor from '../common/TextEditor'

type TProps = {
  initialData?: any
}

export default function ArticleForm({ initialData }: TProps) {
  const router = useRouter()

  const values = useMemo(
    () => ({
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      thumbnail: initialData?.thumbnail || '',
      gallery: initialData?.gallery || [],
      seo: {
        title: initialData?.seo?.title || '',
        description: initialData?.seo?.description || '',
        keywords: initialData?.seo?.keywords || []
      },
      categoryIds:
        initialData?.categoryIds ||
        (initialData?.categories ? initialData.categories.map((cat: any) => cat.id) : []),
      tags: initialData?.tags || [],
      isPublished: initialData?.isPublished || true,
      publishedAt: initialData?.publishedAt || undefined
    }),
    [initialData]
  )

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useEntityForm<CreateArticleType>({
    schema: CreateArticleSchema,
    mode: 'onChange',
    values
  })

  const watchTitle = watch('title')
  const watchTags = watch('tags')
  const watchSeoKeywords = watch('seo.keywords') ?? []
  const watchIsPublished = watch('isPublished')

  // CustomInput always renders a controlled <Input value={value ?? ''}>, so
  // leaving these fields without value/onChange locks them to a permanent
  // empty string - every keystroke got reverted and nothing could be typed.
  const [tagInput, setTagInput] = useState('')
  const [seoKeywordInput, setSeoKeywordInput] = useState('')

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle && !initialData?.slug) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue('slug', slug)
    }
  }, [watchTitle, setValue, initialData?.slug])

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !watchTags.includes(newTag)) {
        setValue('tags', [...watchTags, newTag], { shouldValidate: true, shouldDirty: true })
        setTagInput('')
      }
    }
  }

  const removeTag = (indexToRemove: number) => {
    setValue(
      'tags',
      watchTags.filter((_, index) => index !== indexToRemove),
      { shouldValidate: true, shouldDirty: true }
    )
  }

  // Handle SEO keywords input
  const handleSeoKeywordInput = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newKeyword = seoKeywordInput.trim()
      if (newKeyword && !watchSeoKeywords.includes(newKeyword)) {
        setValue('seo.keywords', [...watchSeoKeywords, newKeyword], { shouldDirty: true })
        setSeoKeywordInput('')
      }
    }
  }

  const removeSeoKeyword = (indexToRemove: number) => {
    setValue(
      'seo.keywords',
      watchSeoKeywords.filter((_, index) => index !== indexToRemove),
      { shouldDirty: true }
    )
  }

  const onSubmit: SubmitHandler<CreateArticleType> = async (data) => {
    try {
      const payload = {
        ...data,
        seo: {
          ...data.seo,
          title: (data.seo?.title || data.title).slice(0, 60),
          description: (data.seo?.description || data.excerpt).slice(0, 160),
          keywords: data.seo?.keywords?.length ? data.seo.keywords : data.tags
        },
        ...(initialData?.id ? { id: initialData.id } : {})
      }

      await requests[initialData?.id ? 'put' : 'post'](
        `/admin/articles/posts` + (initialData?.id ? `/${initialData?.id}` : ``),
        payload
      )
      toast.success('Article created successfully')
      router.push('/admin/articles')
    } catch (error) {
      showError(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='items-start gap-6 grid grid-cols-1 lg:grid-cols-3'>
        {/* Main column */}
        <div className='space-y-6 lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Text className='w-4 h-4 text-muted-foreground' />
                Post Details
              </CardTitle>
              <CardDescription>The title, category and short summary of your post.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-5'>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label='Article Title'
                    type='text'
                    placeholder='Enter blog title'
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.title?.message}
                    required
                  />
                )}
              />

              <Controller
                name='categoryIds'
                control={control}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      label='Categories'
                      placeholder='Select Categories'
                      value={Array.isArray(field.value) ? field.value : []}
                      url={'/admin/articles/categories'}
                      options={(data) => {
                        return (
                          data?.data?.items?.map((item: any) => ({
                            value: String(item.id),
                            label: item.title || item.name,
                            title: item.title || item.name
                          })) || []
                        )
                      }}
                      searchMode='server'
                      onChange={(value) => {
                        // CustomSelect already handles toggle logic, just update the field
                        field.onChange(value)
                      }}
                      multiple
                    />
                    {errors.categoryIds && (
                      <span className='font-medium text-red-500 text-xs'>
                        {errors.categoryIds.message}
                      </span>
                    )}
                  </>
                )}
              />

              <Controller
                name='excerpt'
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label='Excerpt'
                    type='textarea'
                    rows={3}
                    placeholder='Brief description of the content'
                    maxLength={500}
                    showCharCount
                    helperText='Shown in post listings and search previews'
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.excerpt?.message}
                    required
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Write the full body of the article.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name='content'
                control={control}
                render={({ field }) => (
                  <TextEditor
                    value={field.value || ''}
                    onChange={(newContent) => {
                      field.onChange(newContent)
                      // Also manually trigger validation
                      setValue('content', newContent, { shouldValidate: true })
                    }}
                    placeholder='Write your content here'
                    error={errors.content?.message}
                    required
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Tag className='w-4 h-4 text-muted-foreground' />
                Tags
              </CardTitle>
              <CardDescription>Help readers discover related posts.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <CustomInput
                type='text'
                placeholder='Type a tag and press Enter'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
              />
              {watchTags.length > 0 && (
                <div className='flex flex-wrap gap-2 bg-muted/50 p-3 rounded-lg'>
                  {watchTags.map((tag, index) => (
                    <div
                      key={index}
                      className='group flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full text-primary text-sm transition-colors'
                    >
                      <span>{tag}</span>
                      <button
                        type='button'
                        onClick={() => removeTag(index)}
                        className='opacity-60 hover:opacity-100 transition-opacity'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6 lg:col-span-1'>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <CardTitle>Publish</CardTitle>
                <Badge variant={watchIsPublished ? 'default' : 'secondary'}>
                  {watchIsPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Controller
                name='isPublished'
                control={control}
                render={({ field }) => (
                  <CustomInput
                    type='switch'
                    name='isPublished'
                    label={`Article is ${field.value ? 'Published' : 'Draft'}`}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      if (checked && !watch('publishedAt')) {
                        setValue('publishedAt', new Date().toISOString())
                      }
                    }}
                  />
                )}
              />

              <div className='flex flex-col gap-2 pt-2 border-t'>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : initialData ? 'Update Post' : 'Publish Post'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push('/admin/articles')}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <ImageIcon className='w-4 h-4 text-muted-foreground' />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name='thumbnail'
                render={({ field }) => (
                  <FilePicker
                    value={field.value || ''}
                    onChangeAction={field.onChange}
                    multiple={false}
                    maxAllow={1}
                    size='extra-large'
                  />
                )}
              />
              {errors.thumbnail && (
                <span className='font-medium text-red-500 text-xs'>{errors.thumbnail.message}</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
              <CardDescription>Add up to 10 supporting images.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name='gallery'
                render={({ field }) => (
                  <FilePicker
                    multiple={true}
                    maxAllow={10}
                    value={field.value || ''}
                    onChangeAction={field.onChange}
                    size='extra-large'
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Search className='w-4 h-4 text-muted-foreground' />
                SEO
              </CardTitle>
              <CardDescription>Control how this post appears in search engines.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Controller
                name='seo.title'
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label='SEO Title'
                    type='text'
                    placeholder='SEO title for search engines'
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.seo?.title?.message}
                  />
                )}
              />

              <Controller
                name='seo.description'
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label='SEO Description'
                    type='textarea'
                    placeholder='SEO description for search engines'
                    rows={4}
                    maxLength={160}
                    showCharCount={true}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.seo?.description?.message}
                  />
                )}
              />

              {/* SEO Keywords */}
              <div className='space-y-2'>
                <CustomInput
                  label='SEO Keywords'
                  type='text'
                  placeholder='Type keyword and press Enter'
                  value={seoKeywordInput}
                  onChange={(e) => setSeoKeywordInput(e.target.value)}
                  onKeyDown={handleSeoKeywordInput}
                />
                {watchSeoKeywords.length > 0 && (
                  <div className='flex flex-wrap gap-2 bg-muted/50 p-3 rounded-lg'>
                    {watchSeoKeywords.map((keyword, index) => (
                      <div
                        key={index}
                        className='group flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full text-primary text-sm transition-colors'
                      >
                        <span>{keyword}</span>
                        <button
                          type='button'
                          onClick={() => removeSeoKeyword(index)}
                          className='opacity-60 hover:opacity-100 transition-opacity'
                        >
                          <X className='w-3 h-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

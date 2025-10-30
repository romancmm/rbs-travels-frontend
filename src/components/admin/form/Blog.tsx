'use client'

import CustomInput from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import FileUploader from '@/components/common/FileUploader'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { showError } from '@/lib/errMsg'
import { CreateBlogSchema, CreateBlogType } from '@/lib/validations/schemas/blog'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextEditor from '../common/TextEditor'

type TProps = {
  initialData?: any
}

export default function BlogForm({ initialData }: TProps) {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateBlogType>({
    resolver: zodResolver(CreateBlogSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      categoryId: initialData?.categoryId || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      thumbnail: initialData?.thumbnail || '',
      gallery: initialData?.gallery || [],
      tags: initialData?.tags || [],
      isPublished: initialData?.isPublished || true,
      seo: {
        title: initialData?.seo?.title || '',
        description: initialData?.seo?.description || '',
        keywords: initialData?.seo?.keywords || []
      }
    }
  })
  console.log('errors :>> ', errors);
  const watchTitle = watch('title')
  const watchTags = watch('tags')
  const watchSeoKeywords = watch('seo.keywords')

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
      const input = e.target as HTMLInputElement
      const newTag = input.value.trim()
      if (newTag && !watchTags.includes(newTag)) {
        setValue('tags', [...watchTags, newTag])
        input.value = ''
      }
    }
  }

  const removeTag = (indexToRemove: number) => {
    setValue(
      'tags',
      watchTags.filter((_, index) => index !== indexToRemove)
    )
  }

  // Handle SEO keywords input
  const handleSeoKeywordInput = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const input = e.target as HTMLInputElement
      const newKeyword = input.value.trim()
      if (newKeyword && !watchSeoKeywords.includes(newKeyword)) {
        setValue('seo.keywords', [...watchSeoKeywords, newKeyword])
        input.value = ''
      }
    }
  }

  const removeSeoKeyword = (indexToRemove: number) => {
    setValue(
      'seo.keywords',
      watchSeoKeywords.filter((_, index) => index !== indexToRemove)
    )
  }

  const onSubmit: SubmitHandler<CreateBlogType> = async (data) => {
    console.log('data :>> ', data);
    try {
      const res = await requests[initialData?.id ? 'put' : 'post'](
        `/admin/blog/posts` + (initialData?.id ? `/${initialData?.id}` : ``),
        {
          ...data,
          ...(initialData?.id ? { id: initialData.id } : {})
        }
      )
      console.log('res :>> ', res)
      toast.success('Blog post created successfully')
      router.push('/admin/blogs')
    } catch (error) {
      showError(error)
    }
  }

  return (
    <div className='bg-white p-5 rounded-xl'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='items-start gap-8 lg:gap-6 grid grid-cols-1 lg:grid-cols-2'>
          <div className='gap-5 grid'>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <CustomInput
                  label='Blog Title'
                  type='text'
                  placeholder='Enter blog title'
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.title?.message}
                  required
                />
              )}
            />

            {/* <Controller
              name='slug'
              control={control}
              render={({ field }) => (
                <CustomInput
                  label='Blog Slug'
                  type='text'
                  placeholder='blog-post-slug'
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.slug?.message}
                  required
                />
              )}
            /> */}

            <Controller
              name='categoryId'
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label='Category'
                  placeholder='Select Category'
                  value={field.value?.toString() || ''}
                  url='/admin/blogs/categories'
                  options={(data) =>
                    data?.data?.categories?.map((cat: any) => ({
                      value: cat.id.toString(),
                      label: cat.name
                    }))
                  }
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name='excerpt'
              control={control}
              render={({ field }) => (
                <CustomInput
                  label='Excerpt'
                  type='textarea'
                  placeholder='Brief description of the blog post'
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.excerpt?.message}
                  required
                />
              )}
            />

            <Controller
              name='content'
              control={control}
              render={({ field }) => (
                <TextEditor
                  label='Content'
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder='Write your blog content here'
                  error={errors.content?.message}
                />
              )}
            />

            {/* Tags */}
            <div className='space-y-2'>
              <CustomInput
                label='Tags'
                type='text'
                placeholder='Type tag and press Enter'
                onKeyDown={handleTagInput}
              />
              <div className='flex flex-wrap gap-2 mt-2'>
                {watchTags.map((tag, index) => (
                  <span
                    key={index}
                    className='inline-flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-md text-blue-800 text-sm'
                  >
                    {tag}
                    <button
                      type='button'
                      onClick={() => removeTag(index)}
                      className='ml-1 text-blue-600 hover:text-blue-800'
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className='gap-5 grid'>
            <div>
              <Label className='mb-2'>Thumbnail</Label>
              <Controller
                control={control}
                name='thumbnail'
                render={({ field }) => (
                  <FileUploader
                    value={field.value || ''}
                    onChangeAction={field.onChange}
                    maxAllow={1}
                    size='extra-large'
                  />
                )}
              />
              {errors.thumbnail && (
                <span className='font-medium text-red-500 text-xs'>{errors.thumbnail.message}</span>
              )}
            </div>

            <div>
              <Label className='mb-2'>Gallery Images</Label>
              <Controller
                control={control}
                name='gallery'
                render={({ field }) => (
                  <FileUploader
                    multiple={true}
                    maxAllow={10}
                    value={field.value || ''}
                    onChangeAction={field.onChange}
                    size='extra-large'
                  />
                )}
              />
            </div>

            <div className='space-y-6 p-6 border rounded-md'>
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
                  onKeyDown={handleSeoKeywordInput}
                />
                <div className='flex flex-wrap gap-2'>
                  {watchSeoKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md text-green-800 text-sm'
                    >
                      {keyword}
                      <button
                        type='button'
                        onClick={() => removeSeoKeyword(index)}
                        className='ml-1 text-green-600 hover:text-green-800'
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Controller
              name='isPublished'
              control={control}
              render={({ field }) => (
                <CustomInput
                  type='switch'
                  name='isPublished'
                  label={`Blog is ${field.value ? 'Published' : 'Draft'}`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className='flex justify-center lg:justify-end gap-4 mt-5'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/admin/blogs')}
            className='lg:w-full max-w-52'
          >
            Cancel
          </Button>
          <Button type='submit' className='lg:w-full max-w-52'>
            {initialData ? 'Update' : 'Create'} Blog Post
          </Button>
        </div>
      </form>
    </div>
  )
}

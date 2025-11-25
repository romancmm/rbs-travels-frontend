'use client'

import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import ArticleDetailRenderer from '@/components/frontend/details/ArticleDetailRenderer'
import PackageDetailRenderer from '@/components/frontend/details/PackageDetailRenderer'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { notFound, useParams } from 'next/navigation'

export default function DetailPage() {
  const params = useParams()
  const parentSlug = params.slug as string
  const detailSlug = params.detailSlug as string

  // Determine API endpoint based on parent slug
  const getApiEndpoint = () => {
    if (!detailSlug) return null

    switch (parentSlug) {
      case 'blogs':
        return `/articles/posts/slug/${detailSlug}`
      case 'packages':
        return `/packages/slug/${detailSlug}`
      case 'products':
        return `/products/slug/${detailSlug}`
      default:
        return null
    }
  }

  const { data, loading } = useAsync<{ data: any }>(getApiEndpoint, true)

  // Fetch related posts for blogs
  const getRelatedEndpoint = () => {
    if (parentSlug === 'blogs' && data?.data?.categoryId) {
      return `/article/posts?categoryId=${data.data.categoryId}&limit=3&exclude=${data.data.id}`
    }
    return null
  }

  const { data: relatedData } = useAsync<{ data: any[] }>(getRelatedEndpoint, true)

  if (!parentSlug || !detailSlug) {
    notFound()
  }

  if (loading) {
    return (
      <>
        <Section className="bg-[gradient(to_right,rgba(0,0,0,0.6),rgba(0,0,0,0.2)),url('/images/bg/breadcrumb.jpg')] bg-cover bg-center">
          <Container>
            <div className='py-12'>
              <Skeleton className='bg-white/20 mb-4 w-3/4 h-12' />
              <Skeleton className='bg-white/10 w-1/2 h-6' />
            </div>
          </Container>
        </Section>

        <Section variant={'xl'}>
          <Container>
            <div className='space-y-8'>
              {/* Featured image skeleton */}
              <Skeleton className='rounded-xl w-full h-[400px]' />

              {/* Content loading skeletons */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <Skeleton className='w-2/3 h-8' />
                  <div className='space-y-3'>
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-5/6 h-4' />
                  </div>
                </div>

                <div className='space-y-4'>
                  <Skeleton className='w-1/2 h-6' />
                  <div className='space-y-3'>
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-4/5 h-4' />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </>
    )
  }

  if (!data?.data) {
    notFound()
  }

  const detail = data.data

  // Render different UI based on parent type
  const renderDetailContent = () => {
    switch (parentSlug) {
      case 'blogs':
        return <ArticleDetailRenderer data={detail} relatedPosts={relatedData?.data || []} />
      case 'packages':
        return <PackageDetailRenderer data={detail} />
      default:
        notFound()
    }
  }

  return <>{renderDetailContent()}</>
}

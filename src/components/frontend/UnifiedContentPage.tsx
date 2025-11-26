'use client'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import ContentRenderer from '@/components/frontend/content-renderers/ContentRenderer'
import { Skeleton } from '@/components/ui/skeleton'
import { buildContentUrl, CONTENT_TYPE_CONFIG, type ContentType } from '@/config/contentTypes'
import useAsync from '@/hooks/useAsync'
import { notFound } from 'next/navigation'

interface UnifiedContentPageProps {
  contentType: ContentType
  slug?: string | null
  categoryId?: string | null
}

/**
 * Unified content page component that handles all content types
 * Supports both listing and detail pages based on configuration
 */
export default function UnifiedContentPage({
  contentType,
  slug,
  categoryId
}: UnifiedContentPageProps) {
  const config = CONTENT_TYPE_CONFIG[contentType]
  const isListing = !slug

  // Build API URL
  const apiUrl = buildContentUrl(contentType, {
    id: slug,
    categoryId,
    isListing
  })

  const { data, loading } = useAsync<{ data: any }>(() => apiUrl, true)
  console.log('[[data]]', data, slug, apiUrl, contentType)

  if (loading) {
    return (
      <>
        <Section className='bg-linear-to-r from-gray-900/60 to-gray-900/20 bg-cover bg-center'>
          <Container>
            <div className='py-12'>
              <Skeleton className='bg-white/20 mb-4 w-3/4 h-12' />
              <Skeleton className='bg-white/10 w-1/2 h-6' />
            </div>
          </Container>
        </Section>

        <Section variant='xl'>
          <Container>
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
                  <Skeleton className='w-3/4 h-4' />
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </>
    )
  }

  // Handle not found
  if (!data?.data) {
    notFound()
  }

  const content = data.data
  console.log('content', content)
  // For listing pages, render appropriate list component
  if (isListing && config.hasListing) {
    return (
      <div className='p-8 text-gray-600 text-center'>
        Listing page for {contentType} - To be implemented with {config.listingRenderer}
        <pre className='mt-4 text-sm text-left'>{JSON.stringify(content, null, 2)}</pre>
      </div>
    )
  }

  // For detail pages, render using ContentRenderer
  if (!isListing && config.hasDetail) {
    return (
      <div className='space-y-6'>
        <ContentRenderer data={content} config={config} />
      </div>
    )
  }

  return notFound()
}

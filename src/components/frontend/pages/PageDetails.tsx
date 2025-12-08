'use client'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import ContentRenderer from '@/components/frontend/content-renderers/ContentRenderer'
import { Skeleton } from '@/components/ui/skeleton'
import { CONTENT_TYPE_CONFIG, type ContentType } from '@/config/contentTypes'
import useAsync from '@/hooks/useAsync'
import { notFound } from 'next/navigation'

export default function PageDetails({ pageSlug }: { pageSlug: string }) {

  // Unified endpoint that returns content with type information
  const { data, loading } = useAsync<{
    data: any
    type?: ContentType
  }>(() => `/pages/${pageSlug}`, true)
  console.log('pageData', pageSlug, data)

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

  if (!data?.data) {
    notFound()
  }

  const content = data.data
  const contentType = (data.type || content.type || 'page') as ContentType
  const config = CONTENT_TYPE_CONFIG[contentType]

  if (!config) {
    notFound()
  }

  return (
    <div className='space-y-6'>
      <ContentRenderer data={content} config={config} />
    </div>
  )
}

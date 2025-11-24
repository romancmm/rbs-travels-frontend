'use client'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import PageBuilderRenderer from '@/components/frontend/page-builder/Renderer'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { notFound, useParams } from 'next/navigation'

export default function DynamicPage() {
  const params = useParams()
  const pageKey = params.slug
  const { data, loading } = useAsync<{ data: any }>(
    () => (pageKey ? `/pages/${pageKey}` : null),
    true
  )

  if (!pageKey) {
    notFound()
  }

  if (loading) {
    return (
      <>
        <Section className="bg-[gradient(to_right,rgba(0,0,0,0.6),rgba(0,0,0,0.2)),url('/images/bg/breadcrumb.jpg')] bg-cover bg-center">
          <Container>
            <div className='py-12'>
              <Skeleton className='bg-white/20 mb-4 w-3/4 h-12' />
            </div>
          </Container>
        </Section>

        <Section variant={'xl'}>
          <Container>
            <div className='space-y-6'>
              {/* Content loading skeletons */}
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

              <div className='space-y-4'>
                <Skeleton className='w-3/5 h-6' />
                <div className='space-y-3'>
                  <Skeleton className='w-full h-4' />
                  <Skeleton className='w-full h-4' />
                  <Skeleton className='w-2/3 h-4' />
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </>
    )
  }

  // Handle case when page is not found or has no content
  if (!data?.data) {
    notFound()
  }

  // Render page builder content
  const page = data.data

  // return <UnderConstruction />
  return (
    <>
      {/* <Section
        variant={'xs'}
        className="bg-cover bg-center __bg-[gradient(to_right,rgba(0,0,0,0.6),rgba(0,0,0,0.2)),url('/images/bg/breadcrumb.jpg')]"
      >
        <Container>
          <div className='py-12'>
            <Typography variant='h4' as='h1' weight='semibold'>
              {page?.title ?? page?.seo?.title ?? 'Page'}
            </Typography>
            {/* Breadcrumb/intro could go here */}
      {/* 
              {section.subtitle && (<Typography variant='h4' as='h2' className='text-xl md:text-2xl'>{section.subtitle}</Typography>)} 
              {section.description && (<Typography variant='body1' className='max-w-2xl text-lg'>{section.description}</Typography>)} 
    </div >
        </Container >
      </Section > */}

      <div className='space-y-6'>
        {page?.content ? (
          <PageBuilderRenderer content={page.content} />
        ) : (
          <div className='text-gray-600'>No content available</div>
        )}
      </div>
    </>
  )
}

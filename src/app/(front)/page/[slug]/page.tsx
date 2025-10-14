'use client'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { notFound, useParams } from 'next/navigation'

export default function DynamicPage() {
  const params = useParams()
  const pageKey = params.slug
  // const { data, loading } = useAsync<{ data: any }>(
  //   () => (pageKey ? `/settings/key/${pageKey}` : null),
  //   true
  // )

  if (!pageKey) {
    notFound()
  }

  // if (loading) {
  //   return (
  //     <>
  //       <Section className="bg-[linear-gradient(to_right,rgba(0,0,0,0.6),rgba(0,0,0,0.2)),url('/images/bg/breadcrumb.jpg')] bg-cover bg-center">
  //         <Container>
  //           <div className='py-12'>
  //             <Skeleton className='bg-white/20 mb-4 w-3/4 h-12' />
  //           </div>
  //         </Container>
  //       </Section>

  //       <Section variant={'xl'}>
  //         <Container>
  //           <div className='space-y-6'>
  //             {/* Content loading skeletons */}
  //             <div className='space-y-4'>
  //               <Skeleton className='w-2/3 h-8' />
  //               <div className='space-y-3'>
  //                 <Skeleton className='w-full h-4' />
  //                 <Skeleton className='w-full h-4' />
  //                 <Skeleton className='w-5/6 h-4' />
  //               </div>
  //             </div>

  //             <div className='space-y-4'>
  //               <Skeleton className='w-1/2 h-6' />
  //               <div className='space-y-3'>
  //                 <Skeleton className='w-full h-4' />
  //                 <Skeleton className='w-4/5 h-4' />
  //                 <Skeleton className='w-3/4 h-4' />
  //               </div>
  //             </div>

  //             <div className='space-y-4'>
  //               <Skeleton className='w-3/5 h-6' />
  //               <div className='space-y-3'>
  //                 <Skeleton className='w-full h-4' />
  //                 <Skeleton className='w-full h-4' />
  //                 <Skeleton className='w-2/3 h-4' />
  //               </div>
  //             </div>
  //           </div>
  //         </Container>
  //       </Section>
  //     </>
  //   )
  // }

  // Handle case when page is not found or has no content
  // if (!data?.data?.value) {
  //   notFound()
  // }

  return (
    <>
      <Section
        variant={'xs'}
        className="bg-cover bg-center __bg-[linear-gradient(to_right,rgba(0,0,0,0.6),rgba(0,0,0,0.2)),url('/images/bg/breadcrumb.jpg')]"
      >
        <Container>
          <div className='py-12'>
            <Typography variant='h4' as='h1' weight='semibold'>
              About
            </Typography>
            {/* 
              {section.subtitle && (<Typography variant='h4' as='h2' className='text-xl md:text-2xl'>{section.subtitle}</Typography>)} 
              {section.description && (<Typography variant='body1' className='max-w-2xl text-lg'>{section.description}</Typography>)} 
            */}
          </div>
        </Container>
      </Section>

      <Section variant={'sm'}>
        <Container>
          <div className='space-y-6'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam odit consequatur sunt
            odio non temporibus ex laboriosam tempora ducimus qui, ab nostrum recusandae, beatae
            voluptates libero voluptatum aspernatur suscipit cumque.
          </div>
        </Container>
      </Section>
    </>
  )
}

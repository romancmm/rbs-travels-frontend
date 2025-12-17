'use client'
import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'
import useAsync from '@/hooks/useAsync'
import { format } from 'date-fns'
import { Calendar, Tag } from 'lucide-react'

export default function ServiceDetails({ slug }: { slug?: string }) {
  const { data: serviceData } = useAsync(() => (slug ? `/services/slug/${slug}` : null), false)

  return (
    <div className='bg-background py-12 md:py-20'>
      <Container>
        {/* Service Header */}
        <div className='mx-auto mb-12 max-w-4xl'>
          {/* Category Badge */}
          {serviceData?.data?.category && (
            <div className='flex justify-center mb-6'>
              <div className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full font-semibold text-primary text-sm'>
                <Tag className='w-4 h-4' />
                {serviceData?.data?.category.name || serviceData?.data?.category.title}
              </div>
            </div>
          )}

          {/* Title */}
          <Typography
            variant='h2'
            as='h1'
            weight='bold'
            className='mb-6 text-foreground text-center'
          >
            {serviceData?.data?.title}
          </Typography>

          {/* Meta Information */}
          <div className='flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm'>
            {serviceData?.data?.createdAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <span>{format(new Date(serviceData?.data?.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {serviceData?.data?.thumbnail && (
          <div className='relative mx-auto mb-12 rounded-2xl w-full max-w-4xl overflow-hidden'>
            <div className='relative w-full aspect-video'>
              <CustomImage
                src={serviceData?.data?.thumbnail}
                alt={serviceData?.data?.title}
                fill
                className='object-cover'
              />
            </div>
          </div>
        )}

        {/* Service Content */}
        <div className='mx-auto max-w-4xl'>
          <div
            className='max-w-none prose prose-lg'
            dangerouslySetInnerHTML={{ __html: serviceData?.data?.content }}
          />
        </div>
      </Container>
    </div>
  )
}

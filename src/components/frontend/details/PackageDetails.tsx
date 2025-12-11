'use client'
import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'
import useAsync from '@/hooks/useAsync'
import { format } from 'date-fns'
import { Calendar, Clock, DollarSign, MapPin } from 'lucide-react'

export default function PackageDetails({ slug }: { slug?: string }) {
  const { data: packageData } = useAsync(() => (slug ? `/packages/slug/${slug}` : null), false)

  return (
    <div className='bg-background py-12 md:py-20'>
      <Container>
        {/* Package Header */}
        <div className='mx-auto mb-12 max-w-4xl'>
          {/* Title */}
          <Typography
            variant='h2'
            as='h1'
            weight='bold'
            className='mb-6 text-foreground text-center'
          >
            {packageData?.data?.title}
          </Typography>

          {/* Meta Information */}
          <div className='flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm'>
            {packageData?.data?.duration && (
              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                <span>{packageData?.data?.duration}</span>
              </div>
            )}

            {packageData?.data?.location && (
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4' />
                <span>{packageData?.data?.location}</span>
              </div>
            )}

            {packageData?.data?.price && (
              <div className='flex items-center gap-2'>
                <DollarSign className='w-4 h-4' />
                <span>{packageData?.data?.price}</span>
              </div>
            )}

            {packageData?.data?.createdAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <span>{format(new Date(packageData?.data?.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {packageData?.data?.thumbnail && (
          <div className='relative mx-auto mb-12 rounded-2xl w-full max-w-4xl overflow-hidden'>
            <div className='relative w-full aspect-video'>
              <CustomImage
                src={packageData?.data?.thumbnail}
                alt={packageData?.data?.title}
                fill
                className='object-cover'
              />
            </div>
          </div>
        )}

        {/* Package Content */}
        <div className='mx-auto max-w-4xl'>
          <div
            className='max-w-none prose prose-lg'
            dangerouslySetInnerHTML={{ __html: packageData?.data?.content }}
          />
        </div>
      </Container>
    </div>
  )
}

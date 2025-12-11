'use client'
import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'
import useAsync from '@/hooks/useAsync'
import { format } from 'date-fns'
import { Calendar, Tag } from 'lucide-react'

export default function ProductDetails({ slug }: { slug?: string }) {
  const { data: productData } = useAsync(() => (slug ? `/products/slug/${slug}` : null), false)

  return (
    <div className='bg-background py-12 md:py-20'>
      <Container>
        {/* Product Header */}
        <div className='mx-auto mb-12 max-w-4xl'>
          {/* Category Badge */}
          {productData?.data?.category && (
            <div className='flex justify-center mb-6'>
              <div className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full font-semibold text-primary text-sm'>
                <Tag className='w-4 h-4' />
                {productData?.data?.category.name || productData?.data?.category.title}
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
            {productData?.data?.title}
          </Typography>

          {/* Meta Information */}
          <div className='flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm'>
            {productData?.data?.createdAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <span>{format(new Date(productData?.data?.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {productData?.data?.thumbnail && (
          <div className='relative mx-auto mb-12 rounded-2xl w-full max-w-4xl overflow-hidden'>
            <div className='relative w-full aspect-video'>
              <CustomImage
                src={productData?.data?.thumbnail}
                alt={productData?.data?.title}
                fill
                className='object-cover'
              />
            </div>
          </div>
        )}

        {/* Product Content */}
        <div className='mx-auto max-w-4xl'>
          <div
            className='max-w-none prose prose-lg'
            dangerouslySetInnerHTML={{ __html: productData?.data?.content }}
          />
        </div>
      </Container>
    </div>
  )
}

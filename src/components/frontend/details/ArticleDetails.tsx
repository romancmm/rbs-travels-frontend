'use client'
import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { ImageLightbox } from '@/components/frontend/ImageLightbox'
import useAsync from '@/hooks/useAsync.hook'
import { format } from 'date-fns'
import { Calendar, Clock, Eye, Tag, User } from 'lucide-react'
import { useState } from 'react'

export default function ArticleDetails({ slug }: { slug?: string }) {
  const { data: articleData } = useAsync({
    path: slug ? `/articles/posts/slug/${slug}` : '',
    immediate: !!slug
  })
  console.log('articleData :>> ', articleData)
  const images: string[] = (articleData?.data?.gallery ?? []).filter(Boolean)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <Section>
        <Container>
          {/* Article Header */}
          <div className='mx-auto mb-12 max-w-4xl'>
            {/* Category Badge */}
            {articleData?.data?.category && (
              <div className='flex justify-center mb-6'>
                <div className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full font-semibold text-primary text-sm'>
                  <Tag className='w-4 h-4' />
                  {articleData?.data?.category.name || articleData?.data?.category.title}
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
              {articleData?.data?.title}
            </Typography>

            {/* Meta Information */}
            <div className='flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm'>
              {articleData?.data?.author && (
                <div className='flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  <span>{articleData?.data?.author?.name}</span>
                </div>
              )}

              {articleData?.data?.createdAt && (
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <span>{format(new Date(articleData?.data?.createdAt), 'MMMM dd, yyyy')}</span>
                </div>
              )}

              {articleData?.data?.readTime && (
                <div className='flex items-center gap-2'>
                  <Clock className='w-4 h-4' />
                  <span>{articleData?.data?.readTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {articleData?.data?.thumbnail && (
            <div className='relative mx-auto mb-12 rounded-2xl max-w-5xl overflow-hidden'>
              <div className='relative w-full aspect-video'>
                <CustomImage
                  src={articleData?.data?.thumbnail}
                  alt={articleData?.data?.title}
                  fill
                  className='object-cover'
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className='mx-auto max-w-4xl'>
            {/* Excerpt */}
            {articleData?.data?.excerpt && (
              <Typography variant='h5' className='mb-8 text-muted-foreground leading-relaxed'>
                {articleData?.data?.excerpt}
              </Typography>
            )}

            {/* Main Content */}
            {articleData?.data?.content && (
              <div
                className='dark:prose-invert mx-auto max-w-none prose prose-lg'
                dangerouslySetInnerHTML={{ __html: articleData?.data?.content }}
              />
            )}

            {/* Images */}
            {images.length > 0 && (
              <div className='gap-4 grid grid-cols-2 sm:grid-cols-3 mt-12'>
                {images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className='group relative rounded-xl aspect-square overflow-hidden cursor-pointer'
                    onClick={() => handleImageClick(index)}
                  >
                    <CustomImage
                      src={imageUrl}
                      alt={`${articleData?.data?.title} image ${index + 1}`}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                      sizes='(max-width: 640px) 50vw, 33vw'
                    />
                    <div className='absolute inset-0 flex justify-center items-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300'>
                      <Eye className='w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {articleData?.data?.tags && articleData?.data?.tags.length > 0 && (
              <div className='flex flex-wrap items-center gap-3 mt-12 pt-8 border-border border-t'>
                <Typography variant='body2' weight='semibold'>
                  Tags:
                </Typography>
                {articleData?.data?.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className='bg-muted hover:bg-muted/80 px-3 py-1 rounded-full text-muted-foreground text-sm transition-colors'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </Container>
      </Section>

      {/* Image Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={selectedImageIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}

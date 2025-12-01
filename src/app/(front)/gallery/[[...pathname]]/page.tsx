'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { ImageLightbox } from '@/components/frontend/ImageLightbox'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Eye, Image as ImageIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'

interface FileItem {
  type: 'file' | 'folder'
  name: string
  createdAt: string
  updatedAt: string
  fileId: string
  url?: string
  thumbnail?: string
  fileType?: 'image' | 'non-image'
  filePath: string
  height?: number
  width?: number
  size?: number
  mime?: string
}

interface GalleryPageProps {
  params: {
    pathname?: string[]
  }
}

export default function GalleryPage({ params }: GalleryPageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Convert pathname array to folder path
  // e.g., ['folder1', 'folder2'] -> '/folder1/folder2'
  const folderPath = useMemo(() => {
    if (!params.pathname || params.pathname.length === 0) {
      return '/'
    }
    return `/${params.pathname.join('/')}`
  }, [params.pathname])

  // Get display name (last segment of path)
  const displayName = useMemo(() => {
    if (!params.pathname || params.pathname.length === 0) {
      return 'Gallery'
    }
    const lastName = params.pathname[params.pathname.length - 1]
    return decodeURIComponent(lastName)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }, [params.pathname])

  // Build API path for the gallery folder
  const apiPath = useMemo(() => {
    const encodedPath = encodeURIComponent(folderPath)
    return `/media?path=${encodedPath}&page=1&perPage=100&fileType=image`
  }, [folderPath])

  const { data, loading } = useAsync<{
    items: FileItem[]
    files: FileItem[]
    folders: FileItem[]
    page: string
    perPage: string
    hasMore: boolean
    totalEstimate: number
    currentPath: string
  }>(apiPath, true)

  // Filter only images from items or files array
  const images = useMemo(() => {
    const itemsArray = data?.items || data?.files || []
    return itemsArray.filter((item) => item.type === 'file' && item.fileType === 'image')
  }, [data])

  // Extract image URLs for lightbox
  const imageUrls = useMemo(() => {
    return images.map((img) => img.url || img.thumbnail || '')
  }, [images])

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
  }

  if (loading) {
    return (
      <>
        <Section className='bg-linear-to-r from-primary/90 to-primary/70'>
          <Container>
            <div className='py-12 text-center'>
              <Skeleton className='bg-white/20 mx-auto mb-4 w-3/4 h-12' />
              <Skeleton className='bg-white/20 mx-auto w-1/2 h-6' />
            </div>
          </Container>
        </Section>

        <Section variant={'xl'}>
          <Container>
            <div className='gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className='rounded-lg w-full h-64' />
              ))}
            </div>
          </Container>
        </Section>
      </>
    )
  }

  if (images.length === 0) {
    return (
      <>
        <Section className='bg-linear-to-r from-primary/90 to-primary/70'>
          <Container>
            <div className='py-12 text-white text-center'>
              <Typography variant='h1' weight='bold' className='mb-4'>
                {displayName}
              </Typography>
              <Typography variant='body1' className='opacity-90'>
                Gallery Collection
              </Typography>
            </div>
          </Container>
        </Section>

        <Section variant={'xl'}>
          <Container>
            <div className='flex flex-col justify-center items-center py-16 text-center'>
              <ImageIcon className='mb-4 w-16 h-16 text-muted-foreground' />
              <Typography variant='h4' weight='semibold' className='mb-2 text-gray-800'>
                No Images Found
              </Typography>
              <Typography variant='body1' className='text-gray-600'>
                This gallery folder doesn&apos;t contain any images yet.
              </Typography>
            </div>
          </Container>
        </Section>
      </>
    )
  }

  return (
    <>
      {/* Header Section */}
      <Section className='bg-linear-to-r from-primary/90 to-primary/70'>
        <Container>
          <motion.div
            className='py-12 text-white text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant='h1' weight='bold' className='mb-4'>
              {displayName}
            </Typography>
            <Typography variant='body1' className='opacity-90 mx-auto max-w-2xl'>
              Explore our collection of {images.length} beautiful{' '}
              {images.length === 1 ? 'image' : 'images'}
            </Typography>
          </motion.div>
        </Container>
      </Section>

      {/* Gallery Grid Section */}
      <Section variant={'xl'}>
        <Container>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {images.map((image, index) => (
              <motion.div
                key={image.fileId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className='group relative rounded-lg aspect-square overflow-hidden cursor-pointer'
                onClick={() => handleImageClick(index)}
              >
                {/* Image */}
                <div className='relative w-full h-full'>
                  <CustomImage
                    src={image.thumbnail || image.url || ''}
                    alt={image.name}
                    fill
                    className='rounded-lg object-cover group-hover:scale-110 transition-transform duration-300'
                    sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw'
                  />
                </div>

                {/* Overlay */}
                <div
                  className={cn(
                    'absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0',
                    'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                    'flex flex-col justify-end p-4'
                  )}
                >
                  <div className='flex justify-between items-end'>
                    <div className='flex-1 min-w-0'>
                      <Typography
                        variant='body2'
                        weight='medium'
                        className='text-white truncate'
                        title={image.name}
                      >
                        {image.name}
                      </Typography>
                      {image.width && image.height && (
                        <Typography variant='body2' className='text-white/80 text-xs'>
                          {image.width} × {image.height}
                        </Typography>
                      )}
                    </div>

                    <div className='flex justify-center items-center bg-white/20 backdrop-blur-sm ml-2 rounded-full w-8 h-8'>
                      <Eye className='w-4 h-4 text-white' />
                    </div>
                  </div>
                </div>

                {/* Loading Shimmer Effect */}
                <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:animate-shimmer' />
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Image Lightbox */}
      <ImageLightbox
        images={imageUrls}
        initialIndex={selectedImageIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}

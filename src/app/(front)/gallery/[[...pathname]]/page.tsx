'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { ImageLightbox } from '@/components/frontend/ImageLightbox'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Eye, Folder, Image as ImageIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import React, { use, useState } from 'react'

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
  children?: FileItem[]
}

interface GalleryPageProps {
  params: Promise<{
    pathname?: string[]
  }>
}

export default function GalleryPage({ params }: GalleryPageProps) {
  const resolvedParams = use(params)

  return <GalleryContent params={resolvedParams} />
}

function GalleryContent({ params }: { params: { pathname?: string[] } }) {
  const router = useRouter()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [folderPreviews, setFolderPreviews] = useState<Record<string, FileItem[]>>({})

  // Convert pathname array to folder path
  // e.g., ['folder1', 'folder2'] -> '/folder1/folder2'
  const folderPath = !params.pathname || params.pathname.length === 0
    ? '/'
    : `/${params.pathname.join('/')}`

  // Get display name (last segment of path)
  const displayName = (() => {
    if (!params.pathname || params.pathname.length === 0) {
      return 'Gallery'
    }
    const lastName = params.pathname[params.pathname.length - 1]
    return decodeURIComponent(lastName)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
  })()

  // Build API path for the gallery folder
  const encodedPath = encodeURIComponent(folderPath)
  const apiPath = `/media?path=${encodedPath}&page=1&perPage=100`

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

  // Filter folders and images from items
  const folders = (() => {
    const itemsArray = data?.items || data?.files || []
    return itemsArray.filter((item) => item.type === 'folder')
  })()

  const images = (() => {
    const itemsArray = data?.items || data?.files || []
    return itemsArray.filter((item) => item.type === 'file' && item.fileType === 'image')
  })()

  // Extract image URLs for lightbox
  const imageUrls = images.map((img) => img.url || img.thumbnail || '')

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
  }

  const handleFolderClick = (folder: FileItem) => {
    router.push(`/gallery/${folder.filePath}`)
  }

  // Load folder previews when folders change
  React.useEffect(() => {
    const fetchFolderPreviews = async () => {
      if (!folders.length) return

      const previews: Record<string, FileItem[]> = {}

      await Promise.all(
        folders.map(async (folder) => {
          try {
            const encodedFolderPath = encodeURIComponent(folder.filePath)
            const previewUrl = `/media?path=${encodedFolderPath}&page=1&perPage=4`
            console.log('Fetching preview for folder:', folder.name, 'URL:', previewUrl)

            const response = await fetch(previewUrl)

            if (!response.ok) {
              console.error(`Failed to fetch preview for ${folder.name}:`, response.status)
              return
            }

            const folderData = await response.json()
            console.log('Preview data for', folder.name, ':', folderData)

            const folderImages = (folderData?.items || folderData?.files || [])
              .filter((item: FileItem) => item.type === 'file' && item.fileType === 'image')
              .slice(0, 4)

            if (folderImages.length > 0) {
              previews[folder.fileId] = folderImages
            }
          } catch (error) {
            console.error(`Failed to fetch preview for ${folder.name}:`, error)
          }
        })
      )

      setFolderPreviews(previews)
    }

    if (folders.length > 0 && !loading) {
      fetchFolderPreviews()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folders.length, loading])

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

  if (images.length === 0 && folders.length === 0) {
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
                No Content Found
              </Typography>
              <Typography variant='body1' className='text-gray-600'>
                This gallery folder doesn&apos;t contain any images or folders yet.
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
              {folders.length > 0 && images.length > 0
                ? `${folders.length} ${folders.length === 1 ? 'folder' : 'folders'} • ${images.length} ${images.length === 1 ? 'image' : 'images'}`
                : folders.length > 0
                  ? `${folders.length} ${folders.length === 1 ? 'folder' : 'folders'}`
                  : `${images.length} ${images.length === 1 ? 'image' : 'images'}`}
            </Typography>
          </motion.div>
        </Container>
      </Section>

      {/* Gallery Grid Section */}
      <Section variant={'xl'}>
        <Container>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {/* Folders */}
            {folders.map((folder, index) => {
              const previewImages = folderPreviews[folder.fileId] || []
              const hasPreview = previewImages.length > 0

              return (
                <motion.div
                  key={folder.fileId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className='group relative border-2 border-primary/20 hover:border-primary/40 rounded-lg aspect-square overflow-hidden transition-all duration-300 cursor-pointer'
                  onClick={() => handleFolderClick(folder)}
                >
                  {hasPreview ? (
                    // Preview Grid: Show up to 4 images in a 2x2 grid
                    <div className='relative bg-gray-100 w-full h-full'>
                      {previewImages.length === 1 ? (
                        // Single image preview
                        <div className='relative w-full h-full'>
                          <CustomImage
                            src={previewImages[0].thumbnail || previewImages[0].url || ''}
                            alt={folder.name}
                            fill
                            className='object-cover'
                            sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw'
                          />
                        </div>
                      ) : (
                        // Grid preview (2x2)
                        <div className='gap-0.5 grid grid-cols-2 w-full h-full'>
                          {previewImages.slice(0, 4).map((img, idx) => (
                            <div key={idx} className='relative bg-gray-200 w-full h-full'>
                              <CustomImage
                                src={img.thumbnail || img.url || ''}
                                alt={`${folder.name} preview ${idx + 1}`}
                                fill
                                className='object-cover'
                                sizes='(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, (max-width: 1280px) 12vw, 10vw'
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Overlay gradient */}
                      <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
                    </div>
                  ) : (
                    // Default folder icon when no preview available
                    <div className='flex flex-col justify-center items-center bg-linear-to-br from-primary/10 group-hover:from-primary/20 to-primary/5 group-hover:to-primary/10 w-full h-full transition-all duration-300'>
                      <div className='flex justify-center items-center bg-white shadow-md group-hover:shadow-lg rounded-full w-20 h-20 transition-all duration-300'>
                        <Folder className='w-10 h-10 text-primary' />
                      </div>
                    </div>
                  )}

                  {/* Folder Name Label */}
                  <div className='right-0 bottom-0 left-0 absolute bg-linear-to-t from-black/80 to-transparent p-3'>
                    <div className='flex items-center gap-2'>
                      <Folder className='w-4 h-4 text-white/90 shrink-0' />
                      <Typography
                        variant='body2'
                        weight='medium'
                        className='text-white truncate'
                        title={folder.name}
                      >
                        {folder.name}
                      </Typography>
                    </div>
                    {hasPreview && (
                      <Typography variant='body2' className='mt-0.5 text-white/70 text-xs'>
                        {previewImages.length} {previewImages.length === 1 ? 'image' : 'images'}
                      </Typography>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className='absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </motion.div>
              )
            })}

            {/* Images */}
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

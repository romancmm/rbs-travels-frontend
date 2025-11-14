'use client'

import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { Folder, Image as ImageIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useMemo } from 'react'

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
}

export default function GalleriesPage() {
    // Build API path for the gallery root folder
    const { data, loading } = useAsync<{
        folders: FileItem[]
        items: FileItem[]
        page: string
        perPage: string
        hasMore: boolean
        totalEstimate: number
        currentPath: string
    }>(() => '/media?page=1&perPage=50&fileType=all', true)

    console.log('GalleriesPage data:', data);

    // Get folders from API response
    const galleries = useMemo(() => {
        if (!data?.folders) return []
        return data.folders.filter((item) => item.type === 'folder')
    }, [data?.folders])

    if (loading) {
        return (
            <>
                <Section className="bg-linear-to-r from-primary/90 to-primary/70">
                    <Container>
                        <div className='py-12 text-center'>
                            <Skeleton className='bg-white/20 mx-auto mb-4 w-3/4 h-12' />
                            <Skeleton className='bg-white/20 mx-auto w-1/2 h-6' />
                        </div>
                    </Container>
                </Section>

                <Section variant={'xl'}>
                    <Container>
                        <div className='gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className='rounded-lg w-full h-64' />
                            ))}
                        </div>
                    </Container>
                </Section>
            </>
        )
    }

    if (!data?.folders || galleries.length === 0) {
        return (
            <>
                <Section className="bg-linear-to-r from-primary/90 to-primary/70">
                    <Container>
                        <div className='py-12 text-white text-center'>
                            <Typography variant='h1' weight='bold' className='mb-4'>
                                Our Galleries
                            </Typography>
                            <Typography variant='body1' className='opacity-90'>
                                Explore our collection of photo galleries
                            </Typography>
                        </div>
                    </Container>
                </Section>

                <Section variant={'xl'}>
                    <Container>
                        <div className='flex flex-col justify-center items-center py-16 text-center'>
                            <Folder className='mb-4 w-16 h-16 text-muted-foreground' />
                            <Typography variant='h4' weight='semibold' className='mb-2 text-gray-800'>
                                No Galleries Found
                            </Typography>
                            <Typography variant='body1' className='text-gray-600'>
                                There are no galleries available at the moment.
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
            <Section className="bg-linear-to-r from-primary/90 to-primary/70">
                <Container>
                    <motion.div
                        className='py-12 text-white text-center'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant='h1' weight='bold' className='mb-4'>
                            Our Galleries
                        </Typography>
                        <Typography variant='body1' className='opacity-90 mx-auto max-w-2xl'>
                            Browse through our collection of {galleries.length}{' '}
                            {galleries.length === 1 ? 'gallery' : 'galleries'}
                        </Typography>
                    </motion.div>
                </Container>
            </Section>

            {/* Galleries Grid Section */}
            <Section variant={'xl'}>
                <Container>
                    <div className='gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {galleries.map((gallery, index) => {
                            const folderName = gallery.name
                            const displayName = folderName
                                .replace(/-/g, ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase())

                            return (
                                <motion.div
                                    key={gallery.fileId}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link
                                        href={`/gallery/${folderName}`}
                                        className='group block relative bg-white shadow-lg hover:shadow-xl border border-gray-100 rounded-xl overflow-hidden transition-all duration-300'
                                    >
                                        {/* Gallery Thumbnail */}
                                        <div className='relative bg-linear-to-br from-primary/10 to-primary/5 w-full h-48 overflow-hidden'>
                                            <div className='flex justify-center items-center w-full h-full'>
                                                <div className='flex justify-center items-center bg-primary/10 group-hover:bg-primary/20 rounded-full w-20 h-20 transition-colors duration-300'>
                                                    <ImageIcon className='w-10 h-10 text-primary' />
                                                </div>
                                            </div>

                                            {/* Overlay on hover */}
                                            <div
                                                className={cn(
                                                    'absolute inset-0 bg-linear-to-t from-black/40 to-transparent',
                                                    'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                                )}
                                            />
                                        </div>

                                        {/* Gallery Info */}
                                        <div className='p-4'>
                                            <Typography variant='h6' weight='bold' className='mb-2 text-gray-800'>
                                                {displayName}
                                            </Typography>

                                            <div className='flex items-center gap-2 text-gray-600'>
                                                <Folder className='w-4 h-4' />
                                                <Typography variant='body2'>Gallery</Typography>
                                            </div>
                                        </div>

                                        {/* Hover indicator */}
                                        <div className='bottom-0 absolute inset-x-0 bg-primary opacity-0 group-hover:opacity-100 h-1 transition-opacity duration-300' />
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </Container>
            </Section>
        </>
    )
}

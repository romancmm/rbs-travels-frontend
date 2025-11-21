'use client'

import CustomImage from '@/components/common/CustomImage'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Download, X, ZoomIn, ZoomOut } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'

interface ImageLightboxProps {
    images: string[]
    initialIndex?: number
    open: boolean
    onClose: () => void
}

export function ImageLightbox({ images, initialIndex = 0, open, onClose }: ImageLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [zoom, setZoom] = useState(1)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        setCurrentIndex(initialIndex)
        setZoom(1)
    }, [initialIndex, open])

    const handlePrevious = useCallback(() => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
        setZoom(1)
    }, [images.length])

    const handleNext = useCallback(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
        setZoom(1)
    }, [images.length])

    const handleZoomIn = useCallback(() => {
        setZoom((prev) => Math.min(prev + 0.25, 3))
    }, [])

    const handleZoomOut = useCallback(() => {
        setZoom((prev) => Math.max(prev - 0.25, 0.5))
    }, [])

    const handleDownload = useCallback(() => {
        const link = document.createElement('a')
        link.href = images[currentIndex]
        link.download = `image-${currentIndex + 1}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }, [images, currentIndex])

    // Keyboard navigation
    useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    handlePrevious()
                    break
                case 'ArrowRight':
                    handleNext()
                    break
                case 'Escape':
                    onClose()
                    break
                case '+':
                case '=':
                    handleZoomIn()
                    break
                case '-':
                    handleZoomOut()
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, handlePrevious, handleNext, handleZoomIn, handleZoomOut, onClose])

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        })
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='flex flex-col justify-center items-center bg-black/95 p-0 w-full max-w-screen-2xl h-screen overflow-hidden'>
                {/* Close Button */}
                <Button
                    variant='ghost'
                    size='icon'
                    className='top-4 right-4 z-50 absolute hover:bg-white/20 rounded-full text-white'
                    onClick={onClose}
                >
                    <X className='w-6 h-6' />
                </Button>

                {/* Image Counter */}
                <div className='top-4 left-1/2 z-50 absolute bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm -translate-x-1/2'>
                    {currentIndex + 1} / {images.length}
                </div>

                {/* Main Image Container */}
                <div className='relative flex flex-1 justify-center items-center w-full h-full overflow-hidden'>
                    <AnimatePresence initial={false} custom={direction} mode='wait'>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial='enter'
                            animate='center'
                            exit='exit'
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 }
                            }}
                            drag='x'
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x)

                                if (swipe < -swipeConfidenceThreshold) {
                                    handleNext()
                                } else if (swipe > swipeConfidenceThreshold) {
                                    handlePrevious()
                                }
                            }}
                            className='absolute flex justify-center items-center w-full h-full cursor-grab active:cursor-grabbing'
                            style={{ scale: zoom }}
                        >
                            <div className='relative w-full max-w-7xl h-full max-h-full'>
                                <CustomImage
                                    src={images[currentIndex]}
                                    alt={`Image ${currentIndex + 1}`}
                                    fill
                                    className='object-contain select-none'
                                    sizes='100vw'
                                    priority
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='top-1/2 left-4 z-40 absolute hover:bg-white/20 rounded-full w-12 h-12 text-white -translate-y-1/2'
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className='w-8 h-8' />
                        </Button>

                        <Button
                            variant='ghost'
                            size='icon'
                            className='top-1/2 right-4 z-40 absolute hover:bg-white/20 rounded-full w-12 h-12 text-white -translate-y-1/2'
                            onClick={handleNext}
                        >
                            <ChevronRight className='w-8 h-8' />
                        </Button>
                    </>
                )}

                {/* Bottom Controls */}
                <div className='bottom-4 left-1/2 z-50 absolute flex gap-2 bg-black/60 backdrop-blur-sm p-2 rounded-full -translate-x-1/2'>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hover:bg-white/20 rounded-full w-10 h-10 text-white'
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                    >
                        <ZoomOut className='w-5 h-5' />
                    </Button>

                    <div className='flex justify-center items-center px-3 min-w-16 text-white text-sm'>
                        {Math.round(zoom * 100)}%
                    </div>

                    <Button
                        variant='ghost'
                        size='icon'
                        className='hover:bg-white/20 rounded-full w-10 h-10 text-white'
                        onClick={handleZoomIn}
                        disabled={zoom >= 3}
                    >
                        <ZoomIn className='w-5 h-5' />
                    </Button>

                    <div className='bg-white/20 mx-2 w-px h-10' />

                    <Button
                        variant='ghost'
                        size='icon'
                        className='hover:bg-white/20 rounded-full w-10 h-10 text-white'
                        onClick={handleDownload}
                    >
                        <Download className='w-5 h-5' />
                    </Button>
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className='bottom-20 left-1/2 z-50 absolute flex gap-2 bg-black/60 backdrop-blur-sm p-2 rounded-full max-w-xl overflow-x-auto -translate-x-1/2'>
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1)
                                    setCurrentIndex(index)
                                    setZoom(1)
                                }}
                                className={cn(
                                    'relative rounded-lg w-16 h-16 overflow-hidden transition-all duration-200 shrink-0',
                                    currentIndex === index
                                        ? 'ring-2 ring-white scale-110'
                                        : 'opacity-50 hover:opacity-100'
                                )}
                            >
                                <CustomImage
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className='object-cover'
                                    sizes='64px'
                                />
                            </button>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

'use client'

import lightGallery from 'lightgallery'
import type { LightGallery } from 'lightgallery/lightgallery'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import lgFullscreen from 'lightgallery/plugins/fullscreen'
import lgRotate from 'lightgallery/plugins/rotate'
import lgShare from 'lightgallery/plugins/share'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import { useEffect, useRef } from 'react'

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  open: boolean
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex = 0, open, onClose }: ImageLightboxProps) {
  const lightboxRef = useRef<HTMLDivElement>(null)
  const galleryInstanceRef = useRef<LightGallery | null>(null)

  useEffect(() => {
    if (!lightboxRef.current) return

    // Initialize LightGallery
    const instance = lightGallery(lightboxRef.current, {
      dynamic: true,
      dynamicEl: images.map((img, index) => ({
        src: img,
        thumb: img,
        subHtml: `<h4>Image ${index + 1}</h4>`
      })),
      plugins: [lgThumbnail, lgZoom, lgFullscreen, lgShare, lgAutoplay, lgRotate],
      speed: 500,
      thumbnail: true,
      animateThumb: true,
      thumbWidth: 100,
      thumbHeight: '80px',
      thumbMargin: 5,
      allowMediaOverlap: true,
      toggleThumb: true,
      download: true,
      counter: true,
      zoom: true,
      actualSize: true,
      fullScreen: true,
      slideEndAnimation: true,
      hideScrollbar: true,
      closable: true,
      closeOnTap: true,
      swipeToClose: true,
      mousewheel: true,
      getCaptionFromTitleOrAlt: false,
      appendSubHtmlTo: '.lg-item'
    })

    galleryInstanceRef.current = instance

    // Handle close event using instance method
    const handleClose = () => {
      onClose()
    }

    // Add event listener using LightGallery event system
    instance.LGel.on('lgAfterClose.custom', handleClose)

    // Cleanup
    return () => {
      instance.LGel.off('lgAfterClose.custom')
      instance.destroy()
      galleryInstanceRef.current = null
    }
  }, [images, onClose])

  // Open gallery when open prop changes
  useEffect(() => {
    if (open && galleryInstanceRef.current) {
      galleryInstanceRef.current.openGallery(initialIndex)
    }
  }, [open, initialIndex])

  return <div ref={lightboxRef} />
}

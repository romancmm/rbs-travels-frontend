'use client'
import { defaultImg } from '@/lib/get-image-url'
import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'

type CustomImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string | null | undefined
  alt: string
  fallback?: string
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width,
  height,
  fallback,
  className,
  ...props
}) => {
  const fallbackImg = defaultImg({
    width: Number(width) || 100,
    height: Number(height) || 100
  })
  const finalSrc =
    src && typeof src === 'string' && src.startsWith('/files')
      ? process.env.NEXT_PUBLIC_BASE_API + src
      : src || fallbackImg
  return (
    <Image
      src={finalSrc}
      alt={alt || 'Image'}
      width={width}
      height={height}
      className={cn(className)}
      placeholder='blur'
      blurDataURL={fallbackImg}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const img = e.currentTarget
        if (img.src !== fallbackImg && img.src !== fallback) {
          img.srcset = ''
          img.src = fallbackImg
        }
      }}
      {...props}
    />
  )
}

export default CustomImage

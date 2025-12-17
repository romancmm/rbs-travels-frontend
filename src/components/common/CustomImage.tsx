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
  // sensible defaults when caller doesn't provide sizing and doesn't use `fill`
  const DEFAULT_WIDTH = 800
  const DEFAULT_HEIGHT = 600

  // normalize numeric width/height to use for fallback and to pass to next/image
  const numericWidth = typeof width === 'number' ? width : Number(width ?? DEFAULT_WIDTH)
  const numericHeight = typeof height === 'number' ? height : Number(height ?? DEFAULT_HEIGHT)

  const fallbackImg = defaultImg({
    width: numericWidth || DEFAULT_WIDTH,
    height: numericHeight || DEFAULT_HEIGHT
  })
  const finalSrc =
    src && typeof src === 'string' && src.startsWith('/files')
      ? process.env.NEXT_PUBLIC_BASE_API + src
      : src || fallbackImg
  const imageProps: any = {
    src: finalSrc,
    alt: alt || 'Image',
    className: cn(className),
    placeholder: 'blur',
    blurDataURL: fallbackImg,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.currentTarget
      if (img.src !== fallbackImg && img.src !== fallback) {
        img.srcset = ''
        img.src = fallbackImg
      }
    }
  }

  // If caller requested `fill`, do not pass width/height (Next/Image will error)
  if (props.fill) {
    imageProps.fill = true
  } else {
    // Ensure next/image receives numeric width/height; if caller omitted them, use defaults
    imageProps.width = numericWidth || DEFAULT_WIDTH
    imageProps.height = numericHeight || DEFAULT_HEIGHT
  }

  // Spread remaining props (like priority, quality, etc.)
  Object.assign(imageProps, props)

  const { alt: _alt, ...rest } = imageProps

  // Provide alt explicitly (ESLint rule requires explicit alt prop)
  return <Image alt={_alt} {...rest} />
}

export default CustomImage

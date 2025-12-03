import CustomImage from '@/components/common/CustomImage'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as LucideIcons from 'lucide-react'

const iconOrImageVariants = cva('transition-all duration-300', {
  variants: {
    size: {
      xs: 'w-4 h-4',
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
      '2xl': 'w-20 h-20',
      '3xl': 'w-24 h-24'
    },
    variant: {
      default: '',
      rounded: 'rounded-lg',
      circle: 'rounded-full',
      contained: 'p-2 bg-primary/10 rounded-lg',
      gradient: 'p-3 bg-linear-to-br from-primary to-primary/80 rounded-xl shadow-lg'
    }
  },
  defaultVariants: {
    size: 'md',
    variant: 'default'
  }
})

const iconColorVariants = cva('', {
  variants: {
    color: {
      default: 'text-current',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-green-600',
      warning: 'text-amber-600',
      danger: 'text-red-600',
      muted: 'text-muted-foreground',
      white: 'text-white',
      inherit: 'text-inherit'
    }
  },
  defaultVariants: {
    color: 'default'
  }
})

export interface IconOrImageProps extends VariantProps<typeof iconOrImageVariants> {
  icon?: string
  alt?: string
  className?: string
  iconClassName?: string
  strokeWidth?: number
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'muted'
    | 'white'
    | 'inherit'
}

/**
 * IconOrImage Component
 *
 * Renders either a Lucide icon or an image based on the icon prop value.
 * Automatically detects if the icon is a Lucide icon name or an image URL.
 *
 * @param icon - Icon name (Lucide) or image URL
 * @param alt - Alt text for images (defaults to 'Icon')
 * @param size - Size variant (xs, sm, md, lg, xl, 2xl, 3xl)
 * @param variant - Style variant (default, rounded, circle, contained, gradient)
 * @param color - Icon color (only applies to Lucide icons)
 * @param className - Additional classes for the wrapper
 * @param iconClassName - Additional classes for the icon/image element
 * @param strokeWidth - Stroke width for Lucide icons
 */
export function IconOrImage({
  icon,
  alt = 'Icon',
  size = 'md',
  variant = 'default',
  color = 'default',
  className,
  iconClassName,
  strokeWidth = 2
}: IconOrImageProps) {
  if (!icon) return null

  // Check if icon is a Lucide icon name
  const isLucideIcon = (iconName: string): iconName is keyof typeof LucideIcons => {
    if (iconName in LucideIcons) return true
    // Check PascalCase version
    const pascalCase = iconName.charAt(0).toUpperCase() + iconName.slice(1)
    return pascalCase in LucideIcons
  }

  // Helper to get the numeric size for images
  const getSizeInPixels = (size: string): number => {
    const sizeMap: Record<string, number> = {
      xs: 16,
      sm: 24,
      md: 32,
      lg: 48,
      xl: 64,
      '2xl': 80,
      '3xl': 96
    }
    return sizeMap[size] || 32
  }

  const wrapperClasses = cn(
    'inline-flex justify-center items-center',
    variant === 'contained' || variant === 'gradient' ? iconOrImageVariants({ size: 'md' }) : '',
    className
  )

  const elementClasses = cn(
    iconOrImageVariants({
      size,
      variant: variant === 'contained' || variant === 'gradient' ? 'default' : variant
    }),
    iconClassName
  )

  // Render Lucide Icon
  if (isLucideIcon(icon)) {
    const iconName = (
      icon in LucideIcons ? icon : icon.charAt(0).toUpperCase() + icon.slice(1)
    ) as keyof typeof LucideIcons
    const IconComponent = LucideIcons[iconName] as React.ComponentType<{
      className?: string
      strokeWidth?: number
    }>

    if (!IconComponent) return null

    const iconColorClass = iconColorVariants({ color })

    return (
      <div className={wrapperClasses}>
        <IconComponent className={cn(elementClasses, iconColorClass)} strokeWidth={strokeWidth} />
      </div>
    )
  }

  // Check if it's a valid URL or path (starts with /, http://, https://, or data:)
  const isValidImagePath = (path: string): boolean => {
    return (
      path.startsWith('/') ||
      path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('data:')
    )
  }

  // If not a Lucide icon and not a valid image path, return null or fallback
  if (!isValidImagePath(icon)) {
    console.warn(`Invalid icon: "${icon}" is neither a Lucide icon nor a valid image path`)
    return null
  }

  // Render Image
  const pixelSize = getSizeInPixels(size || 'md')

  return (
    <div className={wrapperClasses}>
      <CustomImage
        src={icon}
        alt={alt}
        width={pixelSize}
        height={pixelSize}
        className={elementClasses}
      />
    </div>
  )
}

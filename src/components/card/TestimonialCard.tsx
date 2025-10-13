import { cn } from '@/lib/utils'
import { HomepageTestimonialType } from '@/lib/validations/schemas/testimonialSettings'
import { renderStars } from '@/utils/renderStarts'
import { cva, type VariantProps } from 'class-variance-authority'
import CustomImage from '../common/CustomImage'
import { Typography } from '../common/typography'

// Type for individual testimonial items
type TestimonialItem = NonNullable<HomepageTestimonialType['testimonials']>[number]

const testimonialCardVariants = cva(
  'group flex justify-start gap-3 hover:shadow-md p-3 border border-muted-foreground lg:border-border rounded-lg h-full transition-shadow',
  {
    variants: {
      variant: {
        default: 'lg:flex-row flex-col max-sm:flex-col lg:items-center cursor-grab select-none',
        fancy: 'flex-col max-sm:flex-col bg-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const contentVariants = cva('flex flex-col flex-1 space-y-2 lg:space-y-4', {
  variants: {
    variant: {
      default: '',
      fancy: ''
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const feedbackVariants = cva('flex-1 font-manrope leading-relaxed', {
  variants: {
    variant: {
      default: 'text-sm lg:text-base',
      fancy: 'text-sm lg:text-base'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const authorInfoVariants = cva('flex items-center gap-3', {
  variants: {
    variant: {
      default: 'max-md:pt-2 border-muted-foreground/50 max-md:border-t',
      fancy: 'space-x-4'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const avatarContainerVariants = cva('', {
  variants: {
    variant: {
      default: 'hidden lg:block',
      fancy: ''
    },
    position: {
      desktop: 'hidden lg:block',
      mobile: 'block lg:hidden',
      inline: ''
    }
  },
  defaultVariants: {
    variant: 'default',
    position: 'desktop'
  }
})

export interface TestimonialCardProps extends VariantProps<typeof testimonialCardVariants> {
  item: TestimonialItem
}

// Separate UserAvatar component that handles both desktop and mobile views
const UserAvatar = ({
  avatar,
  name,
  size = 'medium',
  className = ''
}: {
  avatar?: string
  name?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 lg:w-24 h-16 lg:h-24'
  }

  const imageSize = {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 100, height: 100 }
  }

  return (
    <div
      className={cn(
        'inline-flex flex-shrink-0 bg-primary/10 rounded-full aspect-square overflow-hidden text-primary',
        sizeClasses[size],
        className
      )}
    >
      <CustomImage
        src={avatar || ''}
        width={imageSize[size].width}
        height={imageSize[size].height}
        alt={name || 'User'}
        className='rounded-full w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
      />
    </div>
  )
}

// Reusable components with variant support
const TestimonialFeedback = ({
  content,
  variant
}: {
  content?: string
  variant: 'default' | 'fancy'
}) => (
  <Typography variant='body2' className={cn(feedbackVariants({ variant }))}>
    &ldquo;{content || 'No review provided'}&rdquo;
  </Typography>
)

const TestimonialRating = ({
  rating,
  variant
}: {
  rating?: number
  variant: 'default' | 'fancy'
}) => (
  <div className='flex justify-start lg:justify-start'>
    {renderStars(rating || 0, variant === 'fancy' ? 18 : 22)}
  </div>
)

const AuthorName = ({ name, variant }: { name?: string; variant: 'default' | 'fancy' }) => (
  <Typography variant={variant === 'fancy' ? 'h5' : 'body2'} weight='semibold'>
    {name || 'Anonymous'}
  </Typography>
)

const AuthorRole = ({
  designation,
  company,
  variant
}: {
  designation?: string
  company?: string
  variant: 'default' | 'fancy'
}) => (
  <Typography
    variant='body2'
    className={variant === 'fancy' ? 'text-muted-foreground' : 'lg:font-semibold max-lg:text-xs!'}
  >
    {variant === 'fancy' && designation
      ? `${designation} at ${company || 'Company'}`
      : company || 'Company'}
  </Typography>
)

export default function TestimonialCard({ item, variant = 'default' }: TestimonialCardProps) {
  const isFancy = variant === 'fancy'
  const safeVariant = variant || 'default'

  return (
    <div className={cn(testimonialCardVariants({ variant: safeVariant }))}>
      {/* Avatar - Desktop/Inline for fancy, Desktop only for default */}
      {isFancy ? (
        <div className={cn(authorInfoVariants({ variant: safeVariant }))}>
          <UserAvatar avatar={item?.avatar} name={item?.name} size='large' />
          <div>
            <AuthorName name={item?.name} variant={safeVariant} />
            <AuthorRole
              designation={item?.designation}
              company={item?.company}
              variant={safeVariant}
            />
          </div>
        </div>
      ) : (
        <div className={cn(avatarContainerVariants({ variant: safeVariant, position: 'desktop' }))}>
          <UserAvatar avatar={item?.avatar} name={item?.name} size='large' />
        </div>
      )}

      {/* Content */}
      <div className={cn(contentVariants({ variant: safeVariant }))}>
        {/* Rating - Top for default, Bottom for fancy */}
        {!isFancy && <TestimonialRating rating={item?.rating} variant={safeVariant} />}

        {/* Feedback */}
        <TestimonialFeedback content={item?.review} variant={safeVariant} />

        {/* Rating - Bottom for fancy */}
        {isFancy && <TestimonialRating rating={item?.rating} variant={safeVariant} />}

        {/* Author Info - Only for default variant */}
        {!isFancy && (
          <div className={cn(authorInfoVariants({ variant: safeVariant }))}>
            <div
              className={cn(avatarContainerVariants({ variant: safeVariant, position: 'mobile' }))}
            >
              <UserAvatar avatar={item?.avatar} name={item?.name} size='medium' />
            </div>
            <div className='flex lg:flex-row flex-col flex-wrap flex-1 lg:justify-between lg:items-center'>
              <AuthorName name={item?.name} variant={safeVariant} />
              <AuthorRole
                designation={item?.designation}
                company={item?.company}
                variant={safeVariant}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

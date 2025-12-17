import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Typography } from './typography'

const sectionHeadingVariants = cva('flex flex-col gap-2 mb-12', {
    variants: {
        alignment: {
            left: 'text-left items-start',
            center: 'text-center items-center',
            right: 'text-right items-end'
        }
    },
    defaultVariants: {
        alignment: 'center'
    }
})

const subtitleWrapperVariants = cva('', {
    variants: {
        variant: {
            default: '',
            gradient: 'inline-flex items-center gap-2 mb-3',
            underline: 'mb-3',
            badge: 'mb-4'
        },
        animated: {
            true: 'animate-in fade-in slide-in-from-bottom-2 duration-500',
            false: ''
        }
    },
    defaultVariants: {
        variant: 'default',
        animated: true
    }
})

const subtitleVariants = cva('', {
    variants: {
        variant: {
            default: 'mb-1 font-semibold text-primary uppercase tracking-wider',
            gradient: 'bg-clip-text bg-linear-to-r from-primary to-primary/70 font-bold text-transparent uppercase tracking-widest',
            underline: 'inline-block relative font-bold text-primary uppercase tracking-widest after:absolute after:bottom-0 after:left-0 after:bg-primary after:rounded-full after:w-full after:h-0.5',
            badge: 'inline-flex items-center gap-2 bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10 font-semibold text-primary text-sm uppercase tracking-wider'
        },
        animated: {
            true: 'animate-in fade-in slide-in-from-bottom-2 duration-500',
            false: ''
        }
    },
    compoundVariants: [
        {
            variant: ['gradient', 'underline', 'badge'],
            animated: true,
            class: ''
        }
    ],
    defaultVariants: {
        variant: 'default',
        animated: true
    }
})

const titleWrapperVariants = cva('mb-4', {
    variants: {
        variant: {
            default: '',
            gradient: '',
            underline: 'inline-block relative',
            badge: ''
        }
    },
    defaultVariants: {
        variant: 'default'
    }
})

const titleVariants = cva('text-foreground leading-tight', {
    variants: {
        variant: {
            default: '',
            gradient: 'bg-clip-text bg-linear-to-r from-foreground via-foreground to-foreground/70',
            underline: '',
            badge: ''
        },
        animated: {
            true: 'animate-in fade-in slide-in-from-bottom-4 duration-600',
            false: ''
        }
    },
    defaultVariants: {
        variant: 'default',
        animated: true
    }
})

const titleUnderlineVariants = cva(
    '-bottom-2 left-1/2 absolute bg-linear-to-r from-transparent via-primary to-transparent rounded-full w-24 h-1 -translate-x-1/2',
    {
        variants: {
            alignment: {
                left: 'left-0 translate-x-0',
                center: '',
                right: 'left-auto right-0 translate-x-0'
            }
        },
        defaultVariants: {
            alignment: 'center'
        }
    }
)

const descriptionVariants = cva('max-w-3xl text-muted-foreground text-lg leading-relaxed', {
    variants: {
        alignment: {
            left: '',
            center: 'mx-auto',
            right: ''
        },
        animated: {
            true: 'animate-in fade-in slide-in-from-bottom-2 duration-500',
            false: ''
        }
    },
    defaultVariants: {
        alignment: 'center',
        animated: true
    }
})

interface SectionHeadingProps extends VariantProps<typeof sectionHeadingVariants> {
    subtitle?: string
    title: string
    description?: string
    variant?: 'default' | 'gradient' | 'underline' | 'badge'
    className?: string
    subtitleClassName?: string
    titleClassName?: string
    descriptionClassName?: string
    animated?: boolean
}

export function SectionHeading({
    subtitle,
    title,
    description,
    alignment = 'center',
    variant = 'default',
    className,
    subtitleClassName,
    titleClassName,
    descriptionClassName,
    animated = true
}: SectionHeadingProps) {
    const hasGradientDecorators = variant === 'gradient'
    const hasBadgeDot = variant === 'badge'
    const hasUnderline = variant === 'underline'

    return (
        <div className={cn(sectionHeadingVariants({ alignment }), className)}>
            {/* Subtitle */}
            {subtitle && (
                <div className={cn(subtitleWrapperVariants({ variant, animated: animated }))}>
                    {hasGradientDecorators && (
                        <div className='bg-linear-to-r from-primary to-primary/60 rounded-full w-12 h-0.5' />
                    )}

                    {variant === 'default' ? (
                        <Typography
                            variant='subtitle1'
                            className={cn(subtitleVariants({ variant, animated: animated }), subtitleClassName)}
                        >
                            {subtitle}
                        </Typography>
                    ) : (
                        <Typography
                            variant='subtitle1'
                            className={cn(subtitleVariants({ variant, animated: false }), subtitleClassName)}
                        >
                            {hasBadgeDot && <span className='bg-primary rounded-full w-1.5 h-1.5 animate-pulse' />}
                            {subtitle}
                        </Typography>
                    )}

                    {hasGradientDecorators && (
                        <div className='bg-linear-to-r from-primary/60 to-transparent rounded-full w-12 h-0.5' />
                    )}
                </div>
            )}

            {/* Title */}
            <div className={cn(titleWrapperVariants({ variant }))}>
                <Typography
                    variant='h2'
                    as='h2'
                    weight='bold'
                    className={cn(titleVariants({ variant, animated: animated }), titleClassName)}
                    style={animated ? { animationDelay: '100ms', animationFillMode: 'both' } : undefined}
                >
                    {title}
                </Typography>
                {hasUnderline && <div className={cn(titleUnderlineVariants({ alignment }))} />}
            </div>

            {/* Description */}
            {description && (
                <Typography
                    variant='body1'
                    className={cn(descriptionVariants({ alignment, animated: animated }), descriptionClassName)}
                    style={animated ? { animationDelay: '200ms', animationFillMode: 'both' } : undefined}
                >
                    {description}
                </Typography>
            )}
        </div>
    )
}

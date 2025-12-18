import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Plus } from 'lucide-react'

const addItemButtonVariants = cva(
    'group flex justify-center items-center transition-all duration-300 cursor-pointer',
    {
        variants: {
            variant: {
                gradient: [
                    'flex-col p-6 rounded-xl',
                    'bg-linear-to-br from-primary/5 via-primary/10 to-primary/5',
                    'hover:from-primary/10 hover:via-primary/15 hover:to-primary/10',
                    'border-2 border-primary/20 hover:border-primary/30 border-dashed',
                    'shadow-sm hover:shadow-md'
                ],
                outline: [
                    'gap-2 px-4 rounded-lg',
                    'border border-input bg-background',
                    'hover:bg-accent hover:text-accent-foreground'
                ],
                default: [
                    'gap-2 px-4 rounded-lg',
                    'bg-primary text-primary-foreground',
                    'hover:bg-primary/90'
                ]
            },
            size: {
                sm: 'text-sm',
                md: 'text-base',
                lg: 'text-lg'
            }
        },
        defaultVariants: {
            variant: 'gradient',
            size: 'md'
        }
    }
)

const iconContainerVariants = cva(
    'flex justify-center items-center shadow-md group-hover:shadow-lg rounded-full transition-all duration-300',
    {
        variants: {
            variant: {
                gradient: 'bg-white mb-3 group-hover:scale-105',
                outline: '',
                default: ''
            },
            size: {
                sm: 'w-10 h-10',
                md: 'w-12 h-12',
                lg: 'w-14 h-14'
            }
        },
        defaultVariants: {
            variant: 'gradient',
            size: 'md'
        }
    }
)

const iconVariants = cva(
    'text-primary group-hover:rotate-90 transition-transform duration-300',
    {
        variants: {
            variant: {
                gradient: '',
                outline: '',
                default: 'text-primary-foreground'
            },
            size: {
                sm: 'w-4 h-4',
                md: 'w-5 h-5',
                lg: 'w-6 h-6'
            }
        },
        defaultVariants: {
            variant: 'gradient',
            size: 'md'
        }
    }
)

const labelVariants = cva('font-semibold', {
    variants: {
        variant: {
            gradient: 'text-foreground',
            outline: 'text-foreground',
            default: 'text-primary-foreground'
        },
        size: {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base'
        }
    },
    defaultVariants: {
        variant: 'gradient',
        size: 'md'
    }
})

interface AddItemButtonProps extends VariantProps<typeof addItemButtonVariants> {
    onClick: () => void
    label?: string
    disabled?: boolean
    className?: string
}

export function AddItemButton({
    onClick,
    label = 'Add Item',
    disabled = false,
    className,
    variant = 'gradient',
    size = 'md'
}: AddItemButtonProps) {
    const isGradient = variant === 'gradient'

    if (isGradient) {
        return (
            <div
                className={cn(
                    addItemButtonVariants({ variant, size }),
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
                onClick={disabled ? undefined : onClick}
            >
                <div className={iconContainerVariants({ variant, size })}>
                    <Plus className={iconVariants({ variant, size })} />
                </div>
                <span className={labelVariants({ variant, size })}>{label}</span>
            </div>
        )
    }

    return (
        <Button
            type='button'
            variant={variant === 'default' ? 'default' : 'outline'}
            size={size === 'md' ? 'default' : size}
            onClick={onClick}
            disabled={disabled}
            className={cn(addItemButtonVariants({ variant, size }), className)}
        >
            <Plus className={iconVariants({ variant, size })} />
            <span className={labelVariants({ variant, size })}>{label}</span>
        </Button>
    )
}

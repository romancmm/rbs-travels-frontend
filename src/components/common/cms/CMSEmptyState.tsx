/**
 * CMS Empty State Component
 * Displays when no items exist with call-to-action
 */

import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface CMSEmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
}

export function CMSEmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: CMSEmptyStateProps) {
    return (
        <div className='flex flex-col justify-center items-center px-4 min-h-[400px] text-center'>
            <div className='bg-muted mb-4 p-6 rounded-full'>
                <Icon className='w-12 h-12 text-muted-foreground' />
            </div>
            <h3 className='mb-2 font-semibold text-xl'>{title}</h3>
            <p className='mb-6 max-w-md text-muted-foreground'>{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} size='lg'>
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}

/**
 * CMS Status Badge Component
 * Reusable badge for displaying status (published/draft)
 */

import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock } from 'lucide-react'

interface StatusBadgeProps {
    status: 'published' | 'draft'
    showIcon?: boolean
}

export function CMSStatusBadge({ status, showIcon = true }: StatusBadgeProps) {
    const isPublished = status === 'published'

    return (
        <Badge variant={isPublished ? 'default' : 'secondary'} className='gap-1'>
            {showIcon && (isPublished ? <CheckCircle className='w-3 h-3' /> : <Clock className='w-3 h-3' />)}
            <span className='capitalize'>{status}</span>
        </Badge>
    )
}

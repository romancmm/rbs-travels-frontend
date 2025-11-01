/**
 * CMS List Loading Skeleton
 * Consistent loading state for CMS lists
 */

import { Skeleton } from '@/components/ui/skeleton'

interface CMSListSkeletonProps {
    rows?: number
}

export function CMSListSkeleton({ rows = 5 }: CMSListSkeletonProps) {
    return (
        <div className='space-y-4'>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className='p-4 border rounded-lg'>
                    <div className='flex justify-between items-center'>
                        <div className='flex-1 space-y-2'>
                            <Skeleton className='w-1/3 h-5' />
                            <Skeleton className='w-2/3 h-4' />
                        </div>
                        <div className='flex items-center gap-2'>
                            <Skeleton className='w-20 h-8' />
                            <Skeleton className='w-8 h-8' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

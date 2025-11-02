'use client'

import { useParams } from 'next/navigation'
import { Suspense } from 'react'

import { PageBuilder } from '@/components/admin/page-builder/PageBuilder'
import { CMSListSkeleton } from '@/components/common/cms'
import useAsync from '@/hooks/useAsync'
import { createEmptyContent } from '@/lib/page-builder/builder-utils'
import { PageLayout } from '@/types/cms'

function PageBuilderEdit() {
    const params = useParams()
    const pageSlug = params.pageSlug as string

    const { data, loading } = useAsync<{
        data: {
            items: PageLayout[]
            pagination: any
        }
    }>(() => pageSlug ? `/admin/pages/${pageSlug}` : null)

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <CMSListSkeleton rows={5} />
            </div>
        )
    }

    // For now, use empty content. Later, transform API data to PageContent
    const initialContent = createEmptyContent()

    return (
        <PageBuilder
            pageId={pageSlug}
            initialContent={initialContent}
        />
    )
}

export default function PageBuilderEditPage() {
    return (
        <Suspense fallback={
            <div className='flex justify-center items-center h-screen'>
                <CMSListSkeleton rows={5} />
            </div>
        }>
            <PageBuilderEdit />
        </Suspense>
    )
}

'use client'

import { useParams } from 'next/navigation'
import { Suspense } from 'react'

import { PageBuilder } from '@/components/admin/page-builder/PageBuilder'
import { CMSListSkeleton } from '@/components/common/cms'
import useAsync from '@/hooks/useAsync'
import { createEmptyContent } from '@/lib/page-builder/builder-utils'
import { samplePageContent } from '@/lib/page-builder/test-data'
import { PageLayout } from '@/types/cms'
import type { PageContent } from '@/types/page-builder'

function PageBuilderEdit() {
    const params = useParams()
    const pageSlug = params.pageSlug as string

    const { data, loading } = useAsync<{
        data: PageLayout
    }>(() => (pageSlug ? `/admin/pages/${pageSlug}` : null))

    console.log('[PageBuilderEdit] 📊 Data from API:', {
        hasData: !!data,
        pageData: data?.data,
        content: data?.data?.content,
        contentType: typeof data?.data?.content,
        contentSections: data?.data?.content?.sections?.length || 0
    })

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <CMSListSkeleton rows={5} />
            </div>
        )
    }

    // Use API data if available, otherwise use sample/empty content
    const pageData = data?.data

    // Check if pageData has content and if it has sections
    let initialContent: PageContent

    if (pageData?.content && typeof pageData.content === 'object') {
        const apiContent = pageData.content as PageContent
        console.log('[PageBuilderEdit] Using API content:', {
            sections: apiContent.sections?.length || 0,
            fullContent: apiContent
        })
        initialContent = apiContent
    } else if (pageSlug === 'test') {
        console.log('[PageBuilderEdit] Using test sample content')
        initialContent = samplePageContent
    } else {
        console.log('[PageBuilderEdit] Using empty content (no API data)')
        initialContent = createEmptyContent()
    }

    // Prepare page metadata
    const pageMetadata = pageData
        ? {
            slug: pageData.slug,
            title: pageData.title,
            description: pageData.description,
            seo: pageData.seo
        }
        : undefined

    return (
        <PageBuilder
            pageId={pageData?.id || pageSlug}
            initialContent={initialContent}
            pageMetadata={pageMetadata}
        />
    )
}

export default function PageBuilderEditPage() {
    return (
        <Suspense
            fallback={
                <div className='flex justify-center items-center h-screen'>
                    <CMSListSkeleton rows={5} />
                </div>
            }
        >
            <PageBuilderEdit />
        </Suspense>
    )
}

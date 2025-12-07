'use client'

import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { MenuItem } from '@/types/menu.types'
import { notFound, useRouter } from 'next/navigation'
import { use } from 'react'

// Import page components
import ArticlePage from '@/components/frontend/pages/articles/[slug]/page'
import ArticleCategoryPage from '@/components/frontend/pages/articles/category/[...slugs]/page'
import DynamicPage from '@/components/frontend/pages/page/[slug]/page'

interface MenuSlugPageProps {
    params: Promise<{
        menuSlug: string[]
    }>
}

export default function MenuSlugPage({ params }: MenuSlugPageProps) {
    const resolvedParams = use(params)

    return <MenuSlugContent params={resolvedParams} />
}

function MenuSlugContent({ params }: { params: { menuSlug: string[] } }) {
    const router = useRouter()
    const menuSlug = params.menuSlug[0] // First segment is the menu slug

    // Fetch menu item by slug
    const { data: response, loading } = useAsync<{ data: MenuItem }>(
        `/menus/item/${menuSlug}`,
        true
    )

    const menuItem = response?.data

    if (loading) {
        return (
            <>
                <Section className='bg-linear-to-r from-primary/90 to-primary/70'>
                    <Container>
                        <div className='py-12 text-center'>
                            <Skeleton className='bg-white/20 mx-auto mb-4 w-3/4 h-12' />
                            <Skeleton className='bg-white/20 mx-auto w-1/2 h-6' />
                        </div>
                    </Container>
                </Section>

                <Section variant={'xl'}>
                    <Container>
                        <div className='space-y-4'>
                            <Skeleton className='w-full h-64' />
                            <Skeleton className='w-full h-64' />
                            <Skeleton className='w-full h-64' />
                        </div>
                    </Container>
                </Section>
            </>
        )
    }

    if (!menuItem) {
        notFound()
        return null
    }

    // Route based on menu item type
    switch (menuItem.type) {
        case 'single-article':
            if (typeof menuItem.reference === 'string') {
                return <ArticlePage slug={menuItem.reference} />
            }
            notFound()
            return null

        case 'category-articles': {
            const slugs: string[] = Array.isArray(menuItem.reference)
                ? menuItem.reference
                : typeof menuItem.reference === 'string'
                    ? menuItem.reference.split('/').filter(Boolean)
                    : []

            if (slugs.length === 0) {
                notFound()
                return null
            }

            return <ArticleCategoryPage slugs={slugs} />
        }

        case 'gallery':
            if (typeof menuItem.reference === 'string') {
                const pathname = menuItem.reference.split('/').filter(Boolean)
                router.push(`/gallery/${pathname.join('/')}`)
                return null
            }
            router.push('/gallery')
            return null

        case 'page':
            if (typeof menuItem.reference === 'string') {
                return <DynamicPage pageSlug={menuItem.reference} />
            }
            notFound()
            return null

        case 'custom-link':
        case 'external-link':
            if (menuItem.url) {
                if (menuItem.target === '_blank') {
                    window.open(menuItem.url, '_blank')
                    router.back()
                } else {
                    router.push(menuItem.url)
                }
            }
            return null

        default:
            notFound()
            return null
    }
}

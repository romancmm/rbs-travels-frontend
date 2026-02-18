'use client'

import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { MenuItem } from '@/types/menu.types'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { use } from 'react'

// Import page components
import ArticlePage from '@/components/frontend/details/ArticleDetails'
import ArticleCategoryPage from '@/components/frontend/details/articles/category/[...slugs]/page'
import GalleryDetails from '@/components/frontend/details/GalleryDetails'
import PageDetails from '@/components/frontend/details/PageDetails'

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
  const additionalPath = params.menuSlug.slice(1) // Remaining segments for gallery/article subpaths

  // Fetch menu item by slug
  const { data: response, loading } = useAsync<{ data: MenuItem }>(`/menus/item/${menuSlug}`, true)
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
  }

  // Page Title/Breadcrumb Section
  const PageHeader = () => (
    <Section className='bg-linear-to-r from-primary/90 to-primary/70 relative overflow-hidden'>
      {/* Optional: Add background pattern/image */}
      <div className="absolute inset-0 bg-[url('/images/bg/breadcrumb.jpg')] bg-cover bg-center opacity-20" />

      <Container className='relative z-10'>
        <div className='py-8 space-y-4'>
          {/* Breadcrumb Navigation */}
          <Breadcrumb>
            <BreadcrumbList className='text-white/90'>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/' className='flex items-center gap-1 hover:text-white'>
                    <Home className='w-4 h-4' />
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {menuItem.parentId && (
                <>
                  <BreadcrumbSeparator className='text-white/60' />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href='#' className='hover:text-white'>
                        Parent
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}

              <BreadcrumbSeparator className='text-white/60' />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-white font-medium'>{menuItem.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Title */}
          <Typography variant='h1' as='h1' weight='bold' className='text-white'>
            {menuItem.title}
          </Typography>
        </div>
      </Container>
    </Section>
  )

  // Route based on menu item type
  switch (menuItem.type) {
    case 'single-article':
      return (
        <>
          <PageHeader />
          <ArticlePage slug={menuItem.reference as string} />
        </>
      )

    case 'category-articles': {
      const slugs: string[] = Array.isArray(menuItem.reference)
        ? menuItem.reference
        : typeof menuItem.reference === 'string'
          ? menuItem.reference.split('/').filter(Boolean)
          : []

      if (slugs.length === 0) {
        notFound()
      }

      return (
        <>
          <PageHeader />
          <ArticleCategoryPage slugs={slugs} />
        </>
      )
    }

    case 'gallery': {
      // Combine the menu reference path with any additional path segments
      const basePath = menuItem.reference as string
      const fullPath = additionalPath.length > 0 ? `${additionalPath.join('/')}` : basePath
      return (
        <>
          <PageHeader />
          <GalleryDetails path={fullPath} menuSlug={menuSlug} />
        </>
      )
    }

    case 'page':
      if (typeof menuItem.reference === 'string') {
        return (
          <>
            <PageHeader />
            <PageDetails pageSlug={menuItem.reference} />
          </>
        )
      }
      notFound()

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
  }
}

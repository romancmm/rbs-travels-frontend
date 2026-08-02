'use client'

import { LinkRedirect } from '@/components/frontend/menu/LinkRedirect'
import { MenuPageHeader } from '@/components/frontend/menu/MenuPageHeader'
import { MenuSlugSkeleton } from '@/components/frontend/menu/MenuSlugSkeleton'
import { useMenuItem } from '@/hooks/useMenuItem'
import { MenuItem } from '@/types/menu.types'
import { notFound } from 'next/navigation'
import { use, type ReactNode } from 'react'

// Content views, one per `MenuItem['type']`
import ArticlePage from '@/components/frontend/details/ArticleDetails'
import CategoryArticlesPage from '@/components/frontend/details/articles/category/[...slugs]/page'
import GalleryDetails from '@/components/frontend/details/GalleryDetails'
import PageDetails from '@/components/frontend/details/PageDetails'

interface MenuSlugPageProps {
  params: Promise<{
    menuSlug: string[]
  }>
}

export default function MenuSlugPage({ params }: MenuSlugPageProps) {
  const { menuSlug: segments } = use(params)
  return <MenuSlugContent segments={segments} />
}

function MenuSlugContent({ segments }: { segments: string[] }) {
  // First segment identifies the menu item; the rest are subpaths (e.g. gallery folders)
  const [menuSlug, ...additionalPath] = segments
  const { menuItem, loading } = useMenuItem(menuSlug)

  if (loading) {
    return <MenuSlugSkeleton />
  }

  if (!menuItem) {
    notFound()
  }

  const header =
    menuItem.showTitle !== false ? (
      <MenuPageHeader
        title={menuItem.title}
        bgImage={menuItem.bgImage}
        hasParent={!!menuItem.parentId}
      />
    ) : null

  return renderMenuItemContent(menuItem, menuSlug, additionalPath, header)
}

function renderMenuItemContent(
  menuItem: MenuItem,
  menuSlug: string,
  additionalPath: string[],
  header: ReactNode
) {
  switch (menuItem.type) {
    case 'single-article':
      return (
        <>
          {header}
          <ArticlePage slug={menuItem.reference as string} />
        </>
      )

    case 'category-blog': {
      const slugs = getCategorySlugs(menuItem.reference)
      if (slugs.length === 0) {
        notFound()
      }

      return (
        <>
          {header}
          <CategoryArticlesPage slugs={slugs} />
        </>
      )
    }

    case 'gallery': {
      // Deeper folder navigation replaces the base reference with an absolute
      // folder path (see GalleryDetails' folder-click handler), so only fall
      // back to the menu item's reference at the gallery's root.
      const basePath = menuItem.reference as string
      const fullPath = additionalPath.length > 0 ? additionalPath.join('/') : basePath

      return (
        <>
          {header}
          <GalleryDetails path={fullPath} menuSlug={menuSlug} />
        </>
      )
    }

    case 'page':
      if (typeof menuItem.reference !== 'string') {
        notFound()
      }

      return (
        <>
          {header}
          <PageDetails pageSlug={menuItem.reference} />
        </>
      )

    case 'custom-link':
    case 'external-link':
      if (!menuItem.url) {
        notFound()
      }

      return <LinkRedirect url={menuItem.url} target={menuItem.target} />

    default:
      notFound()
  }
}

/** Normalizes a category-articles reference (string path or slug array) into slugs. */
function getCategorySlugs(reference: MenuItem['reference']): string[] {
  if (Array.isArray(reference)) {
    return reference
  }
  if (typeof reference === 'string') {
    return reference.split('/').filter(Boolean)
  }
  return []
}

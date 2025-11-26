import type { Metadata } from 'next'
import { SiteSettings } from '../validations/schemas/siteSettings'

export const buildSiteMetadata = (data: SiteSettings | null): Metadata => {
  const siteName = data?.seo?.metaName || data?.name || '~ NODE CMS'
  const siteTitle = data?.seo?.metaTitle || data?.name || '~ NODE CMS'
  const siteDescription = data?.seo?.metaDescription || data?.shortDescription || ''
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rbstravelsbd.com'
  const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API || ''

  // Construct full URLs for images
  const ogImageUrl = data?.seo?.ogImage
    ? `${baseApiUrl}${data.seo.ogImage}`
    : data?.logo?.default
    ? `${baseApiUrl}${data.logo.default}`
    : `${baseUrl}/default-og-image.jpg`

  const faviconUrl = data?.favicon ? data.favicon : `${baseUrl}/favicon.ico`

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`
    },
    description: siteDescription,
    keywords: data?.seo?.metaKeywords,
    authors: data?.seo?.siteAuthor ? [{ name: data.seo.siteAuthor }] : undefined,
    creator: data?.seo?.siteAuthor,
    publisher: siteName,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: data?.seo?.canonicalUrl || baseUrl
    },
    openGraph: {
      type: 'website',
      locale: data?.locale || 'en_US',
      url: baseUrl,
      siteName: siteName,
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteTitle,
          type: 'image/jpeg'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: data?.socialLinks?.twitter
        ? `@${data.socialLinks.twitter.replace(/.*\//, '')}`
        : undefined,
      creator: data?.socialLinks?.twitter
        ? `@${data.socialLinks.twitter.replace(/.*\//, '')}`
        : undefined,
      title: siteTitle,
      description: siteDescription,
      images: [ogImageUrl]
    },
    icons: {
      icon: [
        { url: faviconUrl, type: 'image/x-icon' },
        { url: faviconUrl, sizes: '16x16', type: 'image/png' },
        { url: faviconUrl, sizes: '32x32', type: 'image/png' }
      ],
      shortcut: faviconUrl,
      apple: [{ url: faviconUrl, sizes: '180x180', type: 'image/png' }],
      other: [
        {
          rel: 'mask-icon',
          url: faviconUrl,
          color: data?.theme?.color?.primary || '#5bbad5'
        }
      ]
    },
    robots: {
      index: !data?.maintenanceMode,
      follow: !data?.maintenanceMode,
      googleBot: {
        index: !data?.maintenanceMode,
        follow: !data?.maintenanceMode
      }
    },
    verification: {
      google: data?.analytics?.googleAnalyticsId
    }
  }
}

/**
 * Build page-specific metadata that extends the site metadata
 */
export const buildPageMetadata = (
  siteData: SiteSettings | null,
  pageData: {
    title?: string
    description?: string
    keywords?: string[]
    image?: string
    url?: string
    type?: 'website' | 'article'
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
  }
): Metadata => {
  const baseMetadata = buildSiteMetadata(siteData)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'
  const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API || ''

  const pageTitle = pageData.title
    ? `${pageData.title} | ${siteData?.seo?.metaName || siteData?.name || '~ NODE CMS'}`
    : baseMetadata.title?.toString()

  const pageDescription = pageData.description || baseMetadata.description?.toString() || ''

  // Safely handle the OpenGraph images array
  const baseImages = baseMetadata.openGraph?.images
  let baseImageUrl = ''

  if (Array.isArray(baseImages) && baseImages.length > 0) {
    const firstImage = baseImages[0]
    if (typeof firstImage === 'string') {
      baseImageUrl = firstImage
    } else if (firstImage instanceof URL) {
      baseImageUrl = firstImage.toString()
    } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
      const url = firstImage.url
      baseImageUrl = url instanceof URL ? url.toString() : url
    }
  } else if (typeof baseImages === 'string') {
    baseImageUrl = baseImages
  } else if (baseImages instanceof URL) {
    baseImageUrl = baseImages.toString()
  } else if (baseImages && typeof baseImages === 'object' && 'url' in baseImages) {
    const url = baseImages.url
    baseImageUrl = url instanceof URL ? url.toString() : url
  }

  const pageImageUrl = pageData.image ? `${baseApiUrl}${pageData.image}` : baseImageUrl

  return {
    ...baseMetadata,
    title: pageTitle,
    description: pageDescription,
    keywords: pageData.keywords || baseMetadata.keywords,
    authors: pageData.authors ? pageData.authors.map((name) => ({ name })) : baseMetadata.authors,
    alternates: {
      ...baseMetadata.alternates,
      canonical: pageData.url ? `${baseUrl}${pageData.url}` : baseMetadata.alternates?.canonical
    },
    openGraph: {
      ...baseMetadata.openGraph,
      type: pageData.type || 'website',
      url: pageData.url ? `${baseUrl}${pageData.url}` : baseMetadata.openGraph?.url,
      title:
        pageData.title ||
        (typeof baseMetadata.openGraph?.title === 'string' ? baseMetadata.openGraph.title : ''),
      description: pageDescription,
      images: [
        {
          url: pageImageUrl,
          width: 1200,
          height: 630,
          alt:
            pageData.title ||
            (typeof baseMetadata.openGraph?.title === 'string' ? baseMetadata.openGraph.title : ''),
          type: 'image/jpeg'
        }
      ],
      publishedTime: pageData.publishedTime,
      modifiedTime: pageData.modifiedTime
    },
    twitter: {
      ...baseMetadata.twitter,
      title: pageData.title || baseMetadata.twitter?.title,
      description: pageDescription,
      images: [pageImageUrl]
    }
  }
}

/**
 * Generate structured data (JSON-LD) for the site
 */
export const buildStructuredData = (data: SiteSettings | null) => {
  if (!data) return null

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.shortDescription,
    url: baseUrl,
    logo: data.logo?.default
      ? `${process.env.NEXT_PUBLIC_BASE_API || ''}${data.logo.default}`
      : undefined,
    email: data.email,
    telephone: data.phone,
    address: data.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: data.address
        }
      : undefined,
    sameAs: Object.entries(data.socialLinks || {})
      .filter(([, url]) => url && url !== '')
      .map(([, url]) => url)
  }
}

export const buildArticleMetadata = (data: Article): Metadata => ({
  title: data?.title,
  description: data?.excerpt,
  openGraph: {
    title: data?.title,
    description: data?.excerpt ?? '',
    type: 'article',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blogs?slug=${data?.slug}`,
    images: data?.thumbnail ? [{ url: data?.thumbnail }] : []
  }
})

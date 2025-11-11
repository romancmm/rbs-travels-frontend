// import { buildSiteMetadata } from '@/lib/seo/metaBuilders'
import { getSiteConfig } from '@/action/data'
import { SiteProvider } from '@/components/providers/store-provider'
import { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import type { CSSProperties } from 'react'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
})

// export async function generateMetadata(): Promise<Metadata> {
//   const data = await getSiteConfig()
//   return buildSiteMetadata(data)
// }

export const metadata: Metadata = {
  title: {
    default: 'RBS Travels',
    template: '%s | RBS TRAVELS'
  },
  description:
    'RBS TRAVELS — Your trusted travel agency for air tickets, holiday packages, and visa assistance worldwide.',
  keywords: [
    'RBS Travels',
    'Travel Agency',
    'Air Ticket',
    'Holiday Packages',
    'Visa Assistance',
    'Tour Operator',
    'Flight Booking',
    'Bangladesh Travel Agency'
  ],
  authors: [{ name: 'RBS TRAVELS', url: 'https://rbstravels.com' }],
  creator: 'RBS TRAVELS',
  publisher: 'RBS TRAVELS',
  metadataBase: new URL('https://rbstravels.com'),
  openGraph: {
    title: 'RBS TRAVELS',
    description:
      'Book your flights, tours, and visa services with RBS TRAVELS — your reliable travel partner.',
    url: 'https://rbstravels.com',
    siteName: 'RBS TRAVELS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RBS TRAVELS — Travel Agency'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RBS TRAVELS',
    description:
      'Your trusted travel agency for air tickets, tour packages, and visa services worldwide.',
    creator: '@rbstravels',
    images: ['/og-image.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteConfig: any = await getSiteConfig()
  const FALLBACK_THEME_COLORS: Record<string, string> = {
    primary: '#1677FF',
    secondary: '#13C2C2',
    accent: '#FAAD14',
    text: '#1F1F1F',
    'header-background': '#F5F5F5',
    'header-color': '#1F1F1F',
    'footer-background': '#001529',
    'footer-color': '#FFFFFF'
  }

  const HEX_COLOR_REGEX = /^#([0-9A-F]{6})$/i
  const ALLOWED_THEME_KEYS = new Set(Object.keys(FALLBACK_THEME_COLORS))

  const buildThemeStyles = (): Record<string, string> => {
    const styles: Record<string, string> = {}
    const themeColors = siteConfig?.theme?.color as Record<string, unknown> | undefined

    if (!themeColors) return styles

    for (const [rawKey, rawValue] of Object.entries(themeColors)) {
      const key = rawKey.toString().toLowerCase()

      if (!ALLOWED_THEME_KEYS.has(key)) continue

      const fallback = FALLBACK_THEME_COLORS[key]
      const hexValue =
        typeof rawValue === 'string' && HEX_COLOR_REGEX.test(rawValue.trim())
          ? rawValue.trim().toUpperCase()
          : fallback

      styles[`--${key}`] = hexValue
    }

    return styles
  }

  const themeStyleVars = buildThemeStyles()
  const isDarkMode = siteConfig?.theme?.darkMode
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={isDarkMode ? 'dark' : ''}
      style={{
        colorScheme: isDarkMode ? 'dark' : 'light',
        ...(themeStyleVars as CSSProperties)
      }}
    >
      <body className={`${manrope.variable} font-manrope antialiased`}>
        <SiteProvider data={siteConfig}>{children}</SiteProvider>
      </body>
    </html>
  )
}

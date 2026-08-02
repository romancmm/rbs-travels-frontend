import { getSiteConfig } from '@/action/data'
import { SiteProvider } from '@/components/providers/store-provider'
import { buildSiteMetadata, buildViewport } from '@/lib/seo/metaBuilders'
import { Metadata, Viewport } from 'next'
import { Anek_Bangla, Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
})

// Bengali-native typeface, swapped in via globals.css when <html lang="bn">
// (see LanguageProvider) - Manrope has no Bengali glyphs of its own.
const anekBangla = Anek_Bangla({
  subsets: ['bengali', 'latin'],
  weight: 'variable',
  variable: '--font-anek-bangla'
})

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteConfig()
  return buildSiteMetadata(data)
}

export async function generateViewport(): Promise<Viewport> {
  const data = await getSiteConfig()
  return buildViewport(data)
}

// export const metadata: Metadata = {
//   title: {
//     default: 'Dynamic CMS',
//     template: '%s | Dynamic CMS'
//   },
//   description:
//     'DS CMS — Your trusted travel agency for air tickets, holiday packages, and visa assistance worldwide.',
//   keywords: [
//     'Dynamic CMS',
//     'Travel Agency',
//     'Air Ticket',
//     'Holiday Packages',
//     'Visa Assistance',
//     'Tour Operator',
//     'Flight Booking',
//     'Bangladesh Travel Agency'
//   ],
//   authors: [{ name: 'Dynamic CMS', url: 'https://rbstravels.com' }],
//   creator: 'Dynamic CMS',
//   publisher: 'Dynamic CMS',
//   metadataBase: new URL('https://rbstravels.com'),
//   openGraph: {
//     title: 'Dynamic CMS',
//     description:
//       'Book your flights, tours, and visa services with Dynamic CMS — your reliable travel partner.',
//     url: 'https://rbstravels.com',
//     siteName: 'Dynamic CMS',
//     images: [
//       {
//         url: '/og-image.png',
//         width: 1200,
//         height: 630,
//         alt: 'Dynamic CMS — Travel Agency'
//       }
//     ],
//     locale: 'en_US',
//     type: 'website'
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Dynamic CMS',
//     description:
//       'Your trusted travel agency for air tickets, tour packages, and visa services worldwide.',
//     creator: '@rbstravels',
//     images: ['/og-image.png']
//   },
//   icons: {
//     icon: '/favicon.ico',
//     apple: '/apple-touch-icon.png'
//   },
//   manifest: '/site.webmanifest'
// }

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteConfig: any = await getSiteConfig()

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${manrope.variable} ${anekBangla.variable} font-manrope antialiased`}>
        <SiteProvider data={siteConfig}>{children}</SiteProvider>
      </body>
    </html>
  )
}

import { getSiteConfig } from '@/action/data'
import { SiteProvider } from '@/components/providers/store-provider'
import { buildSiteMetadata, buildViewport } from '@/lib/seo/metaBuilders'
import { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
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
//     default: 'NODE CMS',
//     template: '%s | NODE CMS'
//   },
//   description:
//     'NODE CMS — Your trusted travel agency for air tickets, holiday packages, and visa assistance worldwide.',
//   keywords: [
//     'NODE CMS',
//     'Travel Agency',
//     'Air Ticket',
//     'Holiday Packages',
//     'Visa Assistance',
//     'Tour Operator',
//     'Flight Booking',
//     'Bangladesh Travel Agency'
//   ],
//   authors: [{ name: 'NODE CMS', url: 'https://rbstravels.com' }],
//   creator: 'NODE CMS',
//   publisher: 'NODE CMS',
//   metadataBase: new URL('https://rbstravels.com'),
//   openGraph: {
//     title: 'NODE CMS',
//     description:
//       'Book your flights, tours, and visa services with NODE CMS — your reliable travel partner.',
//     url: 'https://rbstravels.com',
//     siteName: 'NODE CMS',
//     images: [
//       {
//         url: '/og-image.png',
//         width: 1200,
//         height: 630,
//         alt: 'NODE CMS — Travel Agency'
//       }
//     ],
//     locale: 'en_US',
//     type: 'website'
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'NODE CMS',
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
      <body className={`${manrope.variable} font-manrope antialiased`}>
        <SiteProvider data={siteConfig}>{children}</SiteProvider>
      </body>
    </html>
  )
}

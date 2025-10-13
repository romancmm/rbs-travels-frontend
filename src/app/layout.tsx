import { getSiteConfig } from '@/action/data'
import { SiteProvider } from '@/components/providers/store-provider'
// import { buildSiteMetadata } from '@/lib/seo/metaBuilders'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'

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
    default: "RBS TRAVELS",
    template: "%s | RBS TRAVELS",
  },
  description:
    "RBS TRAVELS — Your trusted travel agency for air tickets, holiday packages, and visa assistance worldwide.",
  keywords: [
    "RBS Travels",
    "Travel Agency",
    "Air Ticket",
    "Holiday Packages",
    "Visa Assistance",
    "Tour Operator",
    "Flight Booking",
    "Bangladesh Travel Agency",
  ],
  authors: [{ name: "RBS TRAVELS", url: "https://rbstravels.com" }],
  creator: "RBS TRAVELS",
  publisher: "RBS TRAVELS",
  metadataBase: new URL("https://rbstravels.com"),
  openGraph: {
    title: "RBS TRAVELS",
    description:
      "Book your flights, tours, and visa services with RBS TRAVELS — your reliable travel partner.",
    url: "https://rbstravels.com",
    siteName: "RBS TRAVELS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RBS TRAVELS — Travel Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RBS TRAVELS",
    description:
      "Your trusted travel agency for air tickets, tour packages, and visa services worldwide.",
    creator: "@rbstravels",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};


export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // const siteConfig: any = await getSiteConfig()

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${manrope.variable} font-manrope antialiased`}>
        {/* <SiteProvider data={siteConfig}>{children}</SiteProvider> */}
        {children}
      </body>
    </html>
  )
}

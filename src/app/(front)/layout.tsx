import { fetchOnServer } from '@/action/data'
import Footer from '@/components/frontend/layout/footer'
import Header from '@/components/frontend/layout/header'
import { SiteThemeProvider } from '@/components/providers/site-theme-provider'

export default async function FrontLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  const mainMenus = fetchOnServer({ path: '/menus/main-menu', rev: 300 })
  const footerMenus = fetchOnServer({ path: '/menus/footer-menu', rev: 300 })

  return (
    <SiteThemeProvider>
      <Header data={mainMenus} />
      <main className='min-h-125'>{children}</main>
      <Footer data={footerMenus} />
      {modal}
    </SiteThemeProvider>
  )
}

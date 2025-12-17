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
  const mainMenus = fetchOnServer('/menus/main-menu', 300)
  const footerMenus = fetchOnServer('/menus/footer-menu', 300)

  return (
    <SiteThemeProvider>
      <Header data={mainMenus} />
      <main className='min-h-[500px]'>{children}</main>
      <Footer data={footerMenus} />
      {modal}
    </SiteThemeProvider>
  )
}

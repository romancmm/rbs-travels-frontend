import { fetchOnServer } from '@/action/data'
import GoogleTranslate from '@/components/common/GoogleTranslate'
import Footer from '@/components/frontend/layout/footer'
import Header from '@/components/frontend/layout/header'
import { LanguageProvider } from '@/components/providers/language-provider'
import { SiteThemeProvider } from '@/components/providers/site-theme-provider'

export default async function FrontLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  const mainMenus = fetchOnServer({ path: '/menus/main-menu', rev: 300, tag: 'main_menus' })
  const footerMenus = fetchOnServer({ path: '/menus/footer-menu', rev: 300, tag: 'footer_menus' })

  return (
    <SiteThemeProvider>
      <LanguageProvider>
        <GoogleTranslate />
        <Header data={mainMenus} />
        <main className='min-h-125'>{children}</main>
        <Footer data={footerMenus} />
        {modal}
      </LanguageProvider>
    </SiteThemeProvider>
  )
}

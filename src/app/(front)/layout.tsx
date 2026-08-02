import { fetchOnServer } from '@/action/data'
import GoogleTranslate from '@/components/common/GoogleTranslate'
import Footer from '@/components/frontend/layout/footer'
import Header from '@/components/frontend/layout/header'
import { LanguageProvider } from '@/components/providers/language-provider'
import { SiteThemeProvider } from '@/components/providers/site-theme-provider'
import { DEFAULT_FOOTER_MENU_ITEMS, DEFAULT_MAIN_MENU_ITEMS } from '@/data/siteConfig'

export default async function FrontLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  const mainMenus = fetchOnServer({ path: '/menus/main-menu', rev: 300, tag: 'main_menus' }).then(
    (res) => ({
      data: { items: res?.data?.items?.length ? res.data.items : DEFAULT_MAIN_MENU_ITEMS },
      error: null
    })
  )
  const footerMenus = fetchOnServer({
    path: '/menus/footer-menu',
    rev: 300,
    tag: 'footer_menus'
  }).then((res) => ({
    data: { items: res?.data?.items?.length ? res.data.items : DEFAULT_FOOTER_MENU_ITEMS },
    error: null
  }))

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

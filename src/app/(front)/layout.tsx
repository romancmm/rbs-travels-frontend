import { fetchOnServer } from '@/action/data'
import Footer from '@/components/frontend/layout/footer'
import Header from '@/components/frontend/layout/header'

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const mainMenus = fetchOnServer('/menus/main-menu', 300)
  const footerMenus = fetchOnServer('/menus/footer-menu', 300)

  return (
    <>
      <Header data={mainMenus} />
      <main className='min-h-[500px]'>{children}</main>
      <Footer data={footerMenus} />
    </>
  )
}

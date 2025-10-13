import Footer from '@/components/frontend/layout/footer'
import Header from '@/components/frontend/layout/header'

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className='min-h-[500px]'>{children}</main>
      <Footer />
    </>
  )
}

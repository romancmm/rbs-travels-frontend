import { cn } from '@/lib/utils'
import { use } from 'react'
import MainHeader from './MainHeader'
import TopBar from './TopBar'

export default function Header({ data }: { data: any }) {
  const res: any = use(data)
  console.log('res :>> ', res);
  return (
    <>
      {/* Top announcement bar */}
      <TopBar />

      {/* Main header */}
      <header
        className={cn(
          'bg-slate-900/95 backdrop-blur-md border-white/10 border-b',
          'shadow-lg shadow-black/5 top-0 z-50 sticky'
        )}
      >
        <MainHeader data={res?.data?.items} />
      </header>
    </>
  )
}

import { cn } from '@/lib/utils'
import MainHeader from './MainHeader'
import TopBar from './TopBar'

export default function Header() {
  return (
    <div className='top-0 z-50 sticky'>
      {/* Top announcement bar */}
      <TopBar />

      {/* Main header */}
      <header
        className={cn(
          'bg-slate-900/95 backdrop-blur-md border-white/10 border-b',
          'shadow-lg shadow-black/5'
        )}
      >
        <MainHeader />
      </header>
    </div>
  )
}

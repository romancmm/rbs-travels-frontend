import { sectionVariants } from '@/components/common/section'
import { cn } from '@/lib/utils'
import MainHeader from './MainHeader'

export default function Header() {
  return (
    <header
      className={cn(
        'top-0 z-50 sticky shadow-md',
        sectionVariants({ variant: 'none', bg: 'foreground' })
      )}
    >
      <MainHeader />
    </header>
  )
}

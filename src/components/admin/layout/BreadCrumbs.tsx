'use client'

import { Typography } from '@/components/common/typography'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BreadCrumbs() {
  const pathname = usePathname()
  const { isMobile, state } = useSidebar()

  // Split pathname and filter out empty strings
  const pathSegments = pathname.split('/').filter(Boolean)

  // Create breadcrumb items with proper titles and hrefs
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Build href from segments up to current index
    const href = '/' + pathSegments.slice(0, index + 1).join('/')

    // Remove dashes and convert to title case
    const label = segment
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return { href, label }
  })

  return (
    <div className='top-0 z-10 sticky flex items-center gap-3 px-2 lg:px-5 h-[70px]'>
      {isMobile || state === 'collapsed' ? (
        <SidebarTrigger className='hover:bg-white/10 text-white' />
      ) : (
        <div className='md:hidden size-9' />
      )}

      <div className='flex flex-col lg:gap-1 py-1.5'>
        <Typography variant={'h6'} weight={'medium'}>
          {breadcrumbItems[breadcrumbItems.length - 1]?.label || 'Dashboard'}
        </Typography>
        <nav className='flex items-center space-x-1 text-sm'>
          {breadcrumbItems.map((item, index) => (
            <div key={index} className='flex items-center space-x-1'>
              {index === 0 ? (
                <Link href={item.href} className='text-muted hover:text-white transition-colors'>
                  {item.label}
                </Link>
              ) : (
                <span className='text-muted'>{item.label}</span>
              )}
              {index < breadcrumbItems.length - 1 && <ChevronRight className='size-5 text-muted' />}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'

import { NavMain } from '@/components/admin/layout/nav-main'
import { Sidebar, SidebarContent, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { navItems } from '@/data/siteConfig'
import { cn } from '@/lib/utils'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar()
  return (
    <Sidebar
      collapsible='offcanvas'
      className='border-[rgba(243,243,243,0.5)] border-r h-[calc(100vh-54px)]'
      {...props}
    >
      <div className={cn('h-full', isMobile ? 'bg-background' : 'bg-primary/8')}>
        <div className='flex items-center border-[rgba(243,243,243,0.5)] border-b h-[80px]'>
          <div className='flex justify-between items-center gap-2.5 p-2.5 w-full'>
            <span className='font-medium text-white text-lg'>Menu</span>
            <SidebarTrigger className='hover:bg-white/10 text-white' />
          </div>
        </div>
        <SidebarContent className='p-3 pb-16 h-[calc(100vh-118px)] overflow-y-scroll custom-scrollbar'>
          <NavMain items={navItems} />
        </SidebarContent>
      </div>
    </Sidebar>
  )
}

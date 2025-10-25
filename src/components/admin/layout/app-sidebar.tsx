'use client'

import * as React from 'react'

import { NavMain } from '@/components/admin/layout/nav-main'
import { Sidebar, SidebarContent, useSidebar } from '@/components/ui/sidebar'
import { navItems } from '@/data/siteConfig'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar()
  return (
    <Sidebar
      collapsible='offcanvas'
      {...props}
    >
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
    </Sidebar>
  )
}

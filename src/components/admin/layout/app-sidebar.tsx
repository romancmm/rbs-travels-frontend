'use client'

import * as React from 'react'

import { NavMain } from '@/components/admin/layout/nav-main'
import { Sidebar, SidebarContent, useSidebar } from '@/components/ui/sidebar'
import { navItems } from '@/data/siteConfig'
import Cookies from 'js-cookie'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()

  React.useEffect(() => {
    try {
      const isOpen = state !== 'collapsed'
      Cookies.set('sidebar_state', String(isOpen), { expires: 365, path: '/' })
    } catch { }
  }, [state])

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

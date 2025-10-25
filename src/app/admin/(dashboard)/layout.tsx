'use client'

import { AppSidebar } from '@/components/admin/layout/app-sidebar'
import BreadCrumbs from '@/components/admin/layout/BreadCrumbs'
import { SiteHeader } from '@/components/admin/layout/site-header'
import { PermissionProvider } from '@/components/providers/PermissionProvider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

type TProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: TProps) {
  return (
    <PermissionProvider>
      <SiteHeader />
      <div className='relative flex-1'>
        <SidebarProvider
          className='[&_[data-slot=sidebar-container]]:!top-[64px]'
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)'
            } as React.CSSProperties
          }
        >
          <AppSidebar variant='sidebar' />
          <SidebarInset className='relative overflow-x-hidden'>
            <BreadCrumbs />
            <div className='bg-gray-200 p-4 lg:p-6'>{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </PermissionProvider>
  )
}

'use client'

import Cookies from 'js-cookie'
import { AudioWaveform, GalleryVerticalEnd, Map, Settings2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { usePermissions } from '@/components/providers/PermissionProvider'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { navItems as adminNavItems } from '@/config/adminNavItems'

// Map admin config to NavMain items
const mapNavItems = (
  items: typeof adminNavItems,
  pathname: string,
  hasPermission?: (resource: string, action?: string) => boolean,
  loading?: boolean
) => {
  return items
    .filter((it) => {
      if (!it.permission) return true
      if (loading) return true // don't block UI while loading
      return hasPermission ? hasPermission(it.permission.resource, it.permission.action) : true
    })
    .map((it) => {
      const children =
        it?.children
          ?.filter((child) => {
            if (!child.permission) return true
            if (loading) return true
            return hasPermission
              ? hasPermission(child.permission.resource, child.permission.action)
              : true
          })
          .map((child) => ({ title: child.title, url: child.href })) || []

      const isActive =
        (!!it.href && pathname.startsWith(it.href)) ||
        children.some((c) => pathname.startsWith(c.url))

      return {
        title: it.title,
        url: it.href || '',
        icon: it.icon,
        isActive,
        // Only include items property if there are actually children
        ...(children.length > 0 && { items: children })
      }
    })
}

// Admin-centric data builder (user from cookie)
const buildAdminData = () => {
  // Read user from cookie named 'user'
  let cookieUser: any = null
  try {
    const raw = Cookies.get('user')
    if (raw) cookieUser = JSON.parse(raw)
  } catch {}

  const user = {
    name:
      cookieUser?.firstName && cookieUser?.lastName
        ? `${cookieUser.firstName} ${cookieUser.lastName}`
        : cookieUser?.name || 'Admin',
    email: cookieUser?.email || 'admin@example.com',
    avatar: cookieUser?.avatar || '/avatars/shadcn.jpg'
  }

  const projects = [
    { name: 'Settings', url: '/admin/settings', icon: Settings2 },
    // { name: 'Audit Log', url: '/admin/audit-log', icon: Command },
    { name: 'System Status', url: '/admin/status', icon: Map }
  ]

  const teams = [
    { name: 'RBS Travels', logo: GalleryVerticalEnd, plan: 'Admin' },
    { name: 'Operations', logo: AudioWaveform, plan: 'Internal' }
  ]

  return { user, projects, teams }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { hasPermission, loading } = usePermissions()
  const data = React.useMemo(() => buildAdminData(), [])
  const navMain = React.useMemo(
    () => mapNavItems(adminNavItems, pathname, hasPermission, loading),
    [pathname, hasPermission, loading]
  )
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain ?? []} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

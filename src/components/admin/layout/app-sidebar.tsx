'use client'

import { usePermissions } from '@/components/providers/PermissionProvider'
import { useSiteConfig } from '@/components/providers/store-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { navItems as adminNavItems } from '@/config/adminNavItems'
import Cookies from 'js-cookie'
import { GalleryVerticalEnd, Map, Settings2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { SiteSwitcher } from './team-switcher'

// A href "matches" the current path if it's an exact hit or a path segment
// prefix (so `/admin/blogs` matches `/admin/blogs/1` but not `/admin/blogs-x`).
const hrefMatches = (href: string, pathname: string) =>
  !!href && (pathname === href || pathname.startsWith(href.endsWith('/') ? href : `${href}/`))

// Sibling hrefs can overlap (e.g. `/admin/settings` vs
// `/admin/settings/logo-management`), so among all matches only the longest
// (most specific) one is considered the active entry.
const findActiveHref = (items: typeof adminNavItems, pathname: string) => {
  const candidates: string[] = []
  items.forEach((it) => {
    if (it.href) candidates.push(it.href)
    it.children?.forEach((child) => child.href && candidates.push(child.href))
  })

  return candidates
    .filter((href) => hrefMatches(href, pathname))
    .reduce<string | null>((best, href) => (!best || href.length > best.length ? href : best), null)
}

// Map admin config to NavMain items
const mapNavItems = (
  items: typeof adminNavItems,
  pathname: string,
  hasPermission?: (resource: string, action?: string) => boolean
) => {
  const activeHref = findActiveHref(items, pathname)

  return items
    .filter((it) => {
      if (!it.permission) return true
      return hasPermission ? hasPermission(it.permission.resource, it.permission.action) : false
    })
    .map((it) => {
      const children =
        it?.children?.map((child) => ({
          title: child.title,
          url: child.href,
          isActive: !!child.href && child.href === activeHref
        })) || []

      const isActive = (!!it.href && it.href === activeHref) || children.some((c) => c.isActive)

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
  let cookieUser: any = null
  try {
    const raw = Cookies.get('adminInfo')
    if (raw) cookieUser = JSON.parse(raw)
  } catch {}

  const user = {
    name:
      cookieUser?.firstName && cookieUser?.lastName
        ? `${cookieUser.firstName} ${cookieUser.lastName}`
        : cookieUser?.name || 'Guest Admin',
    email: cookieUser?.email || 'admin@example.com',
    avatar: cookieUser?.avatar || '/avatars/shadcn.jpg'
  }

  const projects = [
    { name: 'Settings', url: '/admin/settings', icon: Settings2 },
    // { name: 'Audit Log', url: '/admin/audit-log', icon: Command },
    { name: 'System Status', url: '/admin/status', icon: Map }
  ]

  return { user, projects }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { hasPermission, loading } = usePermissions()
  const { siteConfig } = useSiteConfig()
  const data = React.useMemo(() => buildAdminData(), [])

  const navMain = React.useMemo(
    () => (loading ? [] : mapNavItems(adminNavItems, pathname, hasPermission)),
    [pathname, hasPermission, loading]
  )

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SiteSwitcher
          siteName={siteConfig?.name || 'CMS Admin'}
          faviconUrl={siteConfig?.favicon || undefined}
          fallbackIcon={GalleryVerticalEnd}
        />
      </SidebarHeader>
      <SidebarContent>
        {loading ? (
          <div className='flex justify-center items-center p-4'>
            <div className='text-muted-foreground text-sm'>Loading permissions...</div>
          </div>
        ) : (
          <NavMain items={navMain ?? []} />
        )}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

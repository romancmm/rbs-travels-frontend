"use client"

import Cookies from "js-cookie"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { usePathname } from "next/navigation"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Admin-centric data builder (user from cookie)
const buildAdminData = (pathname: string) => {
  // Read user from cookie named 'user'
  let cookieUser: any = null
  try {
    const raw = Cookies.get('userInfo')
    if (raw) cookieUser = JSON.parse(raw)
  } catch { }

  const user = {
    name: cookieUser?.firstName && cookieUser?.lastName
      ? `${cookieUser.firstName} ${cookieUser.lastName}`
      : cookieUser?.name || 'Admin',
    email: cookieUser?.email || 'admin@example.com',
    avatar: cookieUser?.avatar || '/avatars/shadcn.jpg',
  }

  const navMain = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: SquareTerminal,
      isActive: pathname.startsWith('/admin/dashboard'),
      items: [],
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: Bot,
      items: [
        { title: 'All Users', url: '/admin/users' },
        { title: 'Invite', url: '/admin/users/invite' },
      ],
    },
    {
      title: 'Roles & Permissions',
      url: '/admin/roles',
      icon: Settings2,
      items: [
        { title: 'Roles', url: '/admin/roles' },
        { title: 'Permissions', url: '/admin/permissions' },
      ],
    },
    {
      title: 'Content',
      url: '/admin/content',
      icon: BookOpen,
      items: [
        { title: 'Pages', url: '/admin/content/pages' },
        { title: 'Media', url: '/admin/content/media' },
      ],
    },
    {
      title: 'Reports',
      url: '/admin/reports',
      icon: PieChart,
      items: [
        { title: 'Analytics', url: '/admin/reports/analytics' },
      ],
    },
  ]

  const projects = [
    { name: 'Settings', url: '/admin/settings', icon: Settings2 },
    { name: 'Audit Log', url: '/admin/audit-log', icon: Command },
    { name: 'System Status', url: '/admin/status', icon: Map },
  ]

  const teams = [
    { name: 'RBS Travels', logo: GalleryVerticalEnd, plan: 'Admin' },
    { name: 'Operations', logo: AudioWaveform, plan: 'Internal' },
  ]

  return { user, navMain, projects, teams }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const data = React.useMemo(() => buildAdminData(pathname), [pathname])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

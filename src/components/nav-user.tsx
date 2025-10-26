"use client"

import {
  Bell,
  ChevronsUpDown, Edit,
  Key,
  LogOut, User
} from "lucide-react"
import React from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', cache: 'no-store' })
    } catch { }
    // Clean any leftover client cookies (non-httpOnly)
    try {
      Cookies.remove('user', { path: '/' })
    } catch { }
    router.push('/admin/login')
  }

  type MenuItemConfig = {
    key: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    href?: string
    onClick?: () => void
  }

  type MenuGroupConfig = {
    key: string
    items: MenuItemConfig[]
  }

  const menuGroups: MenuGroupConfig[] = React.useMemo(
    () => [
      {
        key: 'promo',
        items: [
          { key: 'profile', label: 'View Profile', icon: User, href: '/admin/profile' },
        ]
      },
      {
        key: 'account',
        items: [

          { key: 'update', label: 'Update Profile', icon: Edit, href: '/admin/update-profile' },
          { key: 'password', label: 'Change Password', icon: Key, href: '/admin/change-password' },
          { key: 'notifications', label: 'Notifications', icon: Bell, href: '/admin/notifications' }
        ]
      }
    ],
    []
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="rounded-lg w-8 h-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">A</AvatarFallback>
              </Avatar>
              <div className="flex-1 grid text-sm text-left leading-tight">
                <span className="font-medium truncate">{user.name}</span>
                <span className="text-xs truncate">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
                <Avatar className="rounded-lg w-8 h-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="flex-1 grid text-sm text-left leading-tight">
                  <span className="font-medium truncate">{user.name}</span>
                  <span className="text-xs truncate">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* Menu Groups */}
            {menuGroups.map((group, gi) => (
              <React.Fragment key={group.key}>
                {gi === 0 && <DropdownMenuSeparator />}
                <DropdownMenuGroup>
                  {group.items.map((item: any) => {
                    const Icon = item.icon
                    const handleClick = item.onClick
                      ? item.onClick
                      : item.href
                        ? () => router.push(item.href!)
                        : undefined
                    return (
                      <DropdownMenuItem key={item.key} onClick={handleClick}>
                        <Icon />
                        {item.label}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </React.Fragment>
            ))}

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

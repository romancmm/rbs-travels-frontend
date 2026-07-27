'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import * as React from 'react'

import CustomLink from '@/components/common/CustomLink'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
    isActive?: boolean
  }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === 'collapsed' && !isMobile

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          const hasChildren = !!item.items && item.items.length > 0

          return (
            <SidebarMenuItem key={index}>
              {hasChildren && isCollapsed ? (
                <NavMainHoverItem item={item} />
              ) : hasChildren ? (
                <Collapsible defaultOpen={item.isActive} className='group/collapsible'>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                      {item.icon && <item.icon className='w-4 lg:w-6 h-4 lg:h-6' />}
                      <span>{item.title}</span>
                      <ChevronRight className='ml-auto group-data-[state=open]/collapsible:rotate-90 transition-transform duration-200' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem, idx) => (
                        <SidebarMenuSubItem key={idx}>
                          <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                            <CustomLink href={subItem.url}>{subItem.title}</CustomLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton tooltip={item.title} isActive={item.isActive} asChild>
                  <CustomLink href={item.url}>
                    {item.icon && <item.icon className='w-4 lg:w-5 h-4 lg:h-5' />}
                    <span>{item.title}</span>
                  </CustomLink>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

// Shown instead of the collapsible trigger when the sidebar is collapsed to
// icons: hovering the item reveals its sub-items in a flyout.
function NavMainHoverItem({ item }: { item: NavItem }) {
  const [open, setOpen] = React.useState(false)
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimeout = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
  }

  const handleOpen = () => {
    clearCloseTimeout()
    setOpen(true)
  }

  const handleClose = () => {
    clearCloseTimeout()
    closeTimeout.current = setTimeout(() => setOpen(false), 150)
  }

  React.useEffect(() => clearCloseTimeout, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SidebarMenuButton onMouseEnter={handleOpen} onMouseLeave={handleClose} isActive={item.isActive}>
          {item.icon && <item.icon className='w-4 lg:w-6 h-4 lg:h-6' />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent
        side='right'
        align='start'
        sideOffset={8}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        className='w-48 p-1'
      >
        <div className='px-2 py-1.5 text-xs font-medium text-muted-foreground'>{item.title}</div>
        <div className='flex flex-col gap-0.5'>
          {item.items?.map((subItem, idx) => (
            <CustomLink
              key={idx}
              href={subItem.url}
              className={cn(
                'rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                subItem.isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              )}
            >
              {subItem.title}
            </CustomLink>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

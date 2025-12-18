'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'

import CustomLink from '@/components/common/CustomLink'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            {item.items && item.items.length > 0 ? (
              <Collapsible defaultOpen={item.isActive} className='group/collapsible'>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon className='w-4 lg:w-6 h-4 lg:h-6' />}
                    <span>{item.title}</span>
                    <ChevronRight className='ml-auto group-data-[state=open]/collapsible:rotate-90 transition-transform duration-200' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem, idx) => (
                      <SidebarMenuSubItem key={idx}>
                        <SidebarMenuSubButton asChild>
                          <CustomLink href={subItem.url}>{subItem.title}</CustomLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarMenuButton tooltip={item.title} asChild>
                <a href={item.url}>
                  {item.icon && <item.icon className='w-4 lg:w-5 h-4 lg:h-5' />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

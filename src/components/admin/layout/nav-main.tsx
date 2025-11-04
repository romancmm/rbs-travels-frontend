'use client'

import { usePermissions } from '@/components/providers/PermissionProvider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useSidebar } from '@/components/ui/sidebar'
import { CircleDashed, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  children?: Omit<NavItem, 'icon' | 'children'>[]
  permission?: { resource: string; action?: string }
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const { setOpenMobile: setOpen } = useSidebar()
  const { hasPermission, loading } = usePermissions()

  // Filter menu items based on permissions
  const filteredItems = loading
    ? []
    : items
      .filter((item) => {
        // Check if user has permission for parent item
        const hasParentAccess = item.permission
          ? hasPermission(item.permission.resource, item.permission.action)
          : true // If no specific permission required, allow access

        if (!hasParentAccess && item?.children?.length === 0) {
          return false
        }

        // Filter children based on permissions
        if (Array.isArray(item.children) && item.children.length > 0) {
          const filteredChildren = item.children.filter((child) => {
            return child.permission
              ? hasPermission(child.permission.resource, child.permission.action)
              : true
          })

          // Only show parent if it has accessible children or if parent itself is accessible
          return filteredChildren.length > 0 || hasParentAccess
        }

        return hasParentAccess
      })
      .map((item) => ({
        ...item,
        children: item?.children?.filter((child) => {
          return child.permission
            ? hasPermission(child.permission.resource, child.permission.action)
            : true
        })
      }))

  // Calculate which accordion items should be open based on active children
  const defaultOpenValues = (() => {
    const openValues: string[] = []
    filteredItems.forEach((item, index) => {
      if (item.children && item.children.length > 0) {
        const hasActiveChild = item.children.some((child) => pathname === child.href)
        if (hasActiveChild) {
          openValues.push(`item-${index}`)
        }
      }
    })
    return openValues
  })()

  // Check if a child item is active
  const isChildActive = (childHref: string) => pathname === childHref

  // Check if parent has any active children
  const hasActiveChild = (item: NavItem) => {
    return item.children && item.children.some((child) => pathname === child.href)
  }

  if (loading) {
    return (
      <div className='space-y-2'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='animate-pulse'>
            <div className='bg-foreground rounded-lg w-full h-10' />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-1'>
      <Accordion type='multiple' className='w-full' defaultValue={defaultOpenValues}>
        {filteredItems.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0

          if (hasChildren) {
            const parentHasActiveChild = hasActiveChild(item)

            return (
              <AccordionItem key={item.title} value={`item-${index}`} className='border-none'>
                <div
                  className={`rounded-lg transition-all duration-200 ${
                    parentHasActiveChild
                      ? 'bg-primary/10 shadow-sm'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <AccordionTrigger className='flex items-center p-0 w-full hover:no-underline [&[data-state=open]>div>svg:last-child]:rotate-180'>
                    <div className='flex justify-between items-center gap-3 px-3 py-2.5 w-full'>
                      <div className='flex items-center gap-3'>
                        {item.icon && (
                          <item.icon
                            className={`size-[18px] ${
                              parentHasActiveChild ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            parentHasActiveChild ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                </div>
                <AccordionContent className='pb-1'>
                  <div className='space-y-0.5 mt-1 ml-3 pl-4 border-l-2 border-border/40'>
                    {item?.children?.map((subItem) => {
                      const isActive = isChildActive(subItem.href)
                      return (
                        <Link
                          onClick={() => {
                            setOpen(false)
                          }}
                          key={subItem.title}
                          href={subItem.href}
                          className={`px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center gap-2.5 group ${
                            isActive
                              ? 'bg-primary/10 text-primary font-medium shadow-sm'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          }`}
                        >
                          <CircleDashed
                            className={`size-2 ${
                              isActive ? 'text-primary' : 'text-muted-foreground/50 group-hover:text-foreground'
                            }`}
                            strokeWidth={3}
                          />
                          <span className='flex-1'>{subItem.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          }

          return (
            <div
              key={item.title}
              className={`rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? 'bg-primary/10 shadow-sm'
                  : 'hover:bg-accent/50'
              }`}
            >
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 w-full group'
              >
                {item.icon && (
                  <item.icon
                    className={`size-[18px] ${
                      pathname === item.href ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                )}
                <span
                  className={`text-sm font-medium ${
                    pathname === item.href ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            </div>
          )
        })}
      </Accordion>
    </div>
  )
}

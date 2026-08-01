'use client'

import CustomLink from '@/components/common/CustomLink'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { useSidebar } from '@/components/ui/sidebar'
import { Home, type LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

const DASHBOARD_HREF = '/admin/dashboard'

interface CrumbData {
  href: string
  label: string
  icon?: LucideIcon
}

export default function BreadCrumbs() {
  const pathname = usePathname()
  const { isMobile, state } = useSidebar()

  // Split pathname and filter out empty strings
  const pathSegments = pathname.split('/').filter(Boolean)

  // Drop the leading "admin" segment — the Dashboard crumb below stands in for it
  const restSegments = pathSegments.slice(1)
  const isDashboardRoot =
    restSegments.length === 0 ||
    (restSegments.length === 1 && restSegments[0].toLowerCase() === 'dashboard')

  const restItems: CrumbData[] = isDashboardRoot
    ? []
    : restSegments.map((segment, index) => {
        const href = '/admin/' + restSegments.slice(0, index + 1).join('/')

        // Remove dashes and convert to title case
        const label = segment
          .replace(/-/g, ' ')
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        return { href, label }
      })

  const breadcrumbItems: CrumbData[] = [
    { href: DASHBOARD_HREF, label: 'Dashboard', icon: Home },
    ...restItems
  ]

  return (
    <div className='flex flex-col items-start gap-0'>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1

            return (
              <React.Fragment key={item.href}>
                <BreadcrumbItem className='hidden md:block'>
                  {isLast ? (
                    <BreadcrumbPage className='flex items-center gap-1.5'>
                      {item.icon && <item.icon className='size-3.5' />}
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild className='flex items-center gap-1.5'>
                      <CustomLink href={item.href}>
                        {item.icon && <item.icon className='size-3.5' />}
                        {item.label}
                      </CustomLink>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className='hidden md:block' />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

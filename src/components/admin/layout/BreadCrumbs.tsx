'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useSidebar } from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function BreadCrumbs() {
  const pathname = usePathname()
  const { isMobile, state } = useSidebar()

  // Split pathname and filter out empty strings
  const pathSegments = pathname.split('/').filter(Boolean)

  // Create breadcrumb items with proper titles and hrefs
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Build href from segments up to current index
    const href = '/' + pathSegments.slice(0, index + 1).join('/')

    // Remove dashes and convert to title case
    const label = segment
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return { href, label }
  })

  return (
    <div className='flex flex-col items-start gap-0'>
      {/* <Typography variant={'body2'} weight={'medium'}>
        {breadcrumbItems[breadcrumbItems.length - 1]?.label || 'Dashboard'}
      </Typography> */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbItems?.length - 1 !== index && <BreadcrumbSeparator className="hidden md:block" />}
            </React.Fragment>
          ))}

          {/* <BreadcrumbItem>
            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          </BreadcrumbItem> */}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

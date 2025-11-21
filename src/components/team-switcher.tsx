'use client'

import { BarChart3, ChevronsUpDown, ExternalLink, FileText, Settings } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import CustomImage from './common/CustomImage'

export function SiteSwitcher({
  siteName,
  faviconUrl,
  fallbackIcon
}: {
  siteName: string
  faviconUrl?: string
  fallbackIcon?: React.ElementType
}) {
  const { isMobile } = useSidebar()
  const [imageError, setImageError] = React.useState(false)
  const FallbackIcon = fallbackIcon

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex justify-center items-center bg-sidebar-primary rounded-lg size-10 aspect-square text-sidebar-primary-foreground'>
                {faviconUrl && !imageError ? (
                  <CustomImage
                    src={faviconUrl}
                    alt={siteName}
                    width={32}
                    height={32}
                    className='size-8 object-contain'
                    onError={() => setImageError(true)}
                  />
                ) : FallbackIcon ? (
                  <FallbackIcon className='size-4' />
                ) : (
                  <Settings className='size-4' />
                )}
              </div>
              <div className='flex-1 grid text-sm text-left leading-tight'>
                <span className='font-medium truncate'>{siteName}</span>
                <span className='text-xs truncate'>Admin Panel</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuItem asChild className='gap-2 p-2 cursor-pointer'>
              <Link href='/' target='_blank'>
                <div className='flex justify-center items-center border rounded-md size-6'>
                  <ExternalLink className='size-3.5 shrink-0' />
                </div>
                Visit Site
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='gap-2 p-2 cursor-pointer'>
              <Link href='/admin/settings'>
                <div className='flex justify-center items-center border rounded-md size-6'>
                  <Settings className='size-3.5 shrink-0' />
                </div>
                Site Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='gap-2 p-2 cursor-pointer'>
              <Link href='/admin/pages'>
                <div className='flex justify-center items-center border rounded-md size-6'>
                  <FileText className='size-3.5 shrink-0' />
                </div>
                Manage Pages
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className='gap-2 p-2 cursor-pointer'>
              <Link href='/admin/analytics'>
                <div className='flex justify-center items-center bg-transparent border rounded-md size-6'>
                  <BarChart3 className='size-4' />
                </div>
                <div className='font-medium'>View Analytics</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

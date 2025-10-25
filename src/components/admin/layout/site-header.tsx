'use client'

import CustomLink from '@/components/common/CustomLink'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  createUserProfileMenuConfig,
  headerConfig,
  notificationActionsConfig,
  type MenuItem
} from '@/config/menuConfig'
import { useNotifications } from '@/hooks/useNotifications'
import { useAdminStore } from '@/stores/admin-info'
import { Bell, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function SiteHeader() {
  const { adminInfo, clearAdminInfo } = useAdminStore()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const router = useRouter()

  // Create menu configuration with clearAdminInfo function and router
  const userMenuItems = createUserProfileMenuConfig(clearAdminInfo, router)

  // Notification actions
  const handleNotificationClick = (id: number) => {
    markAsRead(id)
  }

  const handleViewAllNotifications = () => {
    console.log('View all notifications')
    // Navigate to notifications page or expand view
  }

  // Render menu items helper
  const renderMenuItem = (item: MenuItem, showSeparator?: boolean) => {
    const IconComponent = item.icon as LucideIcon

    const menuContent = (
      <>
        {IconComponent && <IconComponent className='mr-2 w-4 h-4' />}
        <span>{item.label}</span>
      </>
    )

    return (
      <div key={item.key}>
        {(showSeparator || item.divider) && <DropdownMenuSeparator />}

        {/* If item has href, use CustomLink for navigation */}
        {item.href ? (
          <CustomLink href={item.href} className='block'>
            <DropdownMenuItem
              className={`cursor-pointer text-base w-full text-muted ${item.danger ? 'text-red-600 focus:text-red-600' : ''
                } ${item.className || ''}`}
              disabled={item.disabled}
              onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing on navigation
            >
              {menuContent}
            </DropdownMenuItem>
          </CustomLink>
        ) : (
          /* If item has onClick, use button behavior */
          <DropdownMenuItem
            className={`cursor-pointer text-base ${item.className || ''}`}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {menuContent}
          </DropdownMenuItem>
        )}
      </div>
    )
  }

  return (
    <header className='top-0 z-50 sticky flex items-center bg-background px-4 lg:px-6 border-primary/60 border-b h-16'>
      <div className='flex justify-between items-center w-full'>
        {/* Logo Section */}
        <div className='relative w-[227px] h-9'>
          <Image
            src={headerConfig.logo.src}
            alt={headerConfig.logo.alt}
            width={headerConfig.logo.width}
            height={headerConfig.logo.height}
            className='object-contain'
          />
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-2 lg:gap-4'>
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='relative'>
                <Bell />
                {unreadCount > 0 && (
                  <Badge className='top-0 right-0 absolute bg-red-500 hover:bg-red-600 p-0 rounded-full min-w-[16px] h-4 text-white text-xs'>
                    {unreadCount > headerConfig.notifications.maxDisplayCount
                      ? `${headerConfig.notifications.maxDisplayCount}+`
                      : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='bg-foreground w-80'>
              <DropdownMenuLabel className='flex justify-between items-center'>
                <span>Notifications</span>
                <div className='flex items-center gap-2'>
                  {unreadCount > 0 && (
                    <Badge variant='secondary' className='text-xs'>
                      {unreadCount} new
                    </Badge>
                  )}
                  {unreadCount > 0 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='p-1 h-auto text-xs'
                      onClick={markAllAsRead}
                    >
                      {notificationActionsConfig.markAllRead.label}
                    </Button>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div
                className='overflow-y-auto'
                style={{ maxHeight: `${headerConfig.notifications.maxHeight}px` }}
              >
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className='flex-col items-start p-3 cursor-pointer'
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className='flex justify-between items-start w-full'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <h4 className='font-medium text-base'>{notification.title}</h4>
                            {notification.unread && (
                              <div className='bg-blue-500 rounded-full w-2 h-2'></div>
                            )}
                          </div>
                          <p className='text-muted text-sm line-clamp-2'>{notification.message}</p>
                          <span className='mt-1 text-muted-foreground text-xs'>
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className='p-4 text-muted-foreground text-sm text-center'>
                    No notifications
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='justify-center cursor-pointer'
                    onClick={handleViewAllNotifications}
                  >
                    <span className='text-sm'>{notificationActionsConfig.viewAll.label}</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          {adminInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='flex items-center gap-[5px] p-2 h-auto'>
                  <Avatar className='w-9 h-9'>
                    <AvatarImage src={'/'} alt={adminInfo?.firstName} />
                    <AvatarFallback className='bg-gradient-to-br from-gray-300 to-gray-500 text-white'>
                      {adminInfo
                        ? `${adminInfo.firstName?.charAt(0) ?? ''}${adminInfo.lastName?.charAt(0) ?? ''
                        }`
                        : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <span className='hidden sm:block font-medium text-white text-base leading-[1.1]'>
                    {adminInfo?.firstName + ' ' + adminInfo?.lastName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='bg-foreground w-56'>
                <DropdownMenuLabel>
                  <div className='flex flex-col space-y-1'>
                    <p className='font-medium text-base leading-none'>
                      {adminInfo?.firstName + ' ' + adminInfo?.lastName}
                    </p>
                    <p className='text-muted-foreground text-xs leading-none'>{adminInfo?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Render user menu items from configuration */}
                {userMenuItems.map((item, index) =>
                  renderMenuItem(item, index === userMenuItems.length - 1 && item.danger)
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Avatar className='w-9 h-9'>
              <AvatarFallback className='bg-gradient-to-br from-gray-300 to-gray-500 text-white'>
                AD
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  )
}

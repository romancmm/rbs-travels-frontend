'use client'

import { ChevronsUpDown, LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { createUserProfileMenuConfig, MenuItem, ModalType } from '@/config/menuConfig'
import { useAdminStore } from '@/stores/admin-info'
import { useRouter } from 'next/navigation'
import ProfileModal from './admin/modals/ProfileModal'
import SecurityModal from './admin/modals/SecurityModal'
import SettingsModal from './admin/modals/SettingsModal'
import CustomLink from './common/CustomLink'

export function NavUser({
  user
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [openModal, setOpenModal] = useState<ModalType>(null)

  // Manually hydrate the store on mount
  useEffect(() => {
    useAdminStore.persist.rehydrate()
  }, [])

  // Handle modal opening
  const handleOpenModal = (modalType: ModalType) => {
    setOpenModal(modalType)
  }

  const userMenuItems = createUserProfileMenuConfig(handleOpenModal)

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

        {/* If item has onClick (modal or action), use button behavior */}
        {item.onClick ? (
          <DropdownMenuItem
            className={`cursor-pointer ${item.danger ? 'text-destructive' : ''} ${
              item.className || ''
            }`}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {menuContent}
          </DropdownMenuItem>
        ) : item.href ? (
          /* If item has href, use CustomLink for navigation */
          <CustomLink href={item.href} className='block'>
            <DropdownMenuItem
              className={`cursor-pointer w-full ${item.className || ''}`}
              disabled={item.disabled}
              onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing on navigation
            >
              {menuContent}
            </DropdownMenuItem>
          </CustomLink>
        ) : (
          /* Fallback for items with neither onClick nor href */
          <DropdownMenuItem
            className={`cursor-pointer ${item.className || ''}`}
            disabled={item.disabled}
          >
            {menuContent}
          </DropdownMenuItem>
        )}
      </div>
    )
  }

  // Group menu items by their functionality
  const accountItems = userMenuItems.filter((item) => ['profile', 'settings'].includes(item.key))
  const otherItems = userMenuItems.filter((item) => ['messages', 'security'].includes(item.key))

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='rounded-lg w-8 h-8'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='rounded-lg'>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 grid text-sm text-left leading-tight'>
                <span className='font-medium truncate'>{user.name}</span>
                <span className='text-xs truncate'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-sm text-left'>
                <Avatar className='rounded-lg w-8 h-8'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 grid text-sm text-left leading-tight'>
                  <span className='font-medium truncate'>{user.name}</span>
                  <span className='text-xs truncate'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Account Group */}
            <DropdownMenuGroup>
              {accountItems.map((item) => renderMenuItem(item))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Communication Group */}
            <DropdownMenuGroup>{otherItems.map((item) => renderMenuItem(item))}</DropdownMenuGroup>

            {/* Render all remaining menu items (including logout) */}
            {userMenuItems
              .filter((item) => !['profile', 'settings', 'messages', 'security'].includes(item.key))
              .map((item, index, arr) =>
                renderMenuItem(item, index === arr.length - 1 && item.danger)
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <ProfileModal isOpen={openModal === 'profile'} onClose={() => setOpenModal(null)} />
      <SettingsModal isOpen={openModal === 'settings'} onClose={() => setOpenModal(null)} />
      <SecurityModal isOpen={openModal === 'security'} onClose={() => setOpenModal(null)} />
    </SidebarMenu>
  )
}

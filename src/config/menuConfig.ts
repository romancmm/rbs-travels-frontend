import { adminLogout } from '@/action/auth'
import { LogOut, Settings, Shield, User, type LucideIcon } from 'lucide-react'

// Modal types
export type ModalType = 'profile' | 'settings' | 'security' | null

// Base menu item interface
export interface BaseMenuItem {
  key: string
  label: string
  icon?: LucideIcon
  onClick?: () => void | Promise<void>
  className?: string
  disabled?: boolean
  href?: string
  target?: '_blank' | '_self'
  modal?: ModalType
}

// Extended menu item with danger state and divider
export interface MenuItem extends BaseMenuItem {
  danger?: boolean
  divider?: boolean
  children?: MenuItem[]
}

// User profile menu configuration factory
export const createUserProfileMenuConfig = (
  // router: AppRouterInstance,
  openModal?: (modalType: ModalType) => void,
  onLogoutRequest?: () => void
): MenuItem[] => [
  {
    key: 'profile',
    label: 'Profile',
    icon: User,
    modal: 'profile',
    onClick: openModal ? () => openModal('profile') : undefined
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    modal: 'settings',
    onClick: openModal ? () => openModal('settings') : undefined
  },
  {
    key: 'messages',
    label: 'Messages',
    icon: Settings,
    href: '/admin/messages'
  },
  {
    key: 'security',
    label: 'Change Password',
    icon: Shield,
    modal: 'security',
    onClick: openModal ? () => openModal('security') : undefined
  },
  {
    key: 'logout',
    label: 'Log out',
    icon: LogOut,
    danger: true,
    divider: true,
    onClick: onLogoutRequest
      ? () => onLogoutRequest()
      : async () => {
          // Call server action for logout
          try {
            await adminLogout()
            // Use Next.js router for navigation (no page reload)
            // router.push('/admin/login')
          } catch (error) {
            console.error('Logout failed:', error)
            // Redirect anyway for security using Next.js router
            // router.push('/admin/login')
          }
        }
  }
]

// Notification actions configuration
export const notificationActionsConfig = {
  markAllRead: {
    key: 'mark-all-read',
    label: 'Mark all read',
    action: 'markAllAsRead'
  },
  viewAll: {
    key: 'view-all',
    label: 'View all notifications',
    action: 'viewAllNotifications',
    href: '/admin/notifications'
  }
} as const

// Header configuration
export const headerConfig = {
  logo: {
    src: '/logo.svg',
    alt: 'UHQ Logo',
    width: 227,
    height: 36
  },
  notifications: {
    maxDisplayCount: 9,
    maxHeight: 300
  }
} as const

// Menu item types for better organization
export type MenuItemType = 'primary' | 'secondary' | 'danger'

// Enhanced menu item with type
export interface TypedMenuItem extends MenuItem {
  type?: MenuItemType
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
}

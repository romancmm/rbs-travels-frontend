import { adminLogout } from '@/action/auth'
import { LogOut, Mail, Settings, Shield, User, type LucideIcon } from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

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
}

// Extended menu item with danger state and divider
export interface MenuItem extends BaseMenuItem {
  danger?: boolean
  divider?: boolean
  children?: MenuItem[]
}

// User profile menu configuration factory
export const createUserProfileMenuConfig = (
  clearAdminInfo: () => void,
  router: AppRouterInstance
): MenuItem[] => [
  {
    key: 'profile',
    label: 'Profile',
    icon: User,
    href: '/admin/profile' // Navigation item - uses CustomLink
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings' // Navigation item - uses CustomLink
  },
  {
    key: 'messages',
    label: 'Messages',
    icon: Mail,
    href: '/admin/messages' // Navigation item - uses CustomLink
  },
  {
    key: 'security',
    label: 'Security',
    icon: Shield,
    href: '/admin/security' // Navigation item - uses CustomLink
  },
  {
    key: 'logout',
    label: 'Log out',
    icon: LogOut,
    danger: true,
    divider: true,
    onClick: async () => {
      // Clear client-side state first
      clearAdminInfo()

      // Call server action for logout
      try {
        await adminLogout()
        // Use Next.js router for navigation (no page reload)
        router.push('/admin/login')
      } catch (error) {
        console.error('Logout failed:', error)
        // Redirect anyway for security using Next.js router
        router.push('/admin/login')
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

// Alternative structured menu configuration with types
export const structuredUserMenu: TypedMenuItem[] = [
  {
    key: 'account-section',
    label: 'Account',
    type: 'primary',
    children: [
      {
        key: 'profile',
        label: 'Profile',
        icon: User,
        href: '/admin/profile'
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: Settings,
        href: '/admin/settings'
      }
    ]
  },
  {
    key: 'communication-section',
    label: 'Communication',
    type: 'secondary',
    children: [
      {
        key: 'messages',
        label: 'Messages',
        icon: Mail,
        href: '/admin/messages'
      },
      {
        key: 'security',
        label: 'Security',
        icon: Shield,
        href: '/admin/security'
      }
    ]
  },
  {
    key: 'logout',
    label: 'Log out',
    icon: LogOut,
    type: 'danger',
    divider: true,
    onClick: () => console.log('Logging out...')
  }
]

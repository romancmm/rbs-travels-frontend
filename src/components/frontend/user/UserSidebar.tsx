'use client'

import { userLogout } from '@/action/auth'
import CustomLink from '@/components/common/CustomLink'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BarChart3, Lock, LogOut, Package, Ticket, Truck, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface MenuItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  description?: string
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/user/profile',
    icon: BarChart3,
    description: 'Overview of your account'
  },
  // {
  //   label: 'My Profile',
  //   href: '/user/profile',
  //   icon: User,
  //   description: 'Manage your personal information'
  // },
  {
    label: 'Purchased Items',
    href: '/user/purchased-items',
    icon: Package,
    description: 'View your purchase history'
  },
  {
    label: 'Order Tracking',
    href: '#/user/tracking',
    icon: Truck,
    description: 'Track your deliveries'
  },
  {
    label: 'Affiliate Code',
    href: '#/user/affiliate',
    icon: Users,
    description: 'Manage your referral codes'
  },
  {
    label: 'Tickets',
    href: '#/user/tickets',
    icon: Ticket,
    description: 'Support tickets and help'
  }
]

const actionItems: MenuItem[] = [
  {
    label: 'Reset Password',
    href: '#/user/reset-password',
    icon: Lock,
    description: 'Change your password'
  }
]

export default function UserSidebar() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const isActive = (href: string) => {
    if (href === '/user') {
      return pathname === '/user'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await userLogout()
    toast.success('Logged out successfully!')
  }

  return (
    <div className='top-24 sticky space-y-4'>
      {/* User Info Card */}
      {/* <Card className='bg-background/50 backdrop-blur-sm p-4 border-border/50'>
        <div className='text-center'>
          <div className='flex justify-center items-center bg-linear-to-br from-primary/90 to-purple-400 mx-auto mb-3 rounded-full w-12 h-12'>
            <User className='w-6 h-6' />
          </div>
          <h3 className='font-semibold text-sm'>Welcome back!</h3>
          <p className='text-xs'>User Dashboard</p>
        </div>
      </Card> */}

      {/* Navigation Menu */}
      <Card className='bg-background/50 backdrop-blur-sm p-2 border-border/50'>
        <nav className='space-y-1'>
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const isHovered = hoveredItem === item.href

            return (
              <CustomLink
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
                  ${active
                    ? 'bg-linear-to-r from-primary to-primary/80 text-white border border-primary/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                  ${isHovered ? 'transform scale-[1.02]' : ''}
                `}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`
                    transition-all duration-200 
                    ${active ? 'text-foreground' : '  group-hover:text-muted'}
                    ${isHovered ? 'transform rotate-12' : ''}
                  `}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className={`font-medium text-sm ${active ? 'text-foreground' : ''}`}>
                    {item.label}
                  </div>
                  {/* {isHovered && (
                    <div className='slide-in-from-left-2 mt-0.5 h-0 group-hover:h-auto text-xs animate-in duration-200'>
                      {item.description}
                    </div>
                  )} */}
                </div>
                {active && <div className='bg-primary rounded-full w-2 h-2 animate-pulse' />}
              </CustomLink>
            )
          })}
        </nav>

        <Separator className='bg-white/20 my-3' />

        {/* Action Items */}
        <div className='space-y-1'>
          {actionItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const isHovered = hoveredItem === item.href

            return (
              <CustomLink
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
                  ${active
                    ? 'bg-linear-to-r from-orange-500/20 to-red-500/20 text-white border border-orange-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                  ${isHovered ? 'transform scale-[1.02]' : ''}
                `}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`
                    transition-all duration-200 
                    ${active ? 'text-orange-400' : 'text-white/60 group-hover:text-white/80'}
                    ${isHovered ? 'transform rotate-12' : ''}
                  `}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className={`font-medium text-sm ${active ? 'text-white' : ''}`}>
                    {item.label}
                  </div>
                  {/* {isHovered && (
                    <div className='slide-in-from-left-2 mt-0.5 text-white/50 text-xs animate-in duration-200'>
                      {item.description}
                    </div>
                  )} */}
                </div>
                {active && <div className='bg-orange-400 rounded-full w-2 h-2 animate-pulse' />}
              </CustomLink>
            )
          })}

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant='ghost'
            className={`
              group relative cursor-pointer flex items-center justify-start gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
               hover:bg-red-500/10
              ${hoveredItem === 'logout' ? 'transform scale-[1.02] bg-red-500/20 py-2_h-14' : ''}
            `}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              className={`
                transition-all duration-200 
                ${hoveredItem === 'logout' ? 'transform rotate-12' : ''}
              `}
            >
              <LogOut size={18} strokeWidth={2} />
            </div>
            <div className='flex-1 text-left'>
              <div className='font-medium text-sm'>Logout</div>
              {/* {hoveredItem === 'logout' && (
                <div className='slide-in-from-left-2 mt-0.5 text-xs animate-in duration-200'>
                  Sign out of your account
                </div>
              )} */}
            </div>
          </Button>
        </div>
      </Card>
    </div>
  )
}

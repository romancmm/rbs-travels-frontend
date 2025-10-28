'use client'

import { MoreVertical } from 'lucide-react'

import CustomLink from '@/components/common/CustomLink'
import { usePermissions } from '@/components/providers/PermissionProvider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

// Action item type for dropdown menu
export interface ActionItem<T = any> {
  type: 'link' | 'action' | 'separator'
  label?: string
  icon?: React.ComponentType<{ size?: number }>
  href?: string | ((data: T) => string)
  onClick?: (data: T) => void
  variant?: 'default' | 'destructive'
  className?: string
  disabled?: boolean | ((data: T) => boolean)
  visible?: boolean | ((data: T) => boolean)
  permission?: { resource: string; actions: string | string[] }
}

interface ActionsDropdownProps<T = any> {
  data: T
  actions: ActionItem<T>[]
  triggerClassName?: string
  contentClassName?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function ActionsDropdown<T = any>({
  data,
  actions,
  triggerClassName = 'hover:bg-white/10 p-0 w-8 h-8 text-white/60 hover:text-white',
  contentClassName = 'bg-background border-white/20 w-44 text-white',
  align = 'end',
  side = 'bottom'
}: ActionsDropdownProps<T>) {
  const { hasPermission } = usePermissions()

  // Filter actions based on permissions
  const filteredActions = actions.filter((action) => {
    // Always show separators
    if (action.type === 'separator') return true

    // If no permission required, show the action
    if (!action.permission) return true

    // Check if user has the required permission
    const { resource, actions: permissionActions } = action.permission

    // Handle both string and array of actions
    if (Array.isArray(permissionActions)) {
      return permissionActions.some((permAction) => hasPermission(resource, permAction))
    } else {
      return hasPermission(resource, permissionActions)
    }
  })

  const renderActionItem = (item: ActionItem<T>, index: number) => {
    // Check visibility
    const isVisible =
      typeof item.visible === 'function' ? item.visible(data) : item.visible !== false
    if (!isVisible) return null

    // Handle separator
    if (item.type === 'separator') {
      return <DropdownMenuSeparator key={`separator-${index}`} className='bg-white/20' />
    }

    // Check if disabled
    const isDisabled =
      typeof item.disabled === 'function' ? item.disabled(data) : item.disabled || false

    const Icon = item.icon
    const baseClassName = item.className || 'hover:bg-white/10 focus:bg-white/10'
    const disabledClassName = isDisabled ? 'opacity-50 cursor-not-allowed' : ''
    const finalClassName = `${baseClassName} ${disabledClassName}`.trim()

    // Handle link type
    if (item.type === 'link' && item.href) {
      const href = typeof item.href === 'function' ? item.href(data) : item.href

      return (
        <DropdownMenuItem key={item.label} className={finalClassName} asChild disabled={isDisabled}>
          <CustomLink href={href} className='flex items-center gap-2 text-muted'>
            {Icon && <Icon size={16} />}
            {item.label}
          </CustomLink>
        </DropdownMenuItem>
      )
    }

    // Handle action type with href (Next.js Link navigation)
    if (item.type === 'action' && item.href) {
      const href = typeof item.href === 'function' ? item.href(data) : item.href

      return (
        <DropdownMenuItem key={item.label} className={finalClassName} asChild disabled={isDisabled}>
          <CustomLink href={href} className='flex items-center gap-2 text-muted'>
            {Icon && <Icon size={16} />}
            {item.label}
          </CustomLink>
        </DropdownMenuItem>
      )
    }

    // Handle action type with onClick
    if (item.type === 'action' && item.onClick) {
      return (
        <DropdownMenuItem
          key={item.label}
          className={finalClassName}
          disabled={isDisabled}
          onClick={() => !isDisabled && item.onClick?.(data)}
        >
          <div className='flex items-center gap-2'>
            {Icon && <Icon size={16} />}
            {item.label}
          </div>
        </DropdownMenuItem>
      )
    }

    return null
  }

  // Get visible actions by filtering out null items and checking visibility
  const visibleActions = filteredActions
    .map((action, index) => renderActionItem(action, index))
    .filter(Boolean)

  // Don't render dropdown if no visible actions
  // if (visibleActions.length === 0) {
  //   return null
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className={triggerClassName}>
          <MoreVertical className='w-4 h-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} side={side} className={contentClassName}>
        {visibleActions.length > 0 ? (
          visibleActions
        ) : (
          <DropdownMenuItem disabled className='justify-center text-muted-foreground text-center'>
            No actions available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Pre-configured action creators for common use cases
export function createViewAction<T extends { id: number | string }>(
  basePath: string,
  icon?: React.ComponentType<{ size?: number }>,
  permission?: { resource: string; actions: string | string[] }
): ActionItem<T> {
  return {
    type: 'link',
    label: 'View Details',
    icon,
    href: (data) => `${basePath}/${data.id}`,
    permission
  }
}

export function createEditAction<T extends { id: number | string }>(
  basePath: string,
  icon?: React.ComponentType<{ size?: number }>,
  permission?: { resource: string; actions: string | string[] }
): ActionItem<T> {
  return {
    type: 'link',
    label: 'Edit',
    icon,
    href: (data) => `${basePath}/${data.id}/edit`,
    permission
  }
}

export function createDeleteAction<T>(
  onDelete: (data: T) => void,
  icon?: React.ComponentType<{ size?: number }>,
  label: string = 'Delete',
  permission?: { resource: string; actions: string | string[] }
): ActionItem<T> {
  return {
    type: 'action',
    label,
    icon,
    variant: 'destructive',
    onClick: onDelete,
    className: '',
    permission
  }
}

export function createSeparator(): ActionItem {
  return {
    type: 'separator'
  }
}

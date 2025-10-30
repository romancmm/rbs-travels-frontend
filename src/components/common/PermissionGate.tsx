'use client'

import { usePermissions } from '@/components/providers/PermissionProvider'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import React from 'react'
import { buttonVariants } from '../ui/button'
import CustomLink from './CustomLink'

interface PermissionGateProps {
  resource: string
  action?: string
  fallback?: React.ReactNode
  children?: React.ReactNode
  href?: string
  onClick?: () => void
  title?: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  className?: string
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  resource,
  action,
  fallback = null,
  children,
  href,
  onClick,
  title,
  icon: Icon,
  className,
  disabled = false,
  size = 'default'
}) => {
  const { hasPermission, loading } = usePermissions()

  if (loading) {
    return fallback || <div className='bg-gray-200 rounded w-20 h-4 animate-pulse' />
  }

  if (!hasPermission(resource, action)) {
    return fallback
  }

  // If children are provided, render them (original behavior)
  if (children) {
    return <>{children}</>
  }

  // If no children but other props are provided, render as interactive element
  if (href || onClick || title || Icon) {
    const buttonClasses = cn('inline-flex items-center gap-2', className, buttonVariants({ size }))

    const content = (
      <>
        {Icon && <Icon size={16} />}
        {title && <span>{title}</span>}
      </>
    )

    if (href && !disabled) {
      return (
        <CustomLink href={href} className={buttonClasses}>
          {content}
        </CustomLink>
      )
    }

    if (onClick && !disabled) {
      return (
        <button onClick={onClick} className={buttonClasses} disabled={disabled}>
          {content}
        </button>
      )
    }

    // Render as static element if disabled or no interaction
    return <div className={buttonClasses}>{content}</div>
  }

  // Return null if no children or interactive props
  return null
}

// Convenience components for common actions
export const CanCreate: React.FC<Omit<PermissionGateProps, 'action'>> = ({
  size = 'default',
  ...props
}) => (
  <PermissionGate
    {...props}
    action='create'
    className={cn('font-semibold hover:text-background', buttonVariants({ size }), props.className)}
    size={size}
  />
)

export const AddButton: React.FC<Omit<PermissionGateProps, 'action'>> = ({
  size = 'default',
  ...props
}) => (
  <PermissionGate
    {...props}
    action='create'
    icon={props.icon || Plus}
    title={props.title || 'Add New'}
    className={cn('font-semibold hover:text-background', buttonVariants({ size }), props.className)}
    size={size}
  />
)

export const CanEdit: React.FC<Omit<PermissionGateProps, 'action'>> = (props) => (
  <PermissionGate {...props} action='update' />
)

export const CanDelete: React.FC<Omit<PermissionGateProps, 'action'>> = (props) => (
  <PermissionGate {...props} action='delete' />
)

export const CanView: React.FC<Omit<PermissionGateProps, 'action'>> = (props) => (
  <PermissionGate {...props} action='index' />
)

export const CanExport: React.FC<Omit<PermissionGateProps, 'action'>> = (props) => (
  <PermissionGate {...props} action='export' />
)

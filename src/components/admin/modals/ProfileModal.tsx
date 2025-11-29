'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { Calendar, Mail, Shield, User } from 'lucide-react'
import { useEffect } from 'react'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AdminProfileResponse {
  success: boolean
  message: string
  data: TAdmin
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data, loading, mutate } = useAsync<AdminProfileResponse>(
    () => '/auth/admin/me',
    false
  )

  useEffect(() => {
    if (isOpen) {
      mutate()
    }
  }, [isOpen, mutate])

  const adminInfo = data?.data

  const getInitials = (name?: string) => {
    if (!name) return 'AD'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const profileFields = [
    { icon: User, label: 'Name', value: adminInfo?.name },
    { icon: Mail, label: 'Email', value: adminInfo?.email },
    {
      icon: Shield,
      label: 'Role',
      value: adminInfo?.isSuperAdmin ? 'Super Admin' : 'Admin'
    },
    {
      icon: Calendar,
      label: 'Member Since',
      value: adminInfo?.createdAt
        ? new Date(adminInfo.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        : undefined
    }
  ].filter((field) => field.value)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Admin Profile</DialogTitle>
          <DialogDescription>View your profile information</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className='space-y-4 py-4'>
            <div className='flex items-center gap-4'>
              <Skeleton className='rounded-full w-16 h-16' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='w-2/3 h-4' />
                <Skeleton className='w-1/2 h-3' />
              </div>
            </div>
            <div className='space-y-3'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='w-full h-16' />
              ))}
            </div>
          </div>
        ) : (
          <div className='space-y-4 py-4'>
            {/* Avatar and Name */}
            <div className='flex items-center gap-4'>
              <Avatar className='w-16 h-16'>
                <AvatarImage src={adminInfo?.avatar || undefined} alt={adminInfo?.name} />
                <AvatarFallback className='bg-primary text-primary-foreground text-lg'>
                  {getInitials(adminInfo?.name)}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <h3 className='font-semibold text-lg'>{adminInfo?.name || 'Admin'}</h3>
                <p className='text-muted-foreground text-sm'>{adminInfo?.email}</p>
              </div>
            </div>

            {/* Status Badges */}
            <div className='flex flex-wrap gap-2'>
              {adminInfo?.isActive ? (
                <Badge variant='default' className='bg-green-600'>
                  Active
                </Badge>
              ) : (
                <Badge variant='secondary'>Inactive</Badge>
              )}
              {adminInfo?.isSuperAdmin && (
                <Badge variant='default' className='bg-purple-600'>
                  Super Admin
                </Badge>
              )}
              {adminInfo?.isAdmin && !adminInfo?.isSuperAdmin && (
                <Badge variant='default'>Admin</Badge>
              )}
            </div>

            {/* Profile Fields */}
            <div className='space-y-3'>
              {profileFields.map((field) => (
                <div
                  key={field.label}
                  className='flex items-center gap-3 bg-muted/50 p-3 rounded-lg'
                >
                  <field.icon className='w-5 h-5 text-muted-foreground' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-muted-foreground text-xs'>{field.label}</p>
                    <p className='font-medium text-sm truncate'>{field.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Permissions */}
            {adminInfo?.permissions && adminInfo.permissions.length > 0 && (
              <div className='space-y-2'>
                <p className='font-medium text-sm'>Permissions ({adminInfo.permissions.length})</p>
                <div className='flex flex-wrap gap-1.5 max-h-32 overflow-y-auto'>
                  {adminInfo.permissions.map((permission) => (
                    <Badge key={permission} variant='outline' className='text-xs'>
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className='flex justify-end'>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

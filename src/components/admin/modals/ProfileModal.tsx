'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useAdminStore } from '@/stores/admin-info'
import { Mail, Phone, Shield, User } from 'lucide-react'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { adminInfo } = useAdminStore()

  // if (!adminInfo) return null

  const profileFields = [
    { icon: User, label: 'Username', value: adminInfo?.username },
    { icon: User, label: 'First Name', value: adminInfo?.firstName },
    { icon: User, label: 'Last Name', value: adminInfo?.lastName },
    { icon: Mail, label: 'Email', value: adminInfo?.email },
    { icon: Phone, label: 'Phone', value: adminInfo?.phone },
    { icon: User, label: 'Telegram', value: adminInfo?.telegramUsername },
    { icon: Shield, label: 'Role', value: adminInfo?.role }
  ].filter((field) => field.value && field.value.trim() !== '')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Admin Profile</DialogTitle>
          <DialogDescription>View your profile information</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Status Badges */}
          <div className='flex flex-wrap gap-2'>
            {adminInfo?.isActive && (
              <span className='inline-flex items-center bg-green-100 px-2.5 py-0.5 rounded-full font-medium text-green-800 text-xs'>
                Active
              </span>
            )}
            {adminInfo?.isVerified && (
              <span className='inline-flex items-center bg-blue-100 px-2.5 py-0.5 rounded-full font-medium text-blue-800 text-xs'>
                Verified
              </span>
            )}
            {adminInfo?.isBanned && (
              <span className='inline-flex items-center bg-red-100 px-2.5 py-0.5 rounded-full font-medium text-red-800 text-xs'>
                Banned
              </span>
            )}
          </div>

          {/* Profile Fields */}
          <div className='space-y-3'>
            {profileFields.map((field) => (
              <div
                key={field.label}
                className='flex items-center gap-3 bg-foreground p-3 rounded-lg'
              >
                <field.icon className='w-5 h-5 text-muted-foreground' />
                <div className='flex-1 min-w-0'>
                  <p className='text-muted-foreground text-xs'>{field.label}</p>
                  <p className='font-medium text-sm truncate'>{field.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ban Reason if applicable */}
          {adminInfo?.isBanned && adminInfo.banReason && (
            <div className='bg-red-50 dark:bg-red-900/20 p-3 rounded-lg'>
              <p className='mb-1 font-medium text-red-600 dark:text-red-400 text-xs'>Ban Reason</p>
              <p className='text-red-700 dark:text-red-300 text-sm'>{adminInfo.banReason}</p>
            </div>
          )}
        </div>

        <div className='flex justify-end'>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

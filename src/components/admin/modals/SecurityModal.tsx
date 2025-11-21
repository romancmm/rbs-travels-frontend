'use client'

import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { showError } from '@/lib/errMsg'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const resetPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

interface SecurityModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SecurityModal({ isOpen, onClose }: SecurityModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      const response = await requests.post('/admin/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      })

      if (response?.success) {
        toast.success('Password changed successfully!')
        reset()
        onClose()
      }
    } catch (error) {
      showError(error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your password to keep your account secure</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 py-4'>
          <Controller
            name='currentPassword'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Current Password'
                type='password'
                placeholder='Enter current password'
                error={errors.currentPassword?.message}
                required
                {...field}
              />
            )}
          />

          <Controller
            name='newPassword'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='New Password'
                type='password'
                placeholder='Enter new password (min 8 characters)'
                error={errors.newPassword?.message}
                required
                {...field}
              />
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Confirm New Password'
                type='password'
                placeholder='Confirm new password'
                error={errors.confirmPassword?.message}
                required
                {...field}
              />
            )}
          />

          <div className='flex justify-end gap-3 pt-4'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

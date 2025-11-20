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
import { useAdminStore } from '@/stores/admin-info'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  telegramUsername: z.string().optional().or(z.literal(''))
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { adminInfo, setAdminInfo } = useAdminStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      phone: '',
      telegramUsername: ''
    }
  })

  // Reset form when modal opens with admin data
  useEffect(() => {
    if (isOpen && adminInfo) {
      reset({
        firstName: adminInfo.firstName || '',
        lastName: adminInfo.lastName || '',
        username: adminInfo.username || '',
        phone: adminInfo.phone || ''
      })
    }
  }, [isOpen, adminInfo, reset])

  const onSubmit = async (data: UpdateProfileData) => {
    try {
      const response = await requests.put(`/admin/admins/${adminInfo?.id}`, data)

      if (response?.success && response?.data) {
        // Update admin info in store
        setAdminInfo({
          email: response.data?.admin?.email,
          firstName: response.data?.admin?.firstName,
          id: response.data?.admin?.id,
          username: response.data?.admin?.username,
          lastName: response.data?.admin?.lastName,
          phone: response.data?.admin?.phone,
          telegramUsername: response.data?.admin?.telegramUsername,
          role: response.data?.admin?.role,
          isActive: response.data?.admin?.isActive,
          isBanned: response.data?.admin?.isBanned,
          banReason: response.data?.admin?.banReason,
          isVerified: response.data?.admin?.isVerified,
          customRole: response.data?.admin?.customRole
        })
        toast.success('Profile updated successfully!')
        onClose()
      }
    } catch (error) {
      showError(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Update Profile Settings</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 py-4'>
          <Controller
            name='firstName'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='First Name'
                type='text'
                placeholder='John'
                error={errors.firstName?.message}
                required
                {...field}
              />
            )}
          />

          {/* <Controller
            name='lastName'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Last Name'
                type='text'
                placeholder='Doe'
                error={errors.lastName?.message}
                required
                {...field}
              />
            )}
          /> */}

          {/* <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Username'
                type='text'
                placeholder='johndoe'
                error={errors.username?.message}
                {...field}
              />
            )}
          /> */}

          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Phone'
                type='text'
                placeholder='+1234567890'
                error={errors.phone?.message}
                {...field}
              />
            )}
          />

          <div className='flex justify-end gap-3 pt-4'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import CustomInput from '@/components/common/CustomInput'
import FileUploader from '@/components/common/FileUploader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { showError } from '@/lib/errMsg'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { Mail, User } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Invalid URL').optional().or(z.literal(''))
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

interface AdminProfileResponse {
  success: boolean
  message: string
  data: TAdmin
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { data, loading, mutate } = useAsync<AdminProfileResponse>(() => isOpen ? '/auth/admin/me' : '', false)

  const adminInfo = data?.data

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: adminInfo?.name || '',
      email: adminInfo?.email || '',
      avatar: adminInfo?.avatar || ''
    }
  })

  const avatarUrl = useWatch({ control, name: 'avatar' })
  const nameValue = useWatch({ control, name: 'name' })

  const getInitials = (name?: string) => {
    if (!name) return 'AD'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  useEffect(() => {
    if (isOpen) {
      mutate()
    }
  }, [isOpen, mutate])

  useEffect(() => {
    if (adminInfo) {
      reset({
        name: adminInfo.name || '',
        email: adminInfo.email || '',
        avatar: adminInfo.avatar || ''
      })
    }
  }, [adminInfo, reset])

  const onSubmit = async (formData: UpdateProfileData) => {
    try {
      const response = await requests.put(`/admin/profile`, formData)

      if (response?.success && response?.data) {
        const updatedAdmin = response.data

        Cookies.set(
          'adminInfo',
          JSON.stringify({
            name: updatedAdmin?.user?.name,
            email: updatedAdmin?.user?.email,
            avatar: updatedAdmin?.user?.avatar,
            isAdmin: updatedAdmin?.user?.isAdmin,
            isSuperAdmin: updatedAdmin?.isSuperAdmin
          }),
          {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            expires: 7
          }
        )

        mutate()
        toast.success('Profile updated successfully!')
        onClose()
      }
    } catch (error) {
      showError(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Update Profile Settings</DialogTitle>
          <DialogDescription>Manage your account information and avatar</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 py-4'>
          {loading ? (
            <div className='space-y-6'>
              <div className='flex items-center gap-6'>
                <Skeleton className='rounded-full w-20 h-20' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='w-3/4 h-4' />
                  <Skeleton className='w-1/2 h-3' />
                </div>
              </div>
              <Separator />
              <div className='space-y-4'>
                <Skeleton className='w-full h-10' />
                <Skeleton className='w-full h-10' />
              </div>
            </div>
          ) : (
            <>
              {/* Avatar Section */}
              <div className='space-y-4 bg-muted/50 p-6 rounded-lg'>
                <div className='flex items-center gap-6'>
                  <Avatar className='shadow-lg border-4 border-background w-20 h-20'>
                    <AvatarImage
                      src={avatarUrl || adminInfo?.avatar || undefined}
                      alt={nameValue || adminInfo?.name}
                    />
                    <AvatarFallback className='bg-primary font-semibold text-primary-foreground text-2xl'>
                      {getInitials(nameValue || adminInfo?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-lg'>
                      {nameValue || adminInfo?.name || 'Admin User'}
                    </h3>
                    <p className='text-muted-foreground text-sm'>{adminInfo?.email}</p>
                    {adminInfo?.isSuperAdmin && (
                      <span className='inline-flex items-center bg-purple-100 dark:bg-purple-900/30 mt-2 px-2 py-0.5 rounded-full font-medium text-purple-700 dark:text-purple-300 text-xs'>
                        Super Admin
                      </span>
                    )}
                  </div>
                </div>

              </div>

              <Separator />

              {/* Form Fields */}
              <div className='space-y-5'>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2 font-medium text-sm'>
                        <User className='w-4 h-4' />
                        Full Name
                      </Label>
                      <CustomInput
                        type='text'
                        placeholder='John Admin'
                        error={errors.name?.message}
                        required
                        {...field}
                      />
                    </div>
                  )}
                />

                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2 font-medium text-sm'>
                        <Mail className='w-4 h-4' />
                        Email Address
                      </Label>
                      <CustomInput
                        type='email'
                        placeholder='john@admin.com'
                        error={errors.email?.message}
                        required
                        {...field}
                      />
                    </div>
                  )}
                />


                <Controller
                  name='avatar'
                  control={control}
                  render={({ field }) => (
                    <div className='space-y-2'>
                      <Label className='font-medium text-sm'>Change Avatar</Label>
                      <FileUploader
                        value={field.value || ''}
                        onChangeAction={field.onChange}
                        multiple={false}
                        maxAllow={1}
                        size='small'
                      />
                      {errors.avatar && (
                        <p className='text-destructive text-sm'>{errors.avatar.message}</p>
                      )}
                      <p className='text-muted-foreground text-xs'>
                        Upload a new avatar or paste an image URL
                      </p>
                    </div>
                  )}
                />

              </div>
            </>
          )}

          <Separator />

          <div className='flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting || loading}>
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

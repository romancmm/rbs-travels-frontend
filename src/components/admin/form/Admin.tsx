'use client'

import CustomInput from '@/components/common/CustomInput'
import FileUploader from '@/components/common/FileUploader'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { showError } from '@/lib/errMsg'
import { AdminUser, CreateAdminType } from '@/lib/validations/schemas/admin'
import requests from '@/services/network/http'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface AdminFormProps {
  initialData?: AdminUser | null
  onClose?: () => void
  onSuccess?: () => void
}

const AdminForm = ({ initialData, onClose, onSuccess }: AdminFormProps) => {
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateAdminType>({
    mode: 'onSubmit',
    defaultValues: {
      avatar: initialData?.avatar || '',
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '', // Always require password input for new users
      isActive: initialData?.isActive ?? true,
      isAdmin: initialData?.isAdmin ?? true,
      roleId: initialData?.roleId || ''
    }
  })

  const onSubmit: SubmitHandler<CreateAdminType> = async (data: CreateAdminType) => {
    setLoading(true)
    try {
      // Ensure API call is made with proper endpoint
      const endpoint = initialData?.id ? `put` : `post`
      const url = `/admin/user/admins` + (initialData?.id ? `/${initialData?.id}` : '')

      await requests[endpoint](url, {
        ...data,
        ...(initialData?.id ? { id: initialData.id } : {})
      })

      toast.success(`Admin ${initialData?.id ? 'updated' : 'created'} successfully!`)

      // Call success callback to refresh parent data
      onSuccess?.()
      onClose?.()
    } catch (error) {
      showError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Basic Information */}
      <div className='flex flex-wrap *:flex-1 gap-4 *:min-w-[45%]'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <CustomInput
              label='Name'
              placeholder='Enter full name'
              error={errors.name?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <CustomInput
              label='Email'
              placeholder='Enter email address'
              type='email'
              error={errors.email?.message}
              {...field}
            />
          )}
        />

        {!initialData?.id && (
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Password'
                placeholder='Enter password'
                type='password'
                error={errors.password?.message}
                {...field}
              />
            )}
          />
        )}

        <Controller
          name='roleId'
          control={control}
          render={({ field }) => (
            <CustomInput
              label='Role ID'
              placeholder='Enter role ID (optional)'
              error={errors.roleId?.message}
              {...field}
            />
          )}
        />
      </div>

      {/* Status Checkboxes */}
      <div className='flex gap-6'>
        <Controller
          name='isActive'
          control={control}
          render={({ field }) => (
            <CustomInput
              type='switch'
              label='Status (Active)'
              error={errors.password?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className="">
        <div>
          <Label className='mb-2'>Thumbnail</Label>
          <Controller
            control={control}
            name='avatar'
            render={({ field }) => (
              <FileUploader
                value={field.value || ''}
                onChangeAction={field.onChange}
                multiple={false}
                maxAllow={1}
              />
            )}
          />
          {errors.avatar && (
            <span className='font-medium text-red-500 text-xs'>{errors.avatar.message}</span>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className='flex gap-3 pt-4'>
        <Button type='submit' disabled={loading}>
          {loading
            ? initialData?.id
              ? 'Updating...'
              : 'Creating...'
            : initialData?.id
              ? 'Update Admin'
              : 'Create Admin'}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={() => {
            onClose?.()
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default AdminForm

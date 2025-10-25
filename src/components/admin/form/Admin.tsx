'use client'

import CustomInput from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import { Button } from '@/components/ui/button'
import { showError } from '@/lib/errMsg'
import {
  AdminRole,
  AdminUser,
  CreateAdminSchema,
  CreateAdminType
} from '@/lib/validations/schemas/admin'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
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
    resolver: zodResolver(CreateAdminSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: initialData?.email || '',
      // password: '', // Always require password input
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      role: initialData?.role || AdminRole.ADMIN
    }
  })

  const onSubmit: SubmitHandler<CreateAdminType> = async (data) => {
    setLoading(true)
    try {
      // Ensure API call is made with proper endpoint
      const endpoint = initialData?.id ? `put` : `post`
      const url = `/admin` + (initialData?.id ? `/admins/${initialData?.id}` : '/create')

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
      <div className='flex flex-wrap [&>*]:flex-1 gap-4 [&>*]:min-w-[45%]'>
        <Controller
          name='firstName'
          control={control}
          render={({ field }) => (
            <CustomInput
              label='First Name'
              placeholder='Enter first name'
              error={errors.firstName?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='lastName'
          control={control}
          render={({ field }) => (
            <CustomInput
              label='Last Name'
              placeholder='Enter last name'
              error={errors.lastName?.message}
              {...field}
            />
          )}
        />

        {!initialData?.id && (
          <>
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
                  disabled={!!initialData?.id} // Disable if editing
                />
              )}
            />

            {/* Role Selection */}
            <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <div className='space-y-2'>
                  <CustomSelect
                    label='Role'
                    placeholder='Select role'
                    staticOptions={Object.values(AdminRole).map((role) => ({
                      title: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
                      value: role,
                      label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
                    }))}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                  />
                  {errors.role && <p className='text-destructive text-sm'>{errors.role.message}</p>}
                </div>
              )}
            />
          </>
        )}
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

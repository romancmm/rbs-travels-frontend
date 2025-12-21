'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { revalidateTags } from '@/action/data'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import { showError } from '@/lib/errMsg'
import { Permission, permissionSchema } from '@/lib/validations/schemas/permission'
import requests from '@/services/network/http'

type PermissionFormProps = {
  initialData?: Permission
  onClose: () => void
  onSuccess: () => void
}

export default function PermissionForm({ initialData, onClose, onSuccess }: PermissionFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Permission>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: initialData?.name || ''
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (initialData?.id) {
        await requests.put(`/admin/permission/${initialData.id}`, data)
        toast.success('Permission updated successfully')
      } else {
        await requests.post('/admin/permission', data)
        toast.success('Permission created successfully')
      }

      await revalidateTags('/admin/permission')
      onSuccess()
    } catch (error) {
      showError(error)
    }
  })

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <Controller
        control={control}
        name='name'
        render={({ field }) => (
          <CustomInput
            label='Permission Name'
            placeholder='e.g., admin.create, product.update'
            error={errors.name?.message}
            helperText='Format: resource.action (e.g., admin.create, category.read)'
            {...field}
          />
        )}
      />

      <div className='flex justify-end gap-3 pt-4'>
        <Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Permission' : 'Create Permission'}
        </Button>
      </div>
    </form>
  )
}

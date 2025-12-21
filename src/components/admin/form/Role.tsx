'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Circle } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { revalidateTags } from '@/action/data'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import useAsync from '@/hooks/useAsync'
import { showError } from '@/lib/errMsg'
import { Permission, Role, roleSchema } from '@/lib/validations/schemas/role'
import requests from '@/services/network/http'

type RoleFormData = Omit<Role, 'permissions'> & {
  permissions?: Permission[]
}

type RoleFormProps = {
  initialData?: Role
  onClose: () => void
  onSuccess: () => void
}

// Theme colors for different resource groups
const groupThemes = [
  'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
  'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800',
  'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
  'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
  'bg-pink-50 border-pink-200 dark:bg-pink-950/30 dark:border-pink-800',
  'bg-cyan-50 border-cyan-200 dark:bg-cyan-950/30 dark:border-cyan-800',
  'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800',
  'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800'
]

export default function RoleForm({ initialData, onClose, onSuccess }: RoleFormProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initialData?.permissions?.map((p) => p.id) || []
  )

  // Fetch all available permissions from the correct endpoint
  const { data: permissionsData, loading: permissionsLoading } = useAsync<{
    data: { items: Permission[] }
  }>(() => '/admin/permission')

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      permissions: initialData?.permissions || []
    }
  })

  const availablePermissions = permissionsData?.data?.items || []

  // Group permissions by resource (extract from permission name like "admin.create" -> "admin")
  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    const resource = permission.name.split('.')[0] || 'general'
    if (!acc[resource]) {
      acc[resource] = []
    }
    acc[resource].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  // Handle group toggle (select/deselect all permissions in a group)
  const handleGroupToggle = (groupPermissions: Permission[]) => {
    const groupPermissionIds = groupPermissions.map((p) => p.id)
    const allSelected = groupPermissionIds.every((id) => selectedPermissions.includes(id))

    if (allSelected) {
      // Deselect all in group
      setSelectedPermissions((prev) => prev.filter((id) => !groupPermissionIds.includes(id)))
    } else {
      // Select all in group
      setSelectedPermissions((prev) => [
        ...prev.filter((id) => !groupPermissionIds.includes(id)),
        ...groupPermissionIds
      ])
    }
  }

  // Handle select all toggle
  const handleSelectAll = () => {
    const allPermissionIds = availablePermissions.map((p) => p.id)
    const allSelected = allPermissionIds.length === selectedPermissions.length

    if (allSelected) {
      setSelectedPermissions([])
    } else {
      setSelectedPermissions(allPermissionIds)
    }
  }

  // Check if a group is fully selected
  const isGroupFullySelected = (groupPermissions: Permission[]) => {
    return groupPermissions.every((p) => selectedPermissions.includes(p.id))
  }

  // Check if a group is partially selected
  const isGroupPartiallySelected = (groupPermissions: Permission[]) => {
    const selectedCount = groupPermissions.filter((p) => selectedPermissions.includes(p.id)).length
    return selectedCount > 0 && selectedCount < groupPermissions.length
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      const selectedPermissionObjects = availablePermissions.filter((p) =>
        selectedPermissions.includes(p.id)
      )

      const payload = {
        ...data,
        permissions: selectedPermissionObjects
      }

      if (initialData?.id) {
        await requests.put(`/admin/role/${initialData.id}`, payload)
        toast.success('Role updated successfully')
      } else {
        await requests.post('/admin/role', payload)
        toast.success('Role created successfully')
      }

      await revalidateTags('/admin/role')
      onSuccess()
    } catch (error) {
      showError(error)
    }
  })

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* Basic Information */}
      <Card>
        <CardContent className='space-y-4'>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <CustomInput
                label='Role Name'
                placeholder='e.g., Content Manager'
                error={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <CustomInput
                label='Description'
                type='textarea'
                rows={3}
                placeholder='Brief description of this role...'
                error={errors.description?.message}
                {...field}
                value={field.value || ''}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex sm:flex-row flex-col sm:justify-between sm:items-start gap-3'>
              <div>
                <h3 className='font-semibold text-lg'>Permissions</h3>
                <p className='text-muted-foreground text-sm'>Select permissions for this role</p>
              </div>
              <div className='flex flex-col items-center gap-1'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleSelectAll}
                  disabled={permissionsLoading || availablePermissions.length === 0}
                  className='text-sm'
                >
                  {selectedPermissions.length === availablePermissions.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
                <span className='text-muted-foreground text-xs'>
                  {selectedPermissions.length} of {availablePermissions.length} selected
                </span>
              </div>
            </div>

            <Separator />

            {permissionsLoading ? (
              <div className='flex justify-center items-center p-8'>
                <div className='text-center'>
                  <div className='mx-auto border-primary border-b-2 rounded-full w-6 h-6 animate-spin' />
                  <p className='mt-2 text-muted-foreground text-sm'>Loading permissions...</p>
                </div>
              </div>
            ) : availablePermissions.length === 0 ? (
              <div className='p-8 border-2 border-dashed rounded-lg text-center'>
                <p className='text-muted-foreground'>No permissions available</p>
              </div>
            ) : (
              <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
                {Object.entries(groupedPermissions).map(([resource, permissions], index) => {
                  const themeClass = groupThemes[index % groupThemes.length]
                  const isFullySelected = isGroupFullySelected(permissions)
                  const isPartiallySelected = isGroupPartiallySelected(permissions)

                  return (
                    <Card key={resource} className={`border transition-all ${themeClass}`}>
                      <CardContent className='space-y-3 px-3'>
                        {/* Group Header with Select All */}
                        <div className='flex justify-between items-center pb-2 border-b'>
                          <div className='flex items-center gap-3'>
                            <button
                              type='button'
                              onClick={() => handleGroupToggle(permissions)}
                              className='flex items-center gap-2 hover:opacity-70 transition-opacity'
                            >
                              {isFullySelected ? (
                                <CheckCircle2 className='w-5 h-5 text-primary' />
                              ) : isPartiallySelected ? (
                                <div className='flex justify-center items-center bg-primary/20 border-2 border-primary rounded-full w-5 h-5'>
                                  <div className='bg-primary rounded-full w-2 h-2' />
                                </div>
                              ) : (
                                <Circle className='w-5 h-5 text-muted-foreground' />
                              )}
                            </button>
                            <h4 className='font-semibold text-sm capitalize'>{resource}</h4>
                          </div>
                          <div className='text-muted-foreground text-xs'>
                            {permissions.filter((p) => selectedPermissions.includes(p.id)).length}/
                            {permissions.length}
                          </div>
                        </div>

                        {/* Permission Items */}
                        <div className='space-y-1'>
                          {permissions.map((permission) => {
                            // Extract action from permission name (e.g., "admin.create" -> "create")
                            const action = permission.name.split('.')[1] || permission.name

                            return (
                              <div
                                key={permission.id}
                                className='flex items-center space-x-3 hover:bg-background/50 p-2 rounded-md transition-colors'
                              >
                                <Checkbox
                                  id={permission.id}
                                  checked={selectedPermissions.includes(permission.id)}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                />
                                <Label
                                  htmlFor={permission.id}
                                  className='flex-1 font-medium text-sm capitalize cursor-pointer'
                                >
                                  {action}
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className='flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  )
}

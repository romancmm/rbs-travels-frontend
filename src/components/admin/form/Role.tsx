'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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

export default function RoleForm({ initialData, onClose, onSuccess }: RoleFormProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        initialData?.permissions?.map((p) => p.id) || []
    )

    // Fetch all available permissions
    const { data: permissionsData, loading: permissionsLoading } = useAsync<{
        data: Permission[]
    }>(() => '/admin/permissions')

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

    const availablePermissions = permissionsData?.data || []

    // Group permissions by resource
    const groupedPermissions = availablePermissions.reduce(
        (acc, permission) => {
            const resource = permission.resource || 'general'
            if (!acc[resource]) {
                acc[resource] = []
            }
            acc[resource].push(permission)
            return acc
        },
        {} as Record<string, Permission[]>
    )

    const handlePermissionToggle = (permissionId: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        )
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
                <CardContent className='space-y-4 pt-6'>
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
                <CardContent className='pt-6'>
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <h3 className='font-semibold text-lg'>Permissions</h3>
                                <p className='text-muted-foreground text-sm'>
                                    Select permissions for this role
                                </p>
                            </div>
                            <div className='text-muted-foreground text-sm'>
                                {selectedPermissions.length} selected
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
                            <div className='space-y-6'>
                                {Object.entries(groupedPermissions).map(([resource, permissions]) => (
                                    <div key={resource} className='space-y-3'>
                                        <h4 className='font-medium text-sm capitalize'>
                                            {resource.replace(/-/g, ' ')}
                                        </h4>
                                        <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                                            {permissions.map((permission) => (
                                                <div
                                                    key={permission.id}
                                                    className='flex items-start space-x-3 hover:bg-muted/50 p-3 rounded-lg transition-colors'
                                                >
                                                    <Checkbox
                                                        id={permission.id}
                                                        checked={selectedPermissions.includes(permission.id)}
                                                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                    />
                                                    <div className='flex-1 space-y-1'>
                                                        <Label
                                                            htmlFor={permission.id}
                                                            className='font-medium text-sm cursor-pointer'
                                                        >
                                                            {permission.name}
                                                        </Label>
                                                        {permission.description && (
                                                            <p className='text-muted-foreground text-xs'>
                                                                {permission.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
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

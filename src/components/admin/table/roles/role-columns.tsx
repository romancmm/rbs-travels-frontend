'use client'

import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { ActionsDropdown } from '@/components/admin/common/ActionsDropdown'
import RoleForm from '@/components/admin/form/Role'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'
import { showError } from '@/lib/errMsg'
import { Role } from '@/lib/validations/schemas/role'
import requests from '@/services/network/http'
import { toast } from 'sonner'

export interface TableColumn<T = any> {
    key: string
    header: string | React.ReactNode
    render?: (value: any, data: T, index: number) => React.ReactNode
    width?: string
    className?: string
}

const ActionsCell = ({ data, mutate }: { data: Role; mutate?: () => void }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const deleteModal = useConfirmationModal({
        title: 'Delete Role',
        description: 'Are you sure you want to delete this role? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive',
        icon: Trash2
    })

    const handleDelete = async () => {
        try {
            await requests.delete(`/admin/role/${data.id}`)
            toast.success('Role deleted successfully')
            mutate?.()
        } catch (error) {
            showError(error)
            throw error
        }
    }

    const actions = [
        {
            type: 'action' as const,
            label: 'Edit',
            icon: Edit,
            onClick: () => setIsEditDialogOpen(true)
        },
        {
            type: 'action' as const,
            label: 'Delete',
            icon: Trash2,
            onClick: () => deleteModal.openModal(handleDelete),
            variant: 'destructive' as const
        }
    ]

    return (
        <>
            <ActionsDropdown data={data} actions={actions} />
            <deleteModal.ModalComponent />

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                    </DialogHeader>
                    <RoleForm
                        initialData={data}
                        onClose={() => setIsEditDialogOpen(false)}
                        onSuccess={() => {
                            mutate?.()
                            setIsEditDialogOpen(false)
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export const roleColumns = (mutate?: () => void): TableColumn<Role>[] => {
    return [
        {
            key: 'name',
            header: 'Role Name',
            render: (_, role) => (
                <div className='flex flex-col'>
                    <span className='font-medium'>{role.name}</span>
                    {role.description && (
                        <span className='text-muted-foreground text-sm'>{role.description}</span>
                    )}
                </div>
            )
        },
        {
            key: 'permissions',
            header: 'Permissions',
            render: (_, role: Role) => {
                if (!role.permissions || role.permissions.length === 0) {
                    return <span className='text-muted-foreground text-sm'>No permissions</span>
                }
                return (
                    <div className='flex flex-wrap gap-1'>
                        {role.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission.id} variant='outline' className='text-xs'>
                                {permission.name}
                            </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                            <Badge variant='secondary' className='text-xs'>
                                +{role.permissions.length - 3} more
                            </Badge>
                        )}
                    </div>
                )
            }
        },
        {
            key: 'permissionCount',
            header: 'Total',
            render: (_, role: Role) => (
                <Badge variant='secondary'>{role.permissions?.length || 0}</Badge>
            ),
            width: 'w-20'
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (_, data) => <ActionsCell data={data} mutate={mutate} />,
            width: 'w-20'
        }
    ]
}

'use client'

import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

import PermissionForm from '@/components/admin/form/Permission'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'
import { showError } from '@/lib/errMsg'
import { Permission } from '@/lib/validations/schemas/permission'
import requests from '@/services/network/http'
import { toast } from 'sonner'

export interface TableColumn<T = any> {
    key: string
    header: string | React.ReactNode
    render?: (value: any, data: T, index: number) => React.ReactNode
    width?: string
    className?: string
}

const ActionsCell = ({ data, mutate }: { data: Permission; mutate?: () => void }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const deleteModal = useConfirmationModal({
        title: 'Delete Permission',
        description: 'Are you sure you want to delete this permission? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive',
        icon: Trash2
    })

    const handleDelete = async () => {
        try {
            await requests.delete(`/admin/permission/${data.id}`)
            toast.success('Permission deleted successfully')
            mutate?.()
        } catch (error) {
            showError(error)
            throw error
        }
    }

    return (
        <>
            <div className='flex items-center gap-2'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsEditDialogOpen(true)}
                    className='p-0 w-8 h-8'
                >
                    <Edit className='w-4 h-4' />
                    <span className='sr-only'>Edit</span>
                </Button>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => deleteModal.openModal(handleDelete)}
                    className='p-0 w-8 h-8 text-destructive/80 hover:text-destructive'
                >
                    <Trash2 className='w-4 h-4' />
                    <span className='sr-only'>Delete</span>
                </Button>
            </div>
            <deleteModal.ModalComponent />

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className='max-w-md'>
                    <DialogHeader>
                        <DialogTitle>Edit Permission</DialogTitle>
                    </DialogHeader>
                    <PermissionForm
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

export const permissionColumns = (mutate?: () => void): TableColumn<Permission>[] => {
    return [
        {
            key: 'name',
            header: 'Permission Name',
            render: (_, permission) => {
                const [resource, action] = permission.name.split('.')
                return (
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-col'>
                            <div className='flex gap-1 mt-1'>
                                <Badge variant='outline' className='text-xs capitalize'>
                                    {resource || 'unknown'}
                                </Badge>
                                <Badge variant='secondary' className='text-xs capitalize'>
                                    {action || 'unknown'}
                                </Badge>
                            </div>
                            <span className='font-medium'>{permission.name}</span>
                        </div>
                    </div>
                )
            }
        },
        {
            key: 'resource',
            header: 'Resource',
            render: (_, permission) => {
                const resource = permission.name.split('.')[0]
                return (
                    <Badge variant='outline' className='capitalize'>
                        {resource || '-'}
                    </Badge>
                )
            },
            width: 'w-32'
        },
        {
            key: 'action',
            header: 'Action',
            render: (_, permission) => {
                const action = permission.name.split('.')[1]
                return (
                    <Badge variant='secondary' className='capitalize'>
                        {action || '-'}
                    </Badge>
                )
            },
            width: 'w-32'
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (_, data) => <ActionsCell data={data} mutate={mutate} />,
            width: 'w-20'
        }
    ]
}

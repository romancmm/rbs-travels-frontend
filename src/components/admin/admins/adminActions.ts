import { AdminUser } from '@/lib/validations/schemas/admin'
import { Pencil, UserMinus, UserPlus } from 'lucide-react'
import { ActionItem } from '../common/ActionsDropdown'

// Define all possible action types
export type AdminActionType = 'edit' | 'assign-role' | 'remove-role' | 'delete'

// Single action handler interface
export interface AdminActionHandler {
  (actionType: AdminActionType, data: AdminUser): void
}

// Quick view handler state interface
export interface QuickViewState {
  open: boolean
  data: AdminUser | null
}

// Actions configuration with unified action handler
export const getAdminActions = (
  data: AdminUser,
  mutate?: () => void,
  onAction?: AdminActionHandler
): ActionItem<AdminUser>[] => {
  const hasRoles = data?.roles && data.roles.length > 0

  const actions: ActionItem<AdminUser>[] = [
    {
      type: 'action',
      label: 'Edit',
      icon: Pencil,
      onClick: async (data) => {
        if (onAction) {
          onAction('edit', data)
        }
      },
      permission: { resource: 'admins', actions: 'update' }
    },
    ...(!hasRoles
      ? [
          {
            type: 'action' as const,
            label: 'Assign Roles',
            icon: UserPlus,
            onClick: async (data: AdminUser) => {
              if (onAction) {
                onAction('assign-role', data)
              }
            },
            disabled: !data.isAdmin,
            permission: { resource: 'admins', actions: 'update' }
          }
        ]
      : []),
    ...(hasRoles
      ? [
          {
            type: 'action' as const,
            label: 'Manage Roles',
            icon: UserMinus,
            onClick: async (data: AdminUser) => {
              if (onAction) {
                onAction('remove-role', data)
              }
            },
            disabled: !data.isAdmin,
            permission: { resource: 'admins', actions: 'update' }
          }
        ]
      : [])
    // {
    //   type: 'action',
    //   label: 'Delete',
    //   icon: Trash2,
    //   variant: 'destructive',
    //   onClick: async (data) => {
    //     if (onAction) {
    //       onAction('delete', data)
    //     }
    //   },
    //   permission: { resource: 'admins', actions: 'delete' }
    // }
  ]

  return actions
}

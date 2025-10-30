import { Pencil, UserMinus, UserPlus } from 'lucide-react'
import { ActionItem } from '../common/ActionsDropdown'

// Define TAdmin interface locally to match the new schema
interface TAdmin {
  id: number
  name: string
  email: string
  isActive: boolean
  isAdmin: boolean
  roleId?: string
  createdAt: string
  updatedAt: string
}

// Define all possible action types
export type AdminActionType = 'edit' | 'assign-role' | 'remove-role' | 'delete'

// Single action handler interface
export interface AdminActionHandler {
  (actionType: AdminActionType, data: TAdmin): void
}

// Quick view handler state interface
export interface QuickViewState {
  open: boolean
  data: TAdmin | null
}

// Actions configuration with unified action handler
export const getAdminActions = (
  data: TAdmin,
  mutate?: () => void,
  onAction?: AdminActionHandler
): ActionItem<TAdmin>[] => {
  const actions: ActionItem<TAdmin>[] = [
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
    ...(data?.roleId === null || data?.roleId === undefined
      ? [
          {
            type: 'action' as const,
            label: 'Assign Role',
            icon: UserPlus,
            onClick: async (data: TAdmin) => {
              if (onAction) {
                onAction('assign-role', data)
              }
            },
            disabled: !data.isAdmin,
            permission: { resource: 'admins', actions: 'update' }
          }
        ]
      : []),
    ...(data?.roleId !== null && data?.roleId !== undefined
      ? [
          {
            type: 'action' as const,
            label: 'Remove Role',
            icon: UserMinus,
            onClick: async (data: TAdmin) => {
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

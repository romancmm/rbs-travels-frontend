/**
 * Permission-based Component Protection Examples
 *
 * This file demonstrates various ways to implement permission-based
 * access control in components using the RBAC system.
 */

import {
  CanCreate,
  CanDelete,
  CanEdit,
  CanExport,
  CanView,
  PermissionGate
} from '@/components/common/PermissionGate'
import { usePermissions } from '@/components/providers/PermissionProvider'
import { Button } from '@/components/ui/button'
import { Download, Edit, Eye, Plus, Trash2 } from 'lucide-react'

// Example 1: Basic Permission Gate Usage
export const ProductListActions = () => {
  return (
    <div className='flex gap-2'>
      {/* Only show if user can create products */}
      <CanCreate resource='products'>
        <Button>
          <Plus className='mr-2 size-4' />
          Add Product
        </Button>
      </CanCreate>

      {/* Only show if user can export products */}
      <CanExport resource='products'>
        <Button variant='outline'>
          <Download className='mr-2 size-4' />
          Export
        </Button>
      </CanExport>
    </div>
  )
}

// Example 2: Table Row Actions with Permissions
export const ProductRowActions = ({ product }: { product: any }) => {
  return (
    <div className='flex gap-1'>
      <CanView resource='products'>
        <Button size='sm' variant='ghost'>
          <Eye className='size-4' />
        </Button>
      </CanView>

      <CanEdit resource='products'>
        <Button size='sm' variant='ghost'>
          <Edit className='size-4' />
        </Button>
      </CanEdit>

      <CanDelete resource='products'>
        <Button size='sm' variant='ghost'>
          <Trash2 className='size-4' />
        </Button>
      </CanDelete>
    </div>
  )
}

// Example 3: Complex Permission Logic with Custom Hook
export const AdminDashboardWidget = () => {
  const { hasPermission } = usePermissions()

  // Complex permission checking
  const canManageUsers = hasPermission('users', 'index') && hasPermission('users', 'update')
  const canViewReports = hasPermission('reports', 'index') || hasPermission('analytics', 'index')

  if (!canViewReports && !canManageUsers) {
    return (
      <div className='p-4 text-muted text-center'>You dont have permission to view this widget</div>
    )
  }

  return (
    <div className='p-4 border rounded-lg'>
      <h3 className='mb-4 font-semibold'>Dashboard Widget</h3>

      {canViewReports && (
        <div className='mb-4'>
          <h4>Reports Section</h4>
          <p>Analytics and reports content...</p>
        </div>
      )}

      {canManageUsers && (
        <div>
          <h4>User Management</h4>
          <p>User management tools...</p>
        </div>
      )}
    </div>
  )
}

// Example 4: Permission Gate with Fallback Content
export const RestrictedContent = () => {
  return (
    <PermissionGate
      resource='sensitive-data'
      action='view'
      fallback={
        <div className='bg-gray-100 p-4 rounded'>
          <p>You need special permissions to view this content.</p>
          <Button variant='outline' size='sm'>
            Request Access
          </Button>
        </div>
      }
    >
      <div className='bg-green-50 p-4 rounded'>
        <h3 className='font-semibold text-green-800'>Sensitive Information</h3>
        <p className='text-green-700'>
          This is confidential data that only authorized users can see.
        </p>
      </div>
    </PermissionGate>
  )
}

// Example 5: Navigation Menu with Permissions
export const AdminNavigationMenu = () => {
  const { hasPermission } = usePermissions()

  const menuItems = [
    {
      label: 'Products',
      resource: 'products',
      action: 'index',
      href: '/admin/products'
    },
    {
      label: 'Users',
      resource: 'users',
      action: 'index',
      href: '/admin/users'
    },
    {
      label: 'Orders',
      resource: 'orders',
      action: 'index',
      href: '/admin/orders'
    },
    {
      label: 'Settings',
      resource: 'settings',
      action: 'update',
      href: '/admin/settings'
    }
  ]

  const visibleItems = menuItems.filter((item) => hasPermission(item.resource, item.action))

  return (
    <nav className='space-y-2'>
      {visibleItems.map((item) => (
        <a key={item.href} href={item.href} className='block hover:bg-gray-100 p-2 rounded'>
          {item.label}
        </a>
      ))}
    </nav>
  )
}

// Example 6: Form with Permission-based Field Visibility
export const UserEditForm = ({ user }: { user: any }) => {
  const { hasPermission } = usePermissions()

  return (
    <form className='space-y-4'>
      {/* Basic fields - always visible if user can edit */}
      <CanEdit resource='users'>
        <div>
          <label>Name</label>
          <input type='text' defaultValue={user.name} />
        </div>
      </CanEdit>

      {/* Sensitive field - requires special permission */}
      <PermissionGate resource='users' action='update-role'>
        <div>
          <label>Role</label>
          <select defaultValue={user.role}>
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
      </PermissionGate>

      {/* Admin-only field */}
      <PermissionGate resource='users' action='manage-permissions'>
        <div>
          <label>Permissions</label>
          <textarea defaultValue={user.permissions} />
        </div>
      </PermissionGate>

      <div className='flex gap-2'>
        <CanEdit resource='users'>
          <Button type='submit'>Save Changes</Button>
        </CanEdit>

        <CanDelete resource='users'>
          <Button variant='destructive' type='button'>
            Delete User
          </Button>
        </CanDelete>
      </div>
    </form>
  )
}

// Example 7: Conditional Rendering with Multiple Resources
export const AdminControlPanel = () => {
  const { hasPermission } = usePermissions()

  const sections = [
    {
      title: 'User Management',
      resource: 'users',
      actions: ['index', 'create', 'update', 'delete']
    },
    {
      title: 'Product Management',
      resource: 'products',
      actions: ['index', 'create', 'update']
    },
    {
      title: 'System Settings',
      resource: 'settings',
      actions: ['update']
    }
  ]

  const availableSections = sections.filter((section) =>
    section.actions.some((action) => hasPermission(section.resource, action))
  )

  if (availableSections.length === 0) {
    return (
      <div className='p-8 text-center'>
        <h2 className='mb-2 font-semibold text-xl'>Access Restricted</h2>
        <p className='text-muted'>You dont have permission to access any admin features.</p>
      </div>
    )
  }

  return (
    <div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      {availableSections.map((section) => (
        <div key={section.resource} className='p-4 border rounded-lg'>
          <h3 className='mb-2 font-semibold'>{section.title}</h3>
          <div className='space-y-2'>
            {hasPermission(section.resource, 'index') && (
              <Button variant='outline' size='sm' className='w-full'>
                View All
              </Button>
            )}
            {hasPermission(section.resource, 'create') && (
              <Button variant='outline' size='sm' className='w-full'>
                Create New
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Usage Instructions:
 *
 * 1. Import the components you need:
 *    import { PermissionGate, CanCreate, CanEdit } from '@/components/common/PermissionGate'
 *    import { usePermissions } from '@/components/providers/PermissionProvider'
 *
 * 2. Wrap components that need protection:
 *    <CanCreate resource="products">
 *      <Button>Add Product</Button>
 *    </CanCreate>
 *
 * 3. Use custom logic for complex scenarios:
 *    const { hasPermission } = usePermissions()
 *    if (!hasPermission('products', 'delete')) return null
 *
 * 4. Provide fallback content:
 *    <PermissionGate resource="admin" fallback={<div>Access Denied</div>}>
 *      <AdminPanel />
 *    </PermissionGate>
 */

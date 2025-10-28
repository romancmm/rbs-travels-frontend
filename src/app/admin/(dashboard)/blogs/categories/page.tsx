'use client'

import { Suspense, useState } from 'react'

import { blogCategoryColumns } from '@/components/admin/blogs/blog-categories-columns'
import { CustomTable } from '@/components/admin/common/data-table'
import { BlogCategoryForm } from '@/components/admin/form/BlogCategory'
import PageHeader from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { AddButton } from '@/components/common/PermissionGate'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useAsync from '@/hooks/useAsync'
import { useFilter } from '@/hooks/useFilter'
import { BlogCategoryType } from '@/lib/validations/schemas/blog'

interface BlogCategory extends BlogCategoryType {
  id: number
  createdAt: string
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

function BlogCategoryList() {
  const { page, limit } = useFilter(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)

  const { data, loading, mutate } = useAsync<{
    data: {
      categories: BlogCategory[]
      pagination: PaginationMeta
    }
  }>(
    () =>
      'admin/blogs/categories' + (page ? `?page=${page}` : '') + (limit ? `&limit=${limit}` : '')
  )

  // Enhanced mutate function that includes edit functionality
  const enhancedMutate = Object.assign(mutate, {
    editCategory: (category: BlogCategory) => {
      setEditingCategory(category)
      setIsModalOpen(true)
    }
  })

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleFormSuccess = () => {
    handleModalClose()
    mutate() // Refresh the list
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      {/* Header */}
      <PageHeader
        title='Blog Categories'
        subTitle='Manage blog categories'
        extra={
          <div className='flex sm:flex-row flex-col sm:justify-between sm:items-end gap-4 mb-6'>
            <div className='flex sm:flex-row flex-col sm:items-end gap-4'>
              <AddButton resource='blogs' onClick={handleAddNew} />
            </div>
          </div>
        }
      />

      {/* Table */}
      <CustomTable
        columns={blogCategoryColumns(enhancedMutate)}
        data={data?.data?.categories ?? []}
        getRowId={(row: any) => row.id}
        emptyMessage={loading ? 'Loading blog categories...' : 'No blog category found.'}
        className={loading ? 'opacity-50 pointer-events-none' : ''}
      />

      {/* Pagination */}
      <Pagination paginationData={data?.data?.pagination} pageSizeOptions={[5, 10, 20, 50]} />

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>
          <BlogCategoryForm
            initialData={
              editingCategory ? { id: editingCategory.id, name: editingCategory.name } : undefined
            }
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function BlogCategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogCategoryList />
    </Suspense>
  )
}

'use client'

import { Suspense, useState } from 'react'

import { CustomTable } from '@/components/admin/common/data-table'
import { ArticleCategoryForm } from '@/components/admin/form/ArticleCategory'
import { blogCategoryColumns } from '@/components/admin/table/articles/article-categories-columns'
import PageHeader from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { AddButton } from '@/components/common/PermissionGate'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useAsync from '@/hooks/useAsync'
import { useFilter } from '@/hooks/useFilter'
import { ArticleCategoryType } from '@/lib/validations/schemas/blog'

interface ArticleCategory extends ArticleCategoryType {
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

function ArticleCategoryList() {
  const { page, limit } = useFilter(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ArticleCategory | null>(null)

  const { data, loading, mutate } = useAsync<{
    data: {
      items: ArticleCategory[]
      pagination: PaginationMeta
    }
  }>(
    () => 'admin/articles/categories' + (page ? `?page=${page}` : '') + (limit ? `&limit=${limit}` : '')
  )

  // Enhanced mutate function that includes edit functionality
  const enhancedMutate = Object.assign(mutate, {
    editCategory: (category: ArticleCategory) => {
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
        title='Article Categories'
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
        data={data?.data?.items ?? []}
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
          <ArticleCategoryForm
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

export default function ArticleCategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleCategoryList />
    </Suspense>
  )
}

'use client'

import { Copy, ExternalLink, Eye, FileText, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'

import { PageFormDialog } from '@/components/admin/cms/PageFormDialog'
import PageHeader from '@/components/common/PageHeader'
import { AddButton } from '@/components/common/PermissionGate'
import { CMSEmptyState, CMSListSkeleton, CMSStatusBadge } from '@/components/common/cms'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useAsync from '@/hooks/useAsync'
import { useFilter } from '@/hooks/useFilter'
import { pageBuilderService } from '@/services/api/cms.service'
import { PageLayout } from '@/types/cms'

function PageList() {
  const router = useRouter()
  const { page, limit } = useFilter(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<PageLayout | null>(null)

  const { data, loading, mutate } = useAsync<{
    data: {
      items: PageLayout[]
      pagination: any
    }
  }>(() => {
    const url =
      '/admin/page' + (page ? `?page=${page}` : '') + (limit ? `&limit=${limit}` : '')
    return url
  })

  const handleCreate = () => {
    setSelectedPage(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (page: PageLayout) => {
    // Navigate to builder page
    router.push(`/admin/administration/page-builder/${page.id}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.'))
      return

    try {
      await pageBuilderService.deletePage(id)
      mutate()
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  const handleStatusToggle = async (page: PageLayout) => {
    try {
      if (page.isPublished) {
        await pageBuilderService.unpublishPage(page.id)
      } else {
        await pageBuilderService.publishPage(page.id)
      }
      mutate()
    } catch (error) {
      console.error('Failed to update page status:', error)
    }
  }

  const handleDuplicate = async (page: PageLayout) => {
    try {
      await pageBuilderService.duplicatePage(page.id)
      mutate()
    } catch (error) {
      console.error('Failed to duplicate page:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className='w-full max-w-full overflow-x-hidden'>
        <PageHeader
          title='Page Builder'
          subTitle='Create and manage custom pages with visual builder'
          extra={<AddButton resource='page' onClick={handleCreate} />}
        />
        <div className='mt-6'>
          <CMSListSkeleton rows={5} />
        </div>
      </div>
    )
  }

  const pages = data?.data?.items || []

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      {/* Header */}
      <PageHeader
        title='Page Builder'
        subTitle='Create and manage custom pages with visual builder'
        extra={<AddButton resource='page' onClick={handleCreate} />}
      />

      {/* Body */}
      <div className='mt-6'>
        {pages.length === 0 ? (
          <CMSEmptyState
            icon={FileText}
            title='No pages created yet'
            description='Start building beautiful, custom pages with our drag-and-drop page builder. Add sections, rows, and components to create unique layouts.'
            actionLabel='Create First Page'
            onAction={handleCreate}
          />
        ) : (
          <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-3'>
            {pages.map((page) => (
              <div
                key={page.id}
                className='group p-4 border hover:border-primary/50 rounded-lg transition-colors'
              >
                {/* Page Preview Thumbnail */}
                <div className='relative flex justify-center items-center bg-muted mb-4 rounded-lg h-32 overflow-hidden'>
                  <FileText className='w-12 h-12 text-muted-foreground' />
                  <div className='absolute inset-0 flex justify-center items-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Button size='sm' variant='secondary' onClick={() => handleEdit(page)}>
                      <Pencil className='mr-2 w-4 h-4' />
                      Edit
                    </Button>
                    <Button size='sm' variant='secondary'>
                      <Eye className='w-4 h-4' />
                    </Button>
                  </div>
                </div>

                {/* Page Info */}
                <div className='space-y-3'>
                  <div>
                    <div className='flex justify-between items-start gap-2 mb-1'>
                      <h3 className='font-semibold line-clamp-1'>{page.title}</h3>
                      <CMSStatusBadge status={page.isPublished ? 'published' : 'draft'} showIcon={false} />
                    </div>
                    <p className='text-muted-foreground text-xs'>
                      /{page.slug}
                    </p>
                  </div>

                  <div className='flex justify-between items-center text-muted-foreground text-xs'>
                    <span>{page?.content?.sections?.length || 0} sections</span>
                    <span>{formatDate(page.updatedAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2 pt-2 border-t'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1'
                      onClick={() => handleEdit(page)}
                    >
                      <Pencil className='mr-2 w-4 h-4' />
                      Edit
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='outline' size='sm'>
                          <MoreVertical className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(page)}>
                          <Pencil className='mr-2 w-4 h-4' />
                          Edit Page
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className='mr-2 w-4 h-4' />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className='mr-2 w-4 h-4' />
                          View Live
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(page)}>
                          <Copy className='mr-2 w-4 h-4' />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusToggle(page)}>
                          {page.isPublished ? 'Unpublish' : 'Publish'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => handleDelete(page.id)}
                        >
                          <Trash2 className='mr-2 w-4 h-4' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <PageFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        page={selectedPage}
        onSuccess={mutate}
      />
    </div>
  )
}

export default function PageBuilderPage() {
  return (
    <Suspense fallback={<CMSListSkeleton />}>
      <PageList />
    </Suspense>
  )
}

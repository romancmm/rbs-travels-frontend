'use client'

import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import useAsync from '@/hooks/useAsync'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'
import { useFilter } from '@/hooks/useFilter'
import { cn } from '@/lib/utils'
import requests from '@/services/network/http'
import {
  AlertTriangle,
  CheckSquare,
  ChevronRight,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Folder,
  FolderOpen,
  Grid3X3,
  Home,
  List,
  Plus,
  Search,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { CreateFolderModal } from './CreateFolderModal'
import { FileDetailsPanel } from './FileDetailsPanel'
import { FileGrid } from './FileGrid'
import { FileList } from './FileList'
import { FileUploadModal } from './FileUploadModal'
import { RenameModal } from './RenameModal'

export interface FileItem {
  type: 'file' | 'folder'
  name: string
  createdAt: string
  updatedAt: string
  fileId: string
  folderId: string
  url?: string
  thumbnail?: string
  fileType?: 'image' | 'non-image'
  filePath: string
  folderPath: string
  height?: number
  width?: number
  size?: number
  mime?: string
  children?: FileItem[] // For folders
}

interface FileManagerComponentProps {
  mode?: 'standalone' | 'modal'
  onFileSelect?: (file: FileItem) => void
  allowedTypes?: string[]
  maxFiles?: number
  className?: string
  initialPath?: string
}

export function FileManagerComponent({
  mode = 'standalone',
  onFileSelect,
  allowedTypes = [],
  maxFiles = 1,
  className,
  initialPath = '/'
}: FileManagerComponentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { page, limit } = useFilter(50)

  // Extract current path from URL pathname
  // /admin/file-manager/folder1/folder2 -> /folder1/folder2
  const basePath = '/admin/file-manager'
  const currentPath = pathname.replace(basePath, '') || initialPath || '/'
  const searchQuery = searchParams.get('search') || ''

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [renameFile, setRenameFile] = useState<FileItem | null>(null)
  const isMobile = useIsMobile()

  // Helper function to get unique ID for files and folders
  const getItemId = (item: FileItem) => {
    return item.type === 'file' ? item.fileId : item.folderId
  }

  // Confirmation modal for deletion
  const deleteConfirmModal = useConfirmationModal({
    title: 'Confirm Deletion',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
    icon: AlertTriangle
  })

  // Confirmation modal for bulk deletion
  const bulkDeleteConfirmModal = useConfirmationModal({
    title: 'Confirm Bulk Deletion',
    description: `Are you sure you want to delete ${selectedFiles.length} item(s)? This action cannot be undone.`,
    confirmText: 'Delete All',
    cancelText: 'Cancel',
    variant: 'destructive',
    icon: AlertTriangle
  })

  // Navigate to path
  const navigateToPath = (path: string, search?: string) => {
    const params = new URLSearchParams()

    // Add search param if exists
    const searchValue = search !== undefined ? search : searchQuery
    if (searchValue) {
      params.set('search', searchValue)
    }

    // Build URL with pathname
    const targetPath = path === '/' ? basePath : `${basePath}/${path}`
    const queryString = params.toString()
    const fullPath = queryString ? `${targetPath}?${queryString}` : targetPath

    router.push(fullPath, { scroll: false })
  }

  // Update search only
  const updateSearch = (search: string) => {
    const params = new URLSearchParams()
    if (search) {
      params.set('search', search)
    }
    const queryString = params.toString()
    const targetPath = currentPath === '/' ? basePath : `${basePath}${currentPath}`
    const fullPath = queryString ? `${targetPath}?${queryString}` : targetPath
    router.push(fullPath, { scroll: false })
  }

  // Build API path based on current folder
  const apiPath = `/admin/media?${new URLSearchParams({
    fileType: 'all',
    path: currentPath,
    page: page.toString(),
    perPage: limit.toString(),
    ...(searchQuery && { search: searchQuery })
  }).toString()}`

  const { data, loading, mutate } = useAsync<{
    items: FileItem[]
    pagination: any
  }>(apiPath)
  // Path breadcrumbs
  const pathSegments = (() => {
    if (currentPath === '/') return [{ name: 'Root', path: '/' }]
    const segments = currentPath?.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Root', path: '/' }]

    let currentSegmentPath = ''
    segments?.forEach((segment) => {
      currentSegmentPath += `/${segment}`
      breadcrumbs.push({
        name: segment,
        path: currentSegmentPath
      })
    })

    return breadcrumbs
  })()

  // Filtered files based on allowed types
  const filteredFiles = (() => {
    if (!data?.items) return []

    return data.items.filter((item) => {
      if (item.type === 'folder') return true
      if (allowedTypes.length === 0) return true

      return allowedTypes.some((type) => {
        if (type === 'image' && item.fileType === 'image') return true
        if (type === 'video' && item.mime?.startsWith('video/')) return true
        if (type === 'audio' && item.mime?.startsWith('audio/')) return true
        if (
          type === 'document' &&
          (item.mime?.includes('pdf') ||
            item.mime?.includes('document') ||
            item.mime?.includes('text'))
        )
          return true
        return false
      })
    })
  })()

  // Get existing folder names for uniqueness check
  const existingFolders = filteredFiles
    .filter((item: FileItem) => item.type === 'folder')
    .map((folder: FileItem) => folder.name)

  // Get existing file names for rename check
  const existingNames = filteredFiles.map((item: FileItem) => item.name)

  // Handle folder navigation
  const handleFolderClick = (folder: FileItem) => {
    console.log('folder', folder)
    navigateToPath(folder.folderPath)
    setSelectedFile(null)
  }

  // Handle file selection
  const handleFileSelect = (file: FileItem) => {
    if (selectionMode) {
      toggleFileSelection(file)
      return
    }

    if (mode === 'modal' && onFileSelect) {
      if (maxFiles === 1) {
        onFileSelect(file)
      } else {
        // Multi-select logic
        const isSelected = selectedFiles.some((f) => getItemId(f) === getItemId(file))
        if (isSelected) {
          setSelectedFiles((prev) => prev.filter((f) => getItemId(f) !== getItemId(file)))
        } else if (selectedFiles.length < maxFiles) {
          setSelectedFiles((prev) => [...prev, file])
        }
      }
    } else {
      setSelectedFile(file)
    }
  }

  // Handle file preview
  const handleFilePreview = (file: FileItem) => {
    setPreviewFile(file)
  }

  // Handle file/folder delete
  const handleDelete = (file: FileItem) => {
    deleteConfirmModal.openModal(async () => {
      const id = file.type === 'file' ? file.fileId : file.folderId

      try {
        await requests.delete(`/admin/media/${id}`)

        // Clear selection if deleted file was selected
        if (selectedFile && getItemId(selectedFile) === getItemId(file)) {
          setSelectedFile(null)
        }

        // Refetch data after successful deletion
        mutate()
      } catch (error) {
        console.error('Error deleting file/folder:', error)
        throw error // Re-throw to keep modal open on error
      }
    })
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    bulkDeleteConfirmModal.openModal(async () => {
      try {
        const fileIds = selectedFiles.map((file) => getItemId(file))

        await requests.post('/admin/media/bulk/delete', { fileIds })

        // Clear selections
        setSelectedFiles([])
        setSelectionMode(false)
        if (selectedFile && selectedFiles.some((f) => getItemId(f) === getItemId(selectedFile))) {
          setSelectedFile(null)
        }

        // Refetch data after successful deletion
        mutate()
      } catch (error) {
        console.error('Error bulk deleting files/folders:', error)
        throw error // Re-throw to keep modal open on error
      }
    })
  }

  // Toggle file selection
  const toggleFileSelection = (file: FileItem) => {
    setSelectedFiles((prev) => {
      const isSelected = prev.some((f) => getItemId(f) === getItemId(file))
      if (isSelected) {
        return prev.filter((f) => getItemId(f) !== getItemId(file))
      } else {
        return [...prev, file]
      }
    })
  }

  // Select all files
  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles)
    }
  }

  // Cancel selection mode
  const handleCancelSelection = () => {
    setSelectionMode(false)
    setSelectedFiles([])
  }

  // Handle file/folder rename
  const handleRename = async (file: FileItem, newName: string) => {
    try {
      await requests.patch('/api/admin/media/rename', {
        fileId: file.fileId,
        currentName: file.name,
        newName: newName,
        path: file.filePath,
        type: file.type
      })

      mutate()
      if (selectedFile && getItemId(selectedFile) === getItemId(file)) {
        setSelectedFile({ ...selectedFile, name: newName })
      }
    } catch (error) {
      console.error('Error renaming file/folder:', error)
      throw error
    }
  }

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (path: string) => {
    navigateToPath(path)
    setSelectedFile(null)
  }

  // Get file icon based on type
  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return currentPath === file.filePath ? FolderOpen : Folder
    }

    if (file.fileType === 'image') return FileImage
    if (file.mime?.startsWith('video/')) return FileVideo
    if (file.mime?.startsWith('audio/')) return FileAudio
    return FileText
  }

  return (
    <div className={cn('flex flex-col bg-background rounded-xl h-full', className)}>
      {/* Bulk Selection Toolbar */}
      {selectionMode && (
        <div className='flex justify-between items-center gap-4 bg-primary/5 px-4 py-3 border-primary/20 border-b'>
          <div className='flex items-center gap-3'>
            <Button variant='outline' size='sm' onClick={handleCancelSelection} className='h-8'>
              <X className='mr-1 w-4 h-4' />
              Cancel
            </Button>
            <Button variant='outline' size='sm' onClick={handleSelectAll} className='h-8'>
              <CheckSquare className='mr-1 w-4 h-4' />
              {selectedFiles.length === filteredFiles.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className='font-medium text-sm'>
              {selectedFiles.length} item{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <Button
            variant='destructive'
            size='sm'
            onClick={handleBulkDelete}
            disabled={selectedFiles.length === 0}
            className='h-8'
          >
            <Trash2 className='mr-1 w-4 h-4' />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <div className='flex lg:flex-row flex-col justify-between gap-4 p-4 border-b'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-1 text-sm'>
          <Home className='w-4 h-4' />
          {pathSegments.map((segment, index) => (
            <div key={index} className='flex items-center'>
              {index > 0 && <ChevronRight className='w-4 h-4 text-muted-foreground' />}
              <button
                onClick={() => handleBreadcrumbClick(segment.path)}
                className={cn(
                  'hover:bg-accent px-2 py-1 rounded',
                  index === pathSegments.length - 1
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {segment.name}
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className='flex justify-between items-center gap-4'>
          <div className='flex items-center gap-2'>
            <div className='relative flex-1 max-w-md'>
              <Search className='top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2' />
              <Input
                placeholder='Search files...'
                value={searchQuery}
                onChange={(e) => updateSearch(e.target.value)}
                className='pl-9'
              />
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {/* Action Buttons */}
            {!selectionMode && (
              <>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setSelectionMode(true)
                    setSelectedFiles([])
                  }}
                >
                  <CheckSquare className='w-4 h-4' />
                  {!isMobile && 'Select'}
                </Button>

                <Button variant='outline' size='sm' onClick={() => setShowCreateFolderModal(true)}>
                  <Plus className='w-4 h-4' />
                  {!isMobile && 'New Folder'}
                </Button>

                <Button size='sm' onClick={() => setShowUploadModal(true)}>
                  <Upload className='w-4 h-4' />
                  {!isMobile && 'Upload'}
                </Button>
              </>
            )}

            {/* View Toggle */}
            <div className='flex items-center p-0 border border-primary rounded-lg'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className={cn('w-3 h-3', { 'text-gray-500': viewMode !== 'grid' })} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('list')}
              >
                <List className={cn('w-3 h-3', { 'text-gray-500': viewMode === 'grid' })} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className='flex flex-1 overflow-hidden'>
        {/* File Browser */}
        <div className='flex-1 overflow-auto'>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='text-center'>
                <div className='mx-auto mb-2 border-2 border-primary border-t-transparent rounded-full w-8 h-8 animate-spin' />
                <p className='text-muted-foreground text-sm'>Loading files...</p>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className='flex justify-center items-center h-64'>
              <div className='text-center'>
                <Folder className='mx-auto mb-4 w-12 h-12 text-muted-foreground' />
                <p className='font-medium text-lg'>No files found</p>
                <p className='text-muted-foreground text-sm'>
                  {searchQuery ? 'Try adjusting your search' : 'Upload some files to get started'}
                </p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <FileGrid
              files={filteredFiles}
              onFileSelect={handleFileSelect}
              onFolderClick={handleFolderClick}
              onFilePreview={handleFilePreview}
              onFileDelete={handleDelete}
              onFileRename={setRenameFile}
              selectedFiles={selectedFiles}
              selectionMode={selectionMode}
              getFileIcon={getFileIcon}
            />
          ) : (
            <FileList
              files={filteredFiles}
              onFileSelect={handleFileSelect}
              onFolderClick={handleFolderClick}
              onFilePreview={handleFilePreview}
              onFileDelete={handleDelete}
              onFileRename={setRenameFile}
              selectedFiles={selectedFiles}
              selectionMode={selectionMode}
              getFileIcon={getFileIcon}
            />
          )}

          {/* Pagination */}
          {data && (
            <Pagination
              paginationData={data?.pagination}
              pageSizeOptions={[10, 20, 30, 50]}
              showRowsPerPage={true}
              showPageInfo={true}
              showFirstLastButtons={true}
            />
          )}
        </div>

        {/* Details Panel (only in standalone mode) */}
        {mode === 'standalone' && selectedFile && (
          <FileDetailsPanel file={selectedFile} onClose={() => setSelectedFile(null)} />
        )}
      </div>

      {/* Modal Actions (only in modal mode) */}
      {mode === 'modal' && (
        <div className='flex justify-between items-center p-4 border-t'>
          <div className='text-muted-foreground text-sm'>
            {selectedFiles.length > 0 &&
              `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`}
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>
              Cancel
            </Button>
            <Button
              size='sm'
              disabled={selectedFiles.length === 0}
              onClick={() =>
                onFileSelect?.(maxFiles === 1 ? selectedFiles[0] : (selectedFiles as any))
              }
            >
              Select ({selectedFiles.length})
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <FileUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        currentPath={currentPath}
        onUploadComplete={() => {
          mutate()
          setShowUploadModal(false)
        }}
      />

      <CreateFolderModal
        open={showCreateFolderModal}
        onClose={() => {
          mutate()
          setShowCreateFolderModal(false)
        }}
        currentPath={currentPath}
        existingFolders={existingFolders}
        onFolderCreated={() => {
          mutate()
          setShowCreateFolderModal(false)
        }}
      />

      <RenameModal
        open={renameFile !== null}
        onClose={() => {
          mutate()
          setRenameFile(null)
        }}
        file={renameFile}
        existingNames={existingNames}
        onRename={handleRename}
      />

      {/* Delete Confirmation Modal */}
      <deleteConfirmModal.ModalComponent />

      {/* Bulk Delete Confirmation Modal */}
      <bulkDeleteConfirmModal.ModalComponent />
    </div>
  )
}

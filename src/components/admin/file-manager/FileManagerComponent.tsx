'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import useAsync from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import {
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
  Upload
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { CreateFolderModal } from './CreateFolderModal'
import { FileDetailsPanel } from './FileDetailsPanel'
import { FileGrid } from './FileGrid'
import { FileList } from './FileList'
import { FilePreviewModal } from './FilePreviewModal'
import { FileUploadModal } from './FileUploadModal'
import { RenameModal } from './RenameModal'

export interface FileItem {
  type: 'file' | 'folder'
  name: string
  createdAt: string
  updatedAt: string
  fileId: string
  url?: string
  thumbnail?: string
  fileType?: 'image' | 'non-image'
  filePath: string
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
}

export function FileManagerComponent({
  mode = 'standalone',
  onFileSelect,
  allowedTypes = [],
  maxFiles = 1,
  className
}: FileManagerComponentProps) {
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [renameFile, setRenameFile] = useState<FileItem | null>(null)
  const isMobile = useIsMobile()

  // Build API path based on current folder
  const apiPath = useMemo(() => {
    const params = new URLSearchParams({
      fileType: 'all',
      path: currentPath,
      ...(searchQuery && { search: searchQuery })
    })
    return `/admin/media?${params.toString()}`
  }, [currentPath, searchQuery])

  const { data, loading, mutate } = useAsync<{
    items: FileItem[]
    page: number
    perPage: number
    hasMore: boolean
  }>(() => apiPath)

  // Path breadcrumbs
  const pathSegments = useMemo(() => {
    if (currentPath === '/') return [{ name: 'Root', path: '/' }]
    const segments = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Root', path: '/' }]

    let currentSegmentPath = ''
    segments.forEach((segment) => {
      currentSegmentPath += `/${segment}`
      breadcrumbs.push({
        name: segment,
        path: currentSegmentPath
      })
    })

    return breadcrumbs
  }, [currentPath])

  // Filtered files based on allowed types
  const filteredFiles = useMemo(() => {
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
  }, [data?.items, allowedTypes])

  // Get existing folder names for uniqueness check
  const existingFolders = useMemo(() => {
    return filteredFiles
      .filter((item: FileItem) => item.type === 'folder')
      .map((folder: FileItem) => folder.name)
  }, [filteredFiles])

  // Get existing file names for rename check
  const existingNames = useMemo(() => {
    return filteredFiles.map((item: FileItem) => item.name)
  }, [filteredFiles])

  // Handle folder navigation
  const handleFolderClick = useCallback((folder: FileItem) => {
    setCurrentPath(folder.filePath)
    setSelectedFile(null)
  }, [])

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: FileItem) => {
      if (mode === 'modal' && onFileSelect) {
        if (maxFiles === 1) {
          onFileSelect(file)
        } else {
          // Multi-select logic
          const isSelected = selectedFiles.some((f) => f.fileId === file.fileId)
          if (isSelected) {
            setSelectedFiles((prev) => prev.filter((f) => f.fileId !== file.fileId))
          } else if (selectedFiles.length < maxFiles) {
            setSelectedFiles((prev) => [...prev, file])
          }
        }
      } else {
        setSelectedFile(file)
      }
    },
    [mode, onFileSelect, maxFiles, selectedFiles]
  )

  // Handle file preview
  const handleFilePreview = useCallback((file: FileItem) => {
    setPreviewFile(file)
  }, [])

  // Handle file/folder delete
  const handleDelete = useCallback(
    async (file: FileItem) => {
      try {
        const response = await fetch('/api/admin/media/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fileId: file.fileId,
            path: file.filePath,
            type: file.type
          })
        })

        if (response.ok) {
          mutate() // Refresh the file list
          // Clear selected file if it was deleted
          if (selectedFile?.fileId === file.fileId) {
            setSelectedFile(null)
          }
        } else {
          // Handle error - you might want to show a toast notification
          console.error('Failed to delete file/folder')
        }
      } catch (error) {
        console.error('Error deleting file/folder:', error)
      }
    },
    [mutate, selectedFile]
  )

  // Handle file/folder rename
  const handleRename = useCallback(
    async (file: FileItem, newName: string) => {
      try {
        const response = await fetch('/api/admin/media/rename', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fileId: file.fileId,
            currentName: file.name,
            newName: newName,
            path: file.filePath,
            type: file.type
          })
        })

        if (response.ok) {
          mutate() // Refresh the file list
          // Update selected file if it was renamed
          if (selectedFile?.fileId === file.fileId) {
            setSelectedFile({ ...selectedFile, name: newName })
          }
        } else {
          throw new Error('Failed to rename')
        }
      } catch (error) {
        console.error('Error renaming file/folder:', error)
        throw error
      }
    },
    [mutate, selectedFile]
  )

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = useCallback((path: string) => {
    setCurrentPath(path)
    setSelectedFile(null)
  }, [])

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
    <div className={cn('flex flex-col bg-background h-full', className)}>
      {/* Toolbar */}
      <div className='flex flex-col gap-4 bg-muted/30 p-4 border-b'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-1 text-sm'>
          <Home className='w-4 h-4' />
          {pathSegments.map((segment, index) => (
            <div key={segment.path} className='flex items-center'>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {/* View Toggle */}
            <div className='flex items-center p-1 border rounded-lg'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className='w-4 h-4' />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('list')}
              >
                <List className='w-4 h-4' />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button variant='outline' size='sm' onClick={() => setShowCreateFolderModal(true)}>
              <Plus className='w-4 h-4' />
              {!isMobile && 'New Folder'}
            </Button>

            <Button size='sm' onClick={() => setShowUploadModal(true)}>
              <Upload className='w-4 h-4' />
              {!isMobile && 'Upload'}
            </Button>
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
              getFileIcon={getFileIcon}
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
        onClose={() => setShowCreateFolderModal(false)}
        currentPath={currentPath}
        existingFolders={existingFolders}
        onFolderCreated={() => {
          mutate()
          setShowCreateFolderModal(false)
        }}
      />

      <FilePreviewModal
        open={previewFile !== null}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />

      <RenameModal
        open={renameFile !== null}
        onClose={() => setRenameFile(null)}
        file={renameFile}
        existingNames={existingNames}
        onRename={handleRename}
      />
    </div>
  )
}

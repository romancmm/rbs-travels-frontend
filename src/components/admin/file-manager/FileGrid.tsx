'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Eye } from 'lucide-react'
import Image from 'next/image'
import { FileContextMenu } from './FileContextMenu'
import { FileItem } from './FileManagerComponent'

interface FileGridProps {
  files: FileItem[]
  onFileSelect: (file: FileItem) => void
  onFolderClick: (folder: FileItem) => void
  onFilePreview: (file: FileItem) => void
  onFileDelete: (file: FileItem) => void
  onFileRename: (file: FileItem) => void
  selectedFiles: FileItem[]
  getFileIcon: (file: FileItem) => any
}

export function FileGrid({
  files,
  onFileSelect,
  onFolderClick,
  onFilePreview,
  onFileDelete,
  onFileRename,
  selectedFiles,
  getFileIcon
}: FileGridProps) {
  const isSelected = (file: FileItem) => selectedFiles.some((f) => f.fileId === file.fileId)

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const handleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      onFolderClick(file)
    } else {
      onFileSelect(file)
    }
  }

  return (
    <div className='p-4'>
      <div className='gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'>
        {files.map((file) => {
          const Icon = getFileIcon(file)
          const selected = isSelected(file)

          return (
            <Card
              key={file.fileId}
              className={cn(
                'group relative hover:shadow-md transition-all duration-200 cursor-pointer',
                'aspect-square flex flex-col overflow-hidden',
                selected && 'ring-2 ring-primary bg-primary/5'
              )}
              onClick={() => handleClick(file)}
              onDoubleClick={() => {
                if (file.type === 'file') {
                  onFilePreview(file)
                }
              }}
            >
              {/* File Preview */}
              <div className='flex flex-1 justify-center items-center bg-muted/30 p-4'>
                {file.type === 'folder' ? (
                  <Icon className='w-12 h-12 text-primary' />
                ) : file.fileType === 'image' && file.thumbnail ? (
                  <div className='relative w-full h-full'>
                    <Image
                      src={file.thumbnail}
                      alt={file.name}
                      fill
                      className='rounded-sm object-cover'
                      sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 12.5vw'
                    />
                  </div>
                ) : (
                  <Icon className='w-12 h-12 text-muted-foreground' />
                )}
              </div>

              {/* File Info */}
              <div className='bg-background p-2 border-t'>
                <div className='font-medium text-xs truncate' title={file.name}>
                  {file.name}
                </div>
                <div className='flex justify-between items-center mt-1 text-muted-foreground text-xs'>
                  <span>{file.type === 'folder' ? 'Folder' : formatFileSize(file.size)}</span>
                  <span>{formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Actions Menu */}
              <div className='top-2 right-2 absolute flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                {file.type === 'file' && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='bg-background/80 backdrop-blur-sm p-0 w-6 h-6'
                    onClick={(e) => {
                      e.stopPropagation()
                      onFilePreview(file)
                    }}
                  >
                    <Eye className='w-3 h-3' />
                  </Button>
                )}
                <FileContextMenu
                  file={file}
                  onPreview={onFilePreview}
                  onRename={onFileRename}
                  onDelete={onFileDelete}
                  onFolderOpen={onFolderClick}
                  className='bg-background/80 backdrop-blur-sm p-0 w-6 h-6'
                />
              </div>

              {/* Selection Indicator */}
              {selected && (
                <div className='top-2 left-2 absolute flex justify-center items-center bg-primary rounded-full w-4 h-4'>
                  <div className='bg-primary-foreground rounded-full w-2 h-2' />
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

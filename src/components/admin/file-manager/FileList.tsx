'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Eye } from 'lucide-react'
import Image from 'next/image'
import { FileContextMenu } from './FileContextMenu'
import { FileItem } from './FileManagerComponent'

interface FileListProps {
  files: FileItem[]
  onFileSelect: (file: FileItem) => void
  onFolderClick: (folder: FileItem) => void
  onFilePreview: (file: FileItem) => void
  onFileDelete: (file: FileItem) => void
  onFileRename: (file: FileItem) => void
  selectedFiles: FileItem[]
  getFileIcon: (file: FileItem) => any
}

export function FileList({
  files,
  onFileSelect,
  onFolderClick,
  onFilePreview,
  onFileDelete,
  onFileRename,
  selectedFiles,
  getFileIcon
}: FileListProps) {
  const isSelected = (file: FileItem) => selectedFiles.some((f) => f.fileId === file.fileId)

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Unknown'
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return 'Unknown'
    }
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-8'></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className='w-32'>Type</TableHead>
            <TableHead className='w-24'>Size</TableHead>
            <TableHead className='w-40'>Modified</TableHead>
            <TableHead className='w-12'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => {
            const Icon = getFileIcon(file)
            const selected = isSelected(file)

            return (
              <TableRow
                key={index}
                className={cn(
                  'hover:bg-muted/50 transition-colors cursor-pointer',
                  selected && 'bg-primary/5 border-l-2 border-l-primary'
                )}
                onClick={() => handleClick(file)}
                onDoubleClick={() => {
                  if (file.type === 'file') {
                    onFilePreview(file)
                  }
                }}
              >
                <TableCell>
                  <div className='relative flex justify-center items-center w-8 h-8'>
                    {file.type === 'folder' ? (
                      <Icon className='w-5 h-5 text-primary' />
                    ) : file.fileType === 'image' && file.thumbnail ? (
                      <Image
                        src={file.thumbnail}
                        alt={file.name}
                        width={32}
                        height={32}
                        className='rounded object-cover'
                      />
                    ) : (
                      <Icon className='w-5 h-5 text-muted-foreground' />
                    )}

                    {selected && (
                      <div className='-top-1 -right-1 absolute flex justify-center items-center bg-primary rounded-full w-3 h-3'>
                        <div className='bg-primary-foreground rounded-full w-1.5 h-1.5' />
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className='flex flex-col'>
                    <span className='max-w-xs font-medium truncate' title={file.name}>
                      {file.name}
                    </span>
                    {file.type === 'file' && file.mime && (
                      <span className='text-muted-foreground text-xs'>{file.mime}</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span className='text-sm capitalize'>
                    {file.type === 'folder' ? 'Folder' : file.fileType || 'File'}
                  </span>
                </TableCell>

                <TableCell>
                  <span className='text-sm'>
                    {file.type === 'folder' ? '-' : formatFileSize(file.size)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className='text-muted-foreground text-sm'>
                    {formatDate(file.updatedAt)}
                  </span>
                </TableCell>

                <TableCell>
                  <div className='flex gap-1'>
                    {file.type === 'file' && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='p-0 w-8 h-8'
                        onClick={(e) => {
                          e.stopPropagation()
                          onFilePreview(file)
                        }}
                      >
                        <Eye className='w-4 h-4' />
                      </Button>
                    )}
                    <FileContextMenu
                      file={file}
                      onPreview={onFilePreview}
                      onRename={onFileRename}
                      onDelete={onFileDelete}
                      onFolderOpen={onFolderClick}
                      className='p-0 w-8 h-8'
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

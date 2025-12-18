'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Copy, Download, Edit3, Eye, FolderOpen, MoreVertical, Trash2 } from 'lucide-react'
import { FileItem } from './FileManagerComponent'

interface FileContextMenuProps {
  file: FileItem
  onPreview?: (file: FileItem) => void
  onRename?: (file: FileItem) => void
  onDelete?: (file: FileItem) => void
  onFolderOpen?: (folder: FileItem) => void
  className?: string
}

export function FileContextMenu({
  file,
  onPreview,
  onRename,
  onDelete,
  onFolderOpen,
  className
}: FileContextMenuProps) {
  const handleDownload = () => {
    if (file.url) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You can add a toast notification here
  }

  const handleDelete = () => {
    const confirmMessage =
      file.type === 'folder'
        ? `Are you sure you want to delete the folder "${file.name}" and all its contents? This action cannot be undone.`
        : `Are you sure you want to delete "${file.name}"? This action cannot be undone.`

    if (confirm(confirmMessage) && onDelete) {
      onDelete(file)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className={className}>
          <MoreVertical className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        {file.type === 'folder' ? (
          <DropdownMenuItem onClick={() => onFolderOpen?.(file)}>
            <FolderOpen className='mr-2 w-4 h-4' />
            Open Folder
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onClick={() => onPreview?.(file)}>
              <Eye className='mr-2 w-4 h-4' />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload} disabled={!file.url}>
              <Download className='mr-2 w-4 h-4' />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copyToClipboard(file.url || '')} disabled={!file.url}>
              <Copy className='mr-2 w-4 h-4' />
              Copy URL
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onRename?.(file)}>
          <Edit3 className='mr-2 w-4 h-4' />
          Rename
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDelete} className='text-red-600 focus:text-red-600'>
          <Trash2 className='mr-2 w-4 h-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

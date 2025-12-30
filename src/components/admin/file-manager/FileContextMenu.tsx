'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Copy, Download, Edit3, FolderOpen, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { FileItem } from './FileManagerComponent'

interface FileContextMenuProps {
  file: FileItem
  onRename?: (file: FileItem) => void
  onDelete?: (file: FileItem) => void
  onFolderOpen?: (folder: FileItem) => void
  className?: string
}

export function FileContextMenu({
  file,
  onRename,
  onDelete,
  onFolderOpen,
  className
}: FileContextMenuProps) {
  const [open, setOpen] = useState(false)

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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false) // Close the dropdown
    onDelete?.(file)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className={className}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <MoreVertical className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        {file.type === 'folder' ? (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onFolderOpen?.(file)
            }}
          >
            <FolderOpen className='mr-2 w-4 h-4' />
            Open Folder
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDownload()
              }}
              disabled={!file.url}
            >
              <Download className='mr-2 w-4 h-4' />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                copyToClipboard(file.url || '')
              }}
              disabled={!file.url}
            >
              <Copy className='mr-2 w-4 h-4' />
              Copy URL
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRename?.(file)
          }}
        >
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

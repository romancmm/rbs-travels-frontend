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
    <div className='bg-gray-50/30 p-6'>
      <div className='bg-white shadow-md border border-gray-200/80 rounded-2xl overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='bg-linear-to-r from-gray-50 hover:from-gray-50 to-gray-50/50 hover:to-gray-50/50 border-gray-100 border-b-2'>
              <TableHead className='w-12 font-bold text-gray-600'></TableHead>
              <TableHead className='font-bold text-gray-700'>Name</TableHead>
              <TableHead className='w-32 font-bold text-gray-700'>Type</TableHead>
              <TableHead className='w-28 font-bold text-gray-700'>Size</TableHead>
              <TableHead className='w-40 font-bold text-gray-700'>Modified</TableHead>
              <TableHead className='w-24 font-bold text-gray-700 text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => {
              const Icon = getFileIcon(file)
              const selected = isSelected(file)

              return (
                <TableRow
                  key={file.fileId}
                  className={cn(
                    'group hover:bg-primary/5 hover:shadow-sm border-gray-100/50 border-b transition-all duration-200 cursor-pointer',
                    selected &&
                      'bg-linear-to-r from-primary/10 to-primary/5 border-l-4 border-l-primary shadow-md ring-1 ring-primary/20'
                  )}
                  onClick={() => handleClick(file)}
                  onDoubleClick={() => {
                    if (file.type === 'file') {
                      onFilePreview(file)
                    }
                  }}
                >
                  <TableCell>
                    <div className='relative flex justify-center items-center w-11 h-11'>
                      {file.type === 'folder' ? (
                        <div className='flex justify-center items-center bg-linear-to-br from-primary/10 group-hover:from-primary/20 to-primary/5 group-hover:to-primary/10 shadow-sm rounded-xl w-full h-full transition-all duration-200'>
                          <Icon className='drop-shadow-sm w-5 h-5 text-primary' />
                        </div>
                      ) : file.fileType === 'image' && file.thumbnail ? (
                        <div className='relative shadow-sm rounded-xl ring-1 ring-gray-200/50 w-full h-full overflow-hidden'>
                          <Image
                            src={file.thumbnail}
                            alt={file.name}
                            width={44}
                            height={44}
                            className='rounded-xl w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                          />
                        </div>
                      ) : (
                        <div className='flex justify-center items-center bg-linear-to-br from-gray-100 group-hover:from-gray-200 to-gray-200/80 group-hover:to-gray-300/80 shadow-sm rounded-xl w-full h-full transition-all duration-200'>
                          <Icon className='w-5 h-5 text-gray-600' />
                        </div>
                      )}

                      {selected && (
                        <div className='-top-1 -right-1 absolute flex justify-center items-center bg-primary shadow-lg rounded-full ring-2 ring-white w-5 h-5 animate-in duration-200 zoom-in-50'>
                          <div className='bg-white rounded-full w-2 h-2' />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='flex flex-col gap-1'>
                      <span
                        className='max-w-md font-bold text-gray-800 group-hover:text-primary text-sm truncate transition-colors duration-200'
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      {file.type === 'file' && file.mime && (
                        <span className='font-medium text-muted-foreground text-xs'>
                          {file.mime}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className='inline-flex items-center gap-1.5 bg-linear-to-r from-gray-100 group-hover:from-primary/10 to-gray-50 group-hover:to-primary/5 shadow-sm px-3 py-1.5 rounded-lg font-semibold text-gray-700 text-xs capitalize transition-all duration-200'>
                      {file.type === 'folder' ? (
                        <>
                          <Icon className='w-3.5 h-3.5' />
                          Folder
                        </>
                      ) : (
                        <>
                          <Icon className='w-3.5 h-3.5' />
                          {file.fileType || 'File'}
                        </>
                      )}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className='font-medium text-gray-600 text-sm'>
                      {file.type === 'folder' ? '-' : formatFileSize(file.size)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className='text-muted-foreground text-sm'>
                      {formatDate(file.updatedAt)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className='flex justify-end gap-2'>
                      {file.type === 'file' && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='hover:bg-primary/10 opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-md p-0 rounded-lg w-9 h-9 hover:scale-110 transition-all duration-200'
                          onClick={(e) => {
                            e.stopPropagation()
                            onFilePreview(file)
                          }}
                        >
                          <Eye className='w-4 h-4 text-primary' />
                        </Button>
                      )}
                      <FileContextMenu
                        file={file}
                        onPreview={onFilePreview}
                        onRename={onFileRename}
                        onDelete={onFileDelete}
                        onFolderOpen={onFolderClick}
                        className='hover:bg-primary/10 opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-md p-0 rounded-lg w-9 h-9 hover:scale-110 transition-all duration-200'
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

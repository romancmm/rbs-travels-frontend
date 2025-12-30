'use client'

import CustomImage from '@/components/common/CustomImage'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { FileContextMenu } from './FileContextMenu'
import { FileItem } from './FileManagerComponent'

interface FileGridProps {
  files: FileItem[]
  onFileSelect: (file: FileItem) => void
  onFolderClick: (folder: FileItem) => void
  onFileDelete: (file: FileItem) => void
  onFileRename: (file: FileItem) => void
  selectedFiles: FileItem[]
  selectionMode?: boolean
  getFileIcon: (file: FileItem) => any
}
export function FileGrid({
  files,
  onFileSelect,
  onFolderClick,
  onFileDelete,
  onFileRename,
  selectedFiles,
  selectionMode = false,
  getFileIcon
}: FileGridProps) {
  // Helper to get unique ID for both files and folders
  const getItemId = (item: FileItem) => {
    return item.type === 'file' ? item.fileId : item.folderId
  }

  const isSelected = (file: FileItem) => selectedFiles.some((f) => getItemId(f) === getItemId(file))

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const handleClick = (file: FileItem) => {
    if (selectionMode) {
      onFileSelect(file)
    } else if (file.type === 'folder') {
      onFolderClick(file)
    } else {
      onFileSelect(file)
    }
  }

  return (
    <div className='bg-gray-50/30 p-6'>
      <div className='gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-8 xl:grid-cols-6'>
        {files.map((file, index) => {
          const Icon = getFileIcon(file)
          const selected = isSelected(file)

          return (
            <div
              key={index}
              className={cn(
                'group relative hover:shadow-xl border hover:scale-[1.03] transition-all duration-300 cursor-pointer',
                'flex flex-col overflow-hidden rounded-xl bg-white',
                selected
                  ? 'ring-2 ring-primary ring-offset-2 border-primary bg-primary/5 shadow-xl'
                  : 'border-gray-200/90 hover:border-primary/40'
              )}
              onClick={() => handleClick(file)}
              onDoubleClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (file.type === 'folder' && !selectionMode) {
                  onFolderClick(file)
                }
              }}
            >
              {/* Selection Checkbox */}
              {selectionMode && (
                <div className='top-3 left-3 z-10 absolute'>
                  <Checkbox
                    checked={selected}
                    onCheckedChange={() => onFileSelect(file)}
                    onClick={(e) => e.stopPropagation()}
                    className='bg-white shadow-lg border-2 w-5 h-5'
                  />
                </div>
              )}
              {/* File Preview */}
              <div className='relative flex flex-col flex-1 justify-center items-center bg-linear-to-br from-gray-50 via-gray-50/50 to-white'>
                {file.type === 'folder' ? (
                  <div className='flex flex-col justify-center items-center p-4'>
                    <div className='flex justify-center items-center bg-linear-to-br from-primary/10 group-hover:from-primary/20 to-primary/5 group-hover:to-primary/10 shadow-sm mb-2 rounded-3xl w-20 h-20 transition-all duration-300'>
                      <Icon className='drop-shadow-sm w-9 h-9 text-primary' />
                    </div>
                  </div>
                ) : file.fileType === 'image' && file.thumbnail ? (
                  <div className='relative w-full h-full min-h-32 overflow-hidden'>
                    <CustomImage
                      src={file.thumbnail}
                      alt={file.name}
                      fill
                      className='h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      // sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 12.5vw'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>
                ) : (
                  <div className='flex flex-col justify-center items-center'>
                    <div className='flex justify-center items-center bg-linear-to-br from-gray-100 group-hover:from-gray-200 to-gray-200/80 group-hover:to-gray-300/80 shadow-sm mb-2 rounded-3xl w-20 h-20 transition-all duration-300'>
                      <Icon className='w-9 h-9 text-gray-600' />
                    </div>
                  </div>
                )}
              </div>
              {/* File Info */}
              <div className='bg-white/95 backdrop-blur-sm px-2.5 py-2 border-gray-100 border-t'>
                <div
                  className='font-semibold text-gray-800 group-hover:text-primary text-xs truncate transition-colors duration-200'
                  title={file.name}
                >
                  {file.name}
                </div>
                <div className='flex justify-between items-center gap-2 mt-1'>
                  <span className='font-medium text-[11px] text-muted-foreground truncate'>
                    {file.type === 'folder' ? 'Folder' : formatFileSize(file.size)}
                  </span>
                  {file.type === 'file' && file.mime && (
                    <span className='bg-primary/10 px-1.5 py-0.5 rounded font-semibold text-[10px] text-primary shrink-0'>
                      {file.mime.split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                  )}
                </div>
              </div>
              {/* Actions Menu */}
              {!selectionMode && (
                <div className='top-3 right-3 absolute flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200'>
                  <FileContextMenu
                    file={file}
                    onRename={onFileRename}
                    onDelete={onFileDelete}
                    onFolderOpen={onFolderClick}
                    className='bg-white/98 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-md p-0 border border-gray-200/50 rounded-xl w-8 h-8 hover:scale-110 transition-all duration-200'
                  />
                </div>
              )}{' '}
              {/* Selection Indicator */}
              {selected && !selectionMode && (
                <div className='top-3 left-3 absolute flex justify-center items-center bg-primary shadow-lg rounded-full ring-2 ring-white w-6 h-6 animate-in duration-200 zoom-in-50'>
                  <div className='bg-white rounded-full w-2.5 h-2.5' />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

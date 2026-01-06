'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { FileItem, FileManagerComponent } from './FileManagerComponent'

interface FileManagerModalProps {
  open: boolean
  onClose: () => void
  onFileSelect: (file: FileItem | FileItem[]) => void
  allowedTypes?: string[]
  maxFiles?: number
  title?: string
  description?: string
}

export function FileManagerModal({
  open,
  onClose,
  onFileSelect,
  allowedTypes = [],
  maxFiles = 1,
  title = 'Select Files',
  description = 'Choose files from your media library'
}: FileManagerModalProps) {
  const handleFileSelect = (file: FileItem | FileItem[]) => {
    onFileSelect(file)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='flex flex-col min-w-[90vw] max-h-[90vh] h-full overflow-hidden w-full'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className='flex-1 min-h-0 h-full'>
          <FileManagerComponent
            mode='modal'
            onFileSelect={handleFileSelect}
            allowedTypes={allowedTypes}
            maxFiles={maxFiles}
            className='h-full'
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

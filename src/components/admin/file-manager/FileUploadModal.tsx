'use client'

import FileUploader from '@/components/common/FileUploader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'

interface FileUploadModalProps {
  open: boolean
  onClose: () => void
  currentPath: string
  onUploadComplete: () => void
}

export function FileUploadModal({
  open,
  onClose,
  currentPath,
  onUploadComplete
}: FileUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string | string[]>([])

  const handleUploadComplete = (urls: string | string[]) => {
    setUploadedFiles(urls)
    onUploadComplete()
    onClose()
  }

  const handleClose = () => {
    setUploadedFiles([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='flex flex-col max-w-2xl max-h-[80vh]'>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload files to {currentPath === '/' ? 'root directory' : currentPath}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col flex-1 gap-4 overflow-hidden'>
          <div className='mb-2 text-muted-foreground text-sm'>
            Uploading to:{' '}
            <code className='bg-muted px-1 py-0.5 rounded text-xs'>
              {currentPath === '/' ? 'Root' : currentPath}
            </code>
          </div>
          <FileUploader
            value={uploadedFiles}
            onChangeAction={handleUploadComplete}
            multiple={true}
            maxAllow={10}
            size='extra-large'
          />
        </div>

        <div className='flex justify-between items-center pt-4 border-t'>
          <div className='text-muted-foreground text-sm'>
            Supports images, documents, and media files
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

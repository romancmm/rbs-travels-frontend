'use client'

import CustomImage from '@/components/common/CustomImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Download,
  ExternalLink,
  File,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  X
} from 'lucide-react'
import { FileItem } from './FileManagerComponent'

interface FilePreviewModalProps {
  open: boolean
  onClose: () => void
  file: FileItem | null
}

export function FilePreviewModal({ open, onClose, file }: FilePreviewModalProps) {
  if (!file) return null

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = () => {
    if (file.fileType === 'image') return FileImage
    if (file.mime?.startsWith('video/')) return FileVideo
    if (file.mime?.startsWith('audio/')) return FileAudio
    if (file.mime?.includes('pdf') || file.mime?.includes('document')) return FileText
    return File
  }

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

  const handleOpenInNewTab = () => {
    if (file.url) {
      window.open(file.url, '_blank')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You can add a toast notification here
  }

  const Icon = getFileIcon()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='flex flex-col max-w-4xl max-h-[90vh]'>
        <DialogHeader className='pb-4'>
          <div className='flex-1 min-w-0'>
            <DialogTitle className='flex items-center gap-2 text-xl'>
              <Icon className='w-6 h-6' />
              <span className='truncate'>{file.name}</span>
            </DialogTitle>
            <DialogDescription className='mt-2'>File preview and details</DialogDescription>
          </div>
        </DialogHeader>

        <div className='flex flex-col flex-1 gap-6 overflow-y-auto'>
          {/* Preview Area */}
          <div className='flex flex-col flex-1'>
            <div className='flex flex-1 justify-center items-center bg-muted/30 border-2 border-muted border-dashed rounded-lg min-h-96'>
              {file.fileType === 'image' && (file.url || file.thumbnail) ? (
                <div className='relative w-full max-w-full h-full max-h-full aspect-video'>
                  <CustomImage
                    src={file.url || file.thumbnail!}
                    alt={file.name}
                    fill
                    className='rounded-lg object-contain'
                  // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
                  />
                </div>
              ) : file.mime?.startsWith('video/') && file.url ? (
                <video controls className='rounded-lg max-w-full max-h-full' src={file.url}>
                  Your browser does not support the video tag.
                </video>
              ) : file.mime?.startsWith('audio/') && file.url ? (
                <div className='w-full max-w-md'>
                  <audio controls className='w-full'>
                    <source src={file.url} type={file.mime} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : file.mime?.includes('pdf') && file.url ? (
                <div className='w-full h-full'>
                  <iframe
                    src={file.url}
                    className='border rounded-lg w-full h-full'
                    title={file.name}
                  />
                </div>
              ) : (
                <div className='text-center'>
                  <Icon className='mx-auto mb-4 w-24 h-24 text-muted-foreground' />
                  <p className='font-medium text-lg'>Preview not available</p>
                  <p className='text-muted-foreground text-sm'>
                    This file type cannot be previewed
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 mt-4'>
              <Button variant='outline' size='sm' onClick={handleDownload} disabled={!file.url}>
                <Download className='mr-2 w-4 h-4' />
                Download
              </Button>

              <Button variant='outline' size='sm' onClick={handleOpenInNewTab} disabled={!file.url}>
                <ExternalLink className='mr-2 w-4 h-4' />
                Open in New Tab
              </Button>

              {file.url && (
                <Button variant='outline' size='sm' onClick={() => copyToClipboard(file.url!)}>
                  <X className='mr-2 w-4 h-4' />
                  Copy URL
                </Button>
              )}
            </div>
          </div>

          {/* File Information Panel */}
          <div className='space-y-4 w-80'>
            {/* File Details */}
            <div className='space-y-3'>
              <h3 className='font-semibold text-lg'>File Information</h3>

              <div className='space-y-2'>
                <div>
                  <label className='font-medium text-muted-foreground text-sm'>Name</label>
                  <p className='text-sm break-all'>{file.name}</p>
                </div>

                <div>
                  <label className='font-medium text-muted-foreground text-sm'>Type</label>
                  <div className='flex gap-2 mt-1'>
                    <Badge variant='outline'>{file.fileType || 'File'}</Badge>
                    {file.mime && (
                      <Badge variant='secondary'>{file.mime.split('/')[1]?.toUpperCase()}</Badge>
                    )}
                  </div>
                </div>

                <div>
                  <label className='font-medium text-muted-foreground text-sm'>Size</label>
                  <p className='text-sm'>{formatFileSize(file.size)}</p>
                </div>

                {file.width && file.height && (
                  <div>
                    <label className='font-medium text-muted-foreground text-sm'>Dimensions</label>
                    <p className='text-sm'>
                      {file.width} × {file.height} pixels
                    </p>
                  </div>
                )}

                <div>
                  <label className='font-medium text-muted-foreground text-sm'>Created</label>
                  <p className='text-sm'>{formatDate(file.createdAt)}</p>
                </div>

                <div>
                  <label className='font-medium text-muted-foreground text-sm'>Modified</label>
                  <p className='text-sm'>{formatDate(file.updatedAt)}</p>
                </div>

                <div>
                  <label className='font-medium text-muted-foreground text-sm'>Path</label>
                  <code
                    className='block bg-muted hover:bg-muted/80 mt-1 px-2 py-1 rounded text-xs break-all cursor-pointer'
                    onClick={() => copyToClipboard(file.filePath)}
                    title='Click to copy'
                  >
                    {file.filePath}
                  </code>
                </div>

                {file.url && (
                  <div>
                    <label className='font-medium text-muted-foreground text-sm'>URL</label>
                    <code
                      className='block bg-muted hover:bg-muted/80 mt-1 px-2 py-1 rounded text-xs break-all cursor-pointer'
                      onClick={() => copyToClipboard(file.url!)}
                      title='Click to copy'
                    >
                      {file.url}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

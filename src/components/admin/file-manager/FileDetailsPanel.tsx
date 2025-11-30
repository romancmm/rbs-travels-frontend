'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calendar,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileType,
  HardDrive,
  Image as ImageIcon,
  Trash2,
  X
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { FileItem } from './FileManagerComponent'

interface FileDetailsPanelProps {
  file: FileItem
  onClose: () => void
}

export function FileDetailsPanel({ file, onClose }: FileDetailsPanelProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You can add a toast notification here
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this file?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/media/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileId: file.fileId,
          path: file.filePath
        })
      })

      if (response.ok) {
        onClose()
        // You should trigger a refresh of the file list here
      }
    } catch {
      // Handle error
    } finally {
      setIsDeleting(false)
    }
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

  return (
    <div className='flex flex-col bg-muted/30 border-l w-80'>
      {/* Header */}
      <div className='flex justify-between items-center p-4 border-b'>
        <h3 className='font-medium'>File Details</h3>
        <Button variant='ghost' size='sm' onClick={onClose}>
          <X className='w-4 h-4' />
        </Button>
      </div>

      {/* Content */}
      <div className='flex-1 space-y-4 p-4 overflow-auto'>
        {/* Preview */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex justify-center items-center bg-muted mb-3 rounded-lg aspect-video'>
              {file.fileType === 'image' && file.thumbnail ? (
                <Image
                  src={file.thumbnail}
                  alt={file.name}
                  width={200}
                  height={150}
                  className='rounded-lg max-w-full max-h-full object-cover'
                />
              ) : (
                <div className='text-center'>
                  {file.fileType === 'image' ? (
                    <ImageIcon className='mx-auto mb-2 w-12 h-12 text-muted-foreground' />
                  ) : (
                    <FileType className='mx-auto mb-2 w-12 h-12 text-muted-foreground' />
                  )}
                  <p className='text-muted-foreground text-sm'>No preview available</p>
                </div>
              )}
            </div>

            <h4 className='font-medium truncate' title={file.name}>
              {file.name}
            </h4>

            <div className='flex items-center gap-2 mt-2'>
              <Badge variant='outline' className='text-xs'>
                {file.fileType || 'File'}
              </Badge>
              {file.mime && (
                <Badge variant='secondary' className='text-xs'>
                  {file.mime.split('/')[1]?.toUpperCase()}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Information */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm'>Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center gap-2 text-sm'>
              <HardDrive className='w-4 h-4 text-muted-foreground' />
              <span className='text-muted-foreground'>Size:</span>
              <span className='font-medium'>{formatFileSize(file.size)}</span>
            </div>

            {file.width && file.height && (
              <div className='flex items-center gap-2 text-sm'>
                <ImageIcon className='w-4 h-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Dimensions:</span>
                <span className='font-medium'>
                  {file.width} × {file.height}
                </span>
              </div>
            )}

            <div className='flex items-center gap-2 text-sm'>
              <Calendar className='w-4 h-4 text-muted-foreground' />
              <span className='text-muted-foreground'>Modified:</span>
              <span className='font-medium'>
                {/* {formatDistanceToNow(new Date(file?.updatedAt), { addSuffix: true })} */}
              </span>
            </div>

            <div className='flex items-start gap-2 text-sm'>
              <Copy className='mt-0.5 w-4 h-4 text-muted-foreground' />
              <div className='flex-1 min-w-0'>
                <span className='block mb-1 text-muted-foreground'>Path:</span>
                <code
                  className='block bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs break-all cursor-pointer'
                  onClick={() => copyToClipboard(file.filePath)}
                  title='Click to copy'
                >
                  {file.filePath}
                </code>
              </div>
            </div>

            {file.url && (
              <div className='flex items-start gap-2 text-sm'>
                <ExternalLink className='mt-0.5 w-4 h-4 text-muted-foreground' />
                <div className='flex-1 min-w-0'>
                  <span className='block mb-1 text-muted-foreground'>URL:</span>
                  <code
                    className='block bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs break-all cursor-pointer'
                    onClick={() => copyToClipboard(file.url!)}
                    title='Click to copy'
                  >
                    {file.url}
                  </code>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className='space-y-2 p-4 border-t'>
        <Button
          variant='outline'
          size='sm'
          className='justify-start w-full'
          onClick={handleDownload}
          disabled={!file.url}
        >
          <Download className='mr-2 w-4 h-4' />
          Download
        </Button>

        <Button
          variant='outline'
          size='sm'
          className='justify-start w-full'
          onClick={() => copyToClipboard(file.url || '')}
          disabled={!file.url}
        >
          <Copy className='mr-2 w-4 h-4' />
          Copy URL
        </Button>

        <Button variant='outline' size='sm' className='justify-start w-full'>
          <Edit3 className='mr-2 w-4 h-4' />
          Rename
        </Button>

        <Button
          variant='destructive'
          size='sm'
          className='justify-start w-full'
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className='mr-2 w-4 h-4' />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  )
}

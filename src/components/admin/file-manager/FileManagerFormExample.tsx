'use client'

import { FileItem, FileManagerModal } from '@/components/admin/file-manager'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface FileManagerFormExampleProps {
  className?: string
}

export function FileManagerFormExample({ className }: FileManagerFormExampleProps) {
  const [showFileManager, setShowFileManager] = useState(false)
  const [selectedImages, setSelectedImages] = useState<FileItem[]>([])
  const [selectedDocument, setSelectedDocument] = useState<FileItem | null>(null)

  const handleImageSelect = (files: FileItem | FileItem[]) => {
    const fileArray = Array.isArray(files) ? files : [files]
    setSelectedImages(fileArray)
  }

  const handleDocumentSelect = (file: FileItem | FileItem[]) => {
    const singleFile = Array.isArray(file) ? file[0] : file
    setSelectedDocument(singleFile)
  }

  const removeImage = (fileId: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.fileId !== fileId))
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>File Manager Example</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Title Field */}
          <div className='space-y-2'>
            <Label htmlFor='title'>Post Title</Label>
            <Input id='title' placeholder='Enter post title' />
          </div>

          {/* Featured Image Selection */}
          <div className='space-y-2'>
            <Label>Featured Images (Multiple)</Label>
            <div className='gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mb-4'>
              {selectedImages.map((image) => (
                <div key={image.fileId} className='group relative'>
                  <div className='border rounded-lg aspect-square overflow-hidden'>
                    {image.thumbnail ? (
                      <Image
                        src={image.thumbnail}
                        alt={image.name}
                        width={200}
                        height={200}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='flex justify-center items-center bg-muted w-full h-full'>
                        <ImageIcon className='w-8 h-8 text-muted-foreground' />
                      </div>
                    )}
                  </div>
                  <Button
                    variant='destructive'
                    size='sm'
                    className='top-2 right-2 absolute opacity-0 group-hover:opacity-100 p-0 w-6 h-6 transition-opacity'
                    onClick={() => removeImage(image.fileId)}
                  >
                    <X className='w-3 h-3' />
                  </Button>
                  <p className='mt-1 text-muted-foreground text-xs truncate' title={image.name}>
                    {image.name}
                  </p>
                </div>
              ))}

              {/* Add Images Button */}
              <Button
                variant='outline'
                className='flex-col gap-2 h-auto aspect-square'
                onClick={() => setShowFileManager(true)}
              >
                <Upload className='w-6 h-6' />
                <span className='text-xs'>Add Images</span>
              </Button>
            </div>
            <p className='text-muted-foreground text-xs'>
              {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Document Selection */}
          <div className='space-y-2'>
            <Label>Attachment (Single)</Label>
            <div className='flex items-center gap-4'>
              {selectedDocument ? (
                <div className='flex flex-1 items-center gap-3 p-3 border rounded-lg'>
                  <div className='flex justify-center items-center bg-muted rounded w-10 h-10'>
                    <ImageIcon className='w-5 h-5 text-muted-foreground' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium truncate'>{selectedDocument.name}</p>
                    <p className='text-muted-foreground text-xs'>
                      {selectedDocument.fileType} •{' '}
                      {selectedDocument.size
                        ? `${(selectedDocument.size / 1024).toFixed(1)} KB`
                        : 'Unknown size'}
                    </p>
                  </div>
                  <Button variant='ghost' size='sm' onClick={() => setSelectedDocument(null)}>
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              ) : (
                <Button
                  variant='outline'
                  onClick={() => setShowFileManager(true)}
                  className='flex-1'
                >
                  <Upload className='mr-2 w-4 h-4' />
                  Select Document
                </Button>
              )}
            </div>
          </div>

          {/* Content Field */}
          <div className='space-y-2'>
            <Label htmlFor='content'>Content</Label>
            <textarea
              id='content'
              className='px-3 py-2 border rounded-md w-full h-32 resize-none'
              placeholder='Enter content...'
            />
          </div>

          {/* Form Actions */}
          <div className='flex gap-2'>
            <Button variant='outline'>Cancel</Button>
            <Button>Save Post</Button>
          </div>
        </CardContent>
      </Card>

      {/* File Manager Modal for Images */}
      <FileManagerModal
        open={showFileManager}
        onClose={() => setShowFileManager(false)}
        onFileSelect={handleImageSelect}
        allowedTypes={['image']}
        maxFiles={5}
        title='Select Images'
        description='Choose up to 5 images for your post'
      />

      {/* You could have another modal for documents with different settings */}
      {/* 
      <FileManagerModal
        open={showDocumentManager}
        onClose={() => setShowDocumentManager(false)}
        onFileSelect={handleDocumentSelect}
        allowedTypes={['document']}
        maxFiles={1}
        title='Select Document'
        description='Choose a document attachment'
      />
      */}
    </div>
  )
}

'use client'

import { FileItem } from '@/components/admin/file-manager/FileManagerComponent'
import { FileManagerModal } from '@/components/admin/file-manager/FileManagerModal'
import CustomImage from '@/components/common/CustomImage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { Trash2, Upload } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'

// CVA variants
const containerVariants = cva('', {
  variants: {
    size: {
      small: 'w-16 h-16',
      medium: 'w-32 h-32',
      large: 'w-32 h-32',
      'extra-large': 'w-48 h-48'
    }
  },
  defaultVariants: {
    size: 'medium'
  }
})

const thumbnailVariants = cva('', {
  variants: {
    size: {
      small: 'w-14 h-14 border-0!',
      medium: 'w-16 h-16',
      large: 'w-20 h-20',
      'extra-large': 'w-24 h-24 min-w-48 h-48 w-full'
    }
  },
  defaultVariants: {
    size: 'medium'
  }
})

const iconVariants = cva('', {
  variants: {
    size: {
      small: 'w-6 h-6',
      medium: 'w-8 h-8',
      large: 'w-8 h-8',
      'extra-large': 'w-8 h-8'
    }
  },
  defaultVariants: {
    size: 'medium'
  }
})

const uploadAreaVariants = cva('', {
  variants: {
    size: {
      small: 'w-16 h-16 p-0',
      medium: 'w-32 h-32 p-4',
      large: 'w-32 h-32 p-4',
      'extra-large': 'w-full min-h-60 p-4'
    }
  },
  defaultVariants: {
    size: 'medium'
  }
})

const textVariants = cva('', {
  variants: {
    size: {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-base',
      'extra-large': 'text-base font-medium'
    }
  },
  defaultVariants: {
    size: 'medium'
  }
})

const spacingVariants = cva('', {
  variants: {
    size: {
      small: 'gap-1',
      medium: 'gap-2',
      large: 'gap-2',
      'extra-large': 'gap-3'
    }
  },
  defaultVariants: {
    size: 'medium'
  }
})

// Helper function to get size classes
const getSizeClasses = (
  size: 'small' | 'medium' | 'large' | 'extra-large',
  hasFiles: boolean = false
) => ({
  container: containerVariants({ size }),
  thumbnail: thumbnailVariants({
    size: size === 'extra-large' && hasFiles ? 'large' : size
  }),
  icon: iconVariants({ size }),
  uploadArea: uploadAreaVariants({ size }),
  text: textVariants({ size }),
  spacing: spacingVariants({ size })
})

type FilePreview = {
  uid: string
  name: string
  url: string
  type?: string
}

type TProps = {
  value?: string | string[]
  onChangeAction: (url: string | string[]) => void
  multiple?: boolean
  maxAllow?: number
  size?: 'small' | 'medium' | 'large' | 'extra-large'
  allowedTypes?: string[] // e.g., ['image', 'video', 'document']
}

type SelectButtonProps = {
  size: 'small' | 'medium' | 'large' | 'extra-large'
  onClick: () => void
  multiple?: boolean
}

// Separate Select Button Component
const SelectButton = ({ size, onClick, multiple = false }: SelectButtonProps) => {
  const sizeClasses = getSizeClasses(size, false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        onClick={onClick}
        className={`group bg-gray-50 p-6 rounded-md text-center flex items-center justify-center transition-colors cursor-pointer hover:border-primary/20 hover:bg-primary/5 ${sizeClasses.thumbnail}`}
      >
        <div className='flex flex-col justify-center items-center w-full h-full cursor-pointer'>
          <div
            className={`flex flex-col items-center group-hover:text-primary transition-colors ${sizeClasses.spacing}`}
          >
            <div className={cn({ 'bg-primary/5 mb-2 p-3 rounded-full': size === 'extra-large' })}>
              <Upload
                className={cn(sizeClasses.icon, { 'text-primary/80': size === 'extra-large' })}
              />
            </div>
            <span className={`${sizeClasses.text} ${size === 'extra-large' ? '/50' : ''}`}>
              {size === 'extra-large' ? 'Click to select or upload' : 'Select'}
            </span>
            {size === 'extra-large' && (
              <span className='text-xs'>Choose from media library or upload new files</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function FilePicker({
  value,
  onChangeAction,
  multiple = false,
  maxAllow = 5,
  size = 'medium',
  allowedTypes = []
}: TProps) {
  const [showFileManager, setShowFileManager] = useState(false)
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>(() => {
    // Initialize from value prop
    if (!value) return []
    const urls = Array.isArray(value) ? value : [value]
    return urls.filter(Boolean).map((url, index) => ({
      uid: `existing-${index}`,
      name: url.split('/').pop() || `file-${index}`,
      url,
      type: getFileType(url)
    }))
  })

  const hasFiles = filePreviews.length > 0
  const sizeClasses = getSizeClasses(size, hasFiles)

  // Update previews when value prop changes externally
  React.useEffect(() => {
    if (!value) {
      setFilePreviews([])
      return
    }
    const urls = Array.isArray(value) ? value : [value]
    const newPreviews = urls.filter(Boolean).map((url, index) => ({
      uid: `existing-${index}`,
      name: url.split('/').pop() || `file-${index}`,
      url,
      type: getFileType(url)
    }))
    setFilePreviews(newPreviews)
  }, [value])

  const handleFileSelect = (file: FileItem | FileItem[]) => {
    const selectedFiles = Array.isArray(file) ? file : [file]

    const newPreviews: FilePreview[] = selectedFiles.map((f) => ({
      uid: f.fileId,
      name: f.name,
      url: f.url || '',
      type: f.fileType
    }))

    if (multiple) {
      const combined = [...filePreviews, ...newPreviews].slice(0, maxAllow)
      setFilePreviews(combined)
      const urls = combined.map((p) => p.url)
      onChangeAction(urls)
    } else {
      setFilePreviews(newPreviews)
      onChangeAction(newPreviews[0]?.url || '')
    }
  }

  const handleFileRemove = (fileToRemove: FilePreview) => {
    const newPreviews = filePreviews.filter((f) => f.uid !== fileToRemove.uid)
    setFilePreviews(newPreviews)

    const urls = newPreviews.map((p) => p.url)
    onChangeAction(multiple ? urls : urls[0] || '')
  }

  const showSelectButton = () => {
    if (multiple) {
      return filePreviews.length < maxAllow
    } else {
      return filePreviews.length === 0
    }
  }

  return (
    <>
      <div className='space-y-4'>
        {/* File Grid */}
        <AnimatePresence>
          <div
            className={`bg-background flex flex-wrap items-center justify-center gap-3 border-2 border-dashed border-border rounded-lg transition-colors cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${sizeClasses.uploadArea}`}
          >
            {/* File List */}
            {filePreviews.map((file, index) => (
              <motion.div
                key={file.uid}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <div
                  className={`group relative border-2 rounded-lg ${sizeClasses.thumbnail} overflow-hidden hover:border-primary/50 transition-colors`}
                >
                  {/* Check if file is an image */}
                  {/* {file.type === 'image' || file.url?.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ? ( */}
                  <CustomImage
                    src={file.url}
                    alt={file.name}
                    fill
                    className='p-1 rounded-md object-cover'
                  />
                  {/* ) : (
                     Non-image file display 
                    <div className='flex flex-col justify-center items-center bg-gray-50 p-2 w-full h-full'>
                      <FileText className='mb-1 w-8 h-8 text-gray-500' />
                      <span className='w-full text-gray-600 text-xs text-center truncate'>
                        {file.name}
                      </span>
                    </div>
                  )} */}

                  {/* Overlay with actions */}
                  <div className='absolute inset-0 flex justify-center items-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 p-2 transition-opacity duration-200'>
                    {/* Remove Item */}
                    <Button
                      type='button'
                      size={size === 'extra-large' ? 'default' : 'sm'}
                      variant='ghost'
                      className='hover:bg-white/20 text-white hover:text-white'
                      onClick={() => handleFileRemove(file)}
                    >
                      <Trash2 className={size === 'extra-large' ? 'w-5 h-5' : sizeClasses.icon} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Show select button if slots available */}
            {showSelectButton() && (
              <SelectButton
                size={size === 'extra-large' && hasFiles ? 'large' : size}
                onClick={() => setShowFileManager(true)}
                multiple={multiple}
              />
            )}
          </div>
        </AnimatePresence>
      </div>

      {/* File Manager Modal */}
      <FileManagerModal
        open={showFileManager}
        onClose={() => setShowFileManager(false)}
        onFileSelect={handleFileSelect}
        allowedTypes={allowedTypes}
        maxFiles={multiple ? maxAllow - filePreviews.length : 1}
        title={multiple ? 'Select Files' : 'Select File'}
        description='Choose from your media library or upload new files'
      />
    </>
  )
}

// Helper function to determine file type from URL
function getFileType(url: string): string {
  if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return 'image'
  if (url.match(/\.(mp4|avi|mov|wmv|webm)$/i)) return 'video'
  if (url.match(/\.(mp3|wav|ogg)$/i)) return 'audio'
  if (url.match(/\.(pdf|doc|docx|xls|xlsx|txt)$/i)) return 'document'
  return 'file'
}

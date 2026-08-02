'use client'

import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import useAsync from '@/hooks/useAsync.hook'
import { getCroppedImg } from '@/lib/crop-image'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Cloud, Loader2, X } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Cropper, { Area } from 'react-easy-crop'
import { toast } from 'sonner'
import CustomImage from './CustomImage'

// ---------- TYPES ----------
export interface UploadedFile {
  file: File
  preview: string
  id: string
  uploadedUrl?: string
  mediaData?: any // Full media response from server
}

// ---------- CVA VARIANTS ----------
const uploadAreaVariants = cva(
  'group flex flex-col justify-center items-center w-full cursor-pointer',
  {
    variants: {
      size: {
        sm: 'h-36 md:size-42 p-0!',
        md: 'h-40 md:size-64',
        lg: 'h-72 md:size-80',
        xl: 'h-80 md:size-[28rem]'
      },
      shape: {
        square: 'aspect-square rounded-3xl',
        circle: 'aspect-square rounded-full',
        rectangle: 'aspect-video rounded-xl'
      }
    },
    defaultVariants: {
      size: 'md',
      shape: 'square'
    }
  }
)

interface PhotoUploaderProps extends VariantProps<typeof uploadAreaVariants> {
  /** Called with the full current set of media (existing + newly uploaded,
   * minus any removed) whenever the held images change - not just a delta. */
  onUpload?: (mediaData: any[]) => void
  multiple?: boolean
  maxFiles?: number
  aspectRatio?: number
  accept?: Record<string, string[]>
  /** Server-side category the upload is tagged with. Defaults to 'General' when omitted. */
  resourceType?: 'UserProfile' | 'Blog' | 'Event' | 'Menu' | 'PageBuilder' | 'Settings' | 'General'
  renderTriggerOnly?: boolean
  showPreview?: boolean
  className?: string
  /** Pre-populate the uploader with existing image URL(s) - a single URL for
   * single mode, or an array for `multiple`. Covers both restoring from
   * localStorage and pre-filling an edit form with previously-saved images. */
  initialValue?: string | string[]
  isPublic?: boolean
}

function toInitialFiles(value?: string | string[]): UploadedFile[] {
  const urls: string[] = Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []
  return urls.map((url, index) => ({
    file: new File([], 'existing'),
    preview: url,
    id: `initial-${index}`,
    uploadedUrl: url
  }))
}

// Pre-existing (initial) files only carry `uploadedUrl`, not `mediaData` - fall
// back to a { url } shape for those so the reported payload always reflects
// every currently-held image, regardless of whether it was just uploaded or
// pre-populated via `initialValue`.
function toMediaPayload(files: UploadedFile[]): unknown[] {
  return files
    .map((f) => f.mediaData ?? (f.uploadedUrl ? { url: f.uploadedUrl } : null))
    .filter(Boolean)
}

export interface PhotoUploaderHandle {
  openFileDialog: () => void
}

// ---------- HELPER: Resize large image ----------
const resizeImage = async (file: File, maxWidth = 2000, maxHeight = 2000): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (!blob) return resolve(file)
        resolve(new File([blob], file.name, { type: file.type }))
      }, file.type)
    }
  })
}

const PhotoUploader = forwardRef<PhotoUploaderHandle, PhotoUploaderProps>(function PhotoUploader(
  {
    onUpload,
    multiple = false,
    maxFiles = 20,
    aspectRatio,
    accept = { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'] },
    size = 'md',
    shape = 'square',
    resourceType = 'General',
    renderTriggerOnly = false,
    showPreview = true,
    className,
    initialValue,
    isPublic = false
  }: PhotoUploaderProps,
  ref
) {
  const [files, setFiles] = useState<UploadedFile[]>(() => toInitialFiles(initialValue))
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropping, setCropping] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileQueue, setFileQueue] = useState<File[]>([])
  const [cropperResetKey, setCropperResetKey] = useState(0)

  // Sync files state when initialValue changes (e.g. after page reload restores data)
  useEffect(() => {
    const nextInitial = toInitialFiles(initialValue)
    const isShowingOnlyInitial = files.length > 0 && files.every((f) => f.id.startsWith('initial-'))

    if (nextInitial.length > 0 && files.length === 0) {
      setFiles(nextInitial)
    } else if (nextInitial.length === 0 && isShowingOnlyInitial) {
      setFiles([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue])

  const { execute: uploadFile } = useAsync<{ url: string }, FormData>({
    path: isPublic ? '/public/media/upload' : '/media/upload',
    method: 'POST'
  })

  // If multiple is false, limit to 1 file
  const effectiveMaxFiles = multiple ? maxFiles : 1

  const onDrop = async (acceptedFiles: File[]) => {
    const remainingSlots = multiple ? effectiveMaxFiles - files.length : 1
    if (multiple && remainingSlots <= 0) {
      toast.warning('Maximum Limit Reached', {
        description: `You can only upload ${effectiveMaxFiles} ${effectiveMaxFiles === 1 ? 'photo' : 'photos'}`
      })
      return
    }

    const filesToProcess = acceptedFiles.slice(0, remainingSlots)

    setUploading(true)
    const resizedFiles = await Promise.all(filesToProcess.map((f) => resizeImage(f)))

    // Start cropping the first file
    setCropFile(resizedFiles[0])
    setFileQueue(resizedFiles.slice(1))
    setCropping(true)
    setUploading(false)
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    multiple: multiple,
    noClick: renderTriggerOnly,
    maxSize: 15 * 1024 * 1024 // 15MB
  })

  useImperativeHandle(
    ref,
    () => ({
      openFileDialog: () => open()
    }),
    [open]
  )

  const uploadToServer = async (file: File): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('resourceType', resourceType)

    const result = await uploadFile({ body: formData })

    if (result.error) {
      // showErrorToast(result.error)
      return null
    }
    return result.data
  }

  const handleCropComplete = async (croppedFile: File) => {
    // Keep cropper visible, start uploading
    setUploading(true)

    // Upload to server
    const uploadResult = await uploadToServer(croppedFile)

    if (!uploadResult) {
      setUploading(false)

      if (fileQueue.length > 0) {
        setCropFile(fileQueue[0])
        setFileQueue(fileQueue.slice(1))
      } else {
        setCropperResetKey((prev) => prev + 1)
      }
      return
    }

    const newFile: UploadedFile = {
      file: croppedFile,
      preview: URL.createObjectURL(croppedFile),
      id: `${Date.now()}-${Math.random()}`,
      uploadedUrl: uploadResult?.response.data?.url ?? undefined,
      mediaData: uploadResult?.response.data ?? undefined
    }

    const updatedFiles = multiple ? [...files, newFile] : [newFile]
    setFiles(updatedFiles)
    setUploading(false)

    // Check if there are more files in the queue
    if (fileQueue.length > 0) {
      setCropFile(fileQueue[0])
      setFileQueue(fileQueue.slice(1))
    } else {
      // Hide cropper only after all uploads are done
      setCropping(false)
      setCropFile(null)
      onUpload?.(toMediaPayload(updatedFiles))
    }
  }

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((f) => f.id !== id)
    setFiles(updatedFiles)
    onUpload?.(toMediaPayload(updatedFiles))
  }

  return (
    <div className={cn(renderTriggerOnly ? 'space-y-0' : 'space-y-6')}>
      {/* Upload Area */}
      {renderTriggerOnly ? (
        <div
          {...getRootProps()}
          className='absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none'
          aria-hidden='true'
        >
          <input {...getInputProps()} />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            uploadAreaVariants({ size, shape }),
            'relative aspect-square h-auto w-full gap-5 overflow-hidden border-2 border-dashed border-gray-200 bg-white p-6 transition-colors hover:border-gray-300',
            { 'border-primary bg-primary/5': isDragActive },
            className
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className='text-primary animate-spin' size={40} />
          ) : showPreview && (!multiple || effectiveMaxFiles === 1) && files.length > 0 ? (
            // Show uploaded image for single file mode
            <div className={cn(uploadAreaVariants({ size, shape }), 'relative h-full w-full')}>
              <CustomImage
                src={files[0].preview}
                alt='Uploaded photo'
                fill
                className='object-cover'
              />
              <div
                className={cn(
                  uploadAreaVariants({ size, shape }),
                  '_backdrop-blur-xs absolute inset-0 bg-white/5 opacity-0 transition-opacity hover:opacity-100'
                )}
              >
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(files[0].id)
                  }}
                  className='bg-red-500 shadow-lg p-2 rounded-full hover:scale-110 transition-transform cursor-pointer'
                >
                  <X className='w-5 h-5 text-white' />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Cloud size={36} />
              <Typography
                variant={size === 'sm' ? 'body2' : 'body1'}
                className='text-neutral-400 text-center leading-tight'
              >
                Drag & drop a photo here
              </Typography>
              {size !== 'sm' && (
                <>
                  <div className='flex items-center gap-3 w-full'>
                    <div className='flex-1 bg-gray-300 h-px'></div>
                    <span className='font-bold text-neutral-300 text-xs'>OR</span>
                    <div className='flex-1 bg-gray-300 h-px'></div>
                  </div>
                  <Button
                    type='button'
                    className='bg-primary/5 hover:bg-primary/10 px-8 font-semibold text-primary text-sm transition-colors'
                  >
                    Upload Photo
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Uploaded Photos Preview (for multiple mode only) */}
      {showPreview && multiple && files.length > 0 && (
        <div className='space-y-3'>
          <Typography variant='body2' className='text-neutral-600'>
            Uploaded Photos ({files.length}/{effectiveMaxFiles})
          </Typography>
          <div className='flex flex-wrap gap-4 *:max-w-32'>
            {files.map((file) => (
              <div
                key={file.id}
                className='group relative border border-gray-200 rounded-lg aspect-square overflow-hidden'
              >
                <CustomImage
                  src={file.preview}
                  alt='Uploaded'
                  className='w-full h-full object-contain'
                />
                <button
                  type='button'
                  onClick={() => removeFile(file.id)}
                  className='top-1 right-1 absolute bg-red-500 opacity-0 group-hover:opacity-100 p-1 rounded-full transition-opacity cursor-pointer'
                >
                  <X className='w-4 h-4 text-white' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cropper Modal */}
      {cropping && cropFile && (
        <ImageCropper
          key={cropperResetKey}
          file={cropFile}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropping(false)
            setCropFile(null)
            setFileQueue([])
          }}
          remainingCount={fileQueue.length}
          defaultAspectRatio={aspectRatio}
          uploading={uploading}
        />
      )}
    </div>
  )
})

export default PhotoUploader

// ---------- IMAGE CROPPER ----------
interface ImageCropperProps {
  file: File
  onCropComplete: (file: File) => void
  onCancel: () => void
  remainingCount?: number
  defaultAspectRatio?: number
  uploading?: boolean
}

function ImageCropper({
  file,
  onCropComplete,
  onCancel,
  remainingCount = 0,
  defaultAspectRatio,
  uploading = false
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState(defaultAspectRatio ?? 1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [loading, setLoading] = useState(false)

  const imageUrl = URL.createObjectURL(file)

  const onCropCompleteInternal = (_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }

  const handleCrop = async () => {
    if (!croppedAreaPixels) return
    setLoading(true)
    try {
      const croppedFile = await getCroppedImg(file, croppedAreaPixels)
      setLoading(false)
      onCropComplete(croppedFile)
    } catch (error) {
      console.error('Crop failed:', error)
      setLoading(false)
    }
  }

  const isProcessing = loading || uploading

  return (
    <div className='z-50 fixed inset-0 flex justify-center items-center bg-black/70 p-4'>
      <div className='relative flex flex-col bg-gray-900 p-4 rounded-lg w-full max-w-md h-125'>
        {remainingCount > 0 && (
          <div className='bg-primary/20 mb-2 px-3 py-1 rounded text-white text-sm text-center'>
            {remainingCount} more {remainingCount === 1 ? 'photo' : 'photos'} to crop
          </div>
        )}
        <div className='relative flex-1 bg-black rounded overflow-hidden'>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
            objectFit='contain'
          />
        </div>

        {/* Zoom Slider */}
        <div className='mt-4'>
          <label className='block mb-1 text-white text-sm'>Zoom</label>
          <input
            type='range'
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className='w-full'
            disabled={isProcessing}
          />
        </div>

        {/* Aspect Ratios */}
        {!defaultAspectRatio && (
          <div className='flex gap-2 mt-2'>
            {[1, 4 / 3, 16 / 9].map((r) => (
              <Button
                type='button'
                key={r}
                size='sm'
                variant={aspect === r ? 'default' : 'outline'}
                onClick={() => setAspect(r)}
                disabled={isProcessing}
              >
                {r === 1 ? '1:1' : r === 4 / 3 ? '4:3' : '16:9'}
              </Button>
            ))}
          </div>
        )}
        {/* Actions */}
        <div className='flex justify-end gap-2 mt-4'>
          <Button type='button' variant='outline' onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button type='button' onClick={handleCrop} disabled={isProcessing}>
            {uploading ? (
              <>
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                Uploading...
              </>
            ) : loading ? (
              <>
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                Cropping...
              </>
            ) : (
              'Crop & Upload'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

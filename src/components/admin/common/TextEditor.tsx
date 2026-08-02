'use client'

import { Label } from '@/components/ui/label'
import { uploadImages, validateFile, type RcFile } from '@/lib/uploader'
import dynamic from 'next/dynamic'
import { forwardRef, useCallback, useRef } from 'react'

// Dynamically import Jodit (disable SSR)
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false
})

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  buttons?: string[]
  placeholder?: string
  height?: number | string
  required?: boolean
  theme?: 'light' | 'dark' | 'auto'
  backgroundColor?: string
  toolbarBackgroundColor?: string
}
// Matches Jodit's IUploaderAnswer - what customUploadFunction must resolve to.
interface JoditUploaderAnswer {
  success: boolean
  time: string
  data: {
    messages?: string[]
    files: string[]
    isImages?: boolean[]
    baseurl: string
  }
}

interface JoditConfig {
  height: number | string
  processPasteHTML: boolean
  askBeforePasteHTML: boolean
  defaultActionOnPaste: string
  readonly: boolean
  theme?: string
  style?: {
    background?: string
    color?: string
  }
  uploader: {
    insertImageAsBase64URI: boolean
    imagesExtensions: string[]
    filesVariableName: (i: number) => string
    beforeUpload: (files: File[]) => boolean
    customUploadFunction: (requestData: FormData) => Promise<JoditUploaderAnswer>
  }
}
const TextEditor = forwardRef<any, TextEditorProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      height = 400,
      required = false,
      theme = 'auto',
      backgroundColor,
      toolbarBackgroundColor
    },
    ref
  ) => {
    const editorRef = useRef(null)
    const contentRef = useRef(value)

    // Update ref when value changes from outside
    contentRef.current = value

    // Handle content change without triggering re-render
    const handleBlur = useCallback(
      (newContent: string) => {
        if (newContent !== contentRef.current) {
          onChange(newContent)
        }
      },
      [onChange]
    )

    // Get theme-based colors
    const getThemeColors = () => {
      if (backgroundColor) {
        return { background: backgroundColor }
      }

      switch (theme) {
        case 'dark':
          return {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--muted))'
          }
        case 'light':
          return {
            background: '#ffffff',
            color: 'hsl(var(--muted))'
          }
        case 'auto':
        default:
          return {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))'
          }
      }
    }

    // Get toolbar background color
    const getToolbarBgColor = () => {
      if (toolbarBackgroundColor) {
        return toolbarBackgroundColor
      }

      switch (theme) {
        case 'dark':
          return 'hsl(var(--muted) / 0.5)'
        case 'light':
          return '#f8f9fa'
        case 'auto':
        default:
          return 'hsl(var(--muted) / 0.5)'
      }
    }

    // Config function
    const getConfig = (): JoditConfig => {
      const themeColors = getThemeColors()

      return {
        height,
        processPasteHTML: true,
        askBeforePasteHTML: false,
        defaultActionOnPaste: 'insert_as_html',
        readonly: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        style: themeColors,
        uploader: {
          // Files are uploaded to the media API and inserted by URL - embedding
          // them as base64 blew up the request body past the backend's size
          // limit (413 Payload Too Large) as soon as an image was inserted.
          insertImageAsBase64URI: false,
          imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
          filesVariableName: () => 'files[]',
          beforeUpload: (files) => files.every((file) => validateFile(file as RcFile)),
          customUploadFunction: async (requestData) => {
            try {
              const urls = await uploadImages(requestData, {})
              return {
                success: true,
                time: '',
                data: {
                  files: urls,
                  baseurl: '',
                  isImages: urls.map(() => true)
                }
              }
            } catch (err) {
              return {
                success: false,
                time: '',
                data: {
                  messages: [err instanceof Error ? err.message : 'Upload failed'],
                  files: [],
                  baseurl: ''
                }
              }
            }
          }
        }
      }
    }

    return (
      <div className='space-y-2'>
        {label && (
          <Label className='font-medium text-sm'>
            {label}
            {required && <span className='ml-1 text-red-500'>*</span>}
          </Label>
        )}
        <div
          className={`
            rounded-md border border-input 
            ${theme === 'dark' ? 'bg-background' : 'bg-background'}
            [&_.jodit-toolbar__box]:bg-foreground!
            [&_.jodit-container]:bg-transparent!
            [&_.jodit-workplace]:bg-transparent!  
            [&_.jodit-wysiwyg]:bg-transparent!
            [&_.jodit-toolbar]:border-b
            [&_.jodit-toolbar]:border-border
            [&_.jodit-toolbar-button]:bg-transparent!
            [&_.jodit-toolbar-button]:hover:bg-muted/80!
            [&_.jodit-toolbar-button]:border-transparent!
            [&_.jodit-status-bar]:bg-muted/30!
            [&_.jodit-status-bar]:text-muted-foreground!
            [&_.jodit-status-bar]:border-t
            [&_.jodit-status-bar]:border-border
          `}
          style={
            {
              backgroundColor: backgroundColor,
              '--toolbar-bg': getToolbarBgColor()
            } as React.CSSProperties & { '--toolbar-bg': string }
          }
        >
          {/* <style jsx>{`
            div :global(.jodit-toolbar) {
              background-color: var(--toolbar-bg) !important;
            }
            div :global(.jodit-wysiwyg) {
              color: white !important;
            }
            div :global(.jodit-wysiwyg *) {
              color: inherit !important;
            }
          `}</style> */}
          <JoditEditor
            ref={ref || editorRef}
            value={value}
            config={getConfig() as any}
            onBlur={handleBlur}
            tabIndex={-1}
            className={`
              ${theme === 'dark' ? 'text-foreground' : 'text-black'}
            `}
          />
        </div>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
      </div>
    )
  }
)

TextEditor.displayName = 'TextEditor'

export default TextEditor

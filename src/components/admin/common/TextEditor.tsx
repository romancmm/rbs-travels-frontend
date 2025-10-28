'use client'

import { Label } from '@/components/ui/label'
import dynamic from 'next/dynamic'
import { forwardRef, useRef } from 'react'

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
          insertImageAsBase64URI: true,
          imagesExtensions: ['jpg', 'png', 'jpeg', 'gif']
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
            [&_.jodit-container]:!bg-transparent
            [&_.jodit-workplace]:!bg-transparent  
            [&_.jodit-wysiwyg]:!bg-transparent
            [&_.jodit-toolbar]:border-b
            [&_.jodit-toolbar]:border-border
            [&_.jodit-toolbar-button]:!bg-transparent
            [&_.jodit-toolbar-button]:hover:!bg-muted/80
            [&_.jodit-toolbar-button]:!text-foreground
            [&_.jodit-toolbar-button]:!border-transparent
            [&_.jodit-status-bar]:!bg-muted/30
            [&_.jodit-status-bar]:!text-muted-foreground
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
          <style jsx>{`
            div :global(.jodit-toolbar) {
              background-color: var(--toolbar-bg) !important;
            }
          `}</style>
          <JoditEditor
            ref={ref || editorRef}
            value={value}
            config={getConfig() as any}
            onBlur={(newContent) => onChange(newContent)}
            onChange={(newContent) => onChange(newContent)}
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

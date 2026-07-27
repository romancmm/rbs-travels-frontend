'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { AlertTriangle, LucideIcon } from 'lucide-react'
import { useState } from 'react'
import CustomInput from './CustomInput'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (inputData?: Record<string, any>) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  isLoading?: boolean
  icon?: LucideIcon
  showInput?: boolean
  inputConfig?: {
    name: string
    label: string
    placeholder: string
    type?: 'text' | 'textarea'
    required?: boolean
  }
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
  icon: Icon = AlertTriangle,
  showInput = false,
  inputConfig
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState('')

  const handleConfirm = () => {
    const inputData = showInput && inputConfig ? { [inputConfig.name]: inputValue } : undefined
    onConfirm(inputData)
  }

  const handleClose = () => {
    setInputValue('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='gap-0 p-0 sm:max-w-md overflow-hidden'>
        {/* Header */}
        <div className='flex items-start gap-3.5 p-6 pb-5'>
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-full size-10',
              variant === 'destructive'
                ? 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400'
                : 'bg-primary/10 text-primary'
            )}
          >
            <Icon className='size-5' strokeWidth={2} />
          </div>

          <DialogHeader className='space-y-1 pt-0.5 text-left'>
            <DialogTitle className='font-semibold text-base leading-tight'>{title}</DialogTitle>
            <DialogDescription className='text-muted-foreground text-sm leading-relaxed'>
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Input Section */}
        {showInput && inputConfig && (
          <div className='px-6 pb-5 pl-13.5'>
            <CustomInput
              name={inputConfig.name}
              label={inputConfig.label}
              placeholder={inputConfig.placeholder}
              type={inputConfig.type || 'text'}
              className='w-full'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

        {/* Action Buttons */}
        <DialogFooter className='flex-row justify-end gap-2 bg-muted/40 px-6 py-4 border-t'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleClose}
            disabled={isLoading}
            className='min-w-20'
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            size='sm'
            onClick={handleConfirm}
            disabled={isLoading || (showInput && inputConfig?.required && !inputValue.trim())}
            className='min-w-20 font-medium'
          >
            {isLoading ? (
              <span className='flex items-center gap-2'>
                <span className='border-2 border-current border-t-transparent rounded-full size-3.5 animate-spin' />
                Processing
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

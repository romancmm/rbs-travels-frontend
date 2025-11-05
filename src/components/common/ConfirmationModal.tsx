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
      <DialogContent className='gap-0 p-0 sm:max-w-[440px] overflow-hidden'>
        {/* Icon Header with Gradient Background */}
        <div
          className={`flex flex-col items-center justify-center pt-8 pb-6 px-6 ${
            variant === 'destructive'
              ? 'bg-linear-to-br from-red-500/10 via-red-500/5 to-background'
              : 'bg-linear-to-br from-primary/10 via-primary/5 to-background'
          }`}
        >
          <div
            className={`rounded-full p-4 mb-4 ring-4 ${
              variant === 'destructive'
                ? 'bg-red-500/15 text-red-500 ring-red-500/10'
                : 'bg-primary/15 text-primary ring-primary/10'
            }`}
          >
            <Icon className='w-8 h-8' strokeWidth={2} />
          </div>

          <DialogHeader className='space-y-3 text-center'>
            <DialogTitle className='font-semibold text-xl tracking-tight'>{title}</DialogTitle>
            <DialogDescription className='max-w-sm text-muted-foreground text-sm leading-relaxed'>
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Input Section */}
        {showInput && inputConfig && (
          <div className='bg-muted/30 px-6 py-4'>
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
        <DialogFooter className='flex flex-row gap-3 bg-background p-6'>
          <Button
            variant='outline'
            onClick={handleClose}
            disabled={isLoading}
            className='flex-1 h-10'
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={isLoading || (showInput && inputConfig?.required && !inputValue.trim())}
            className='flex-1 h-10 font-medium'
          >
            {isLoading ? (
              <span className='flex items-center gap-2'>
                <span className='border-2 border-current border-t-transparent rounded-full w-4 h-4 animate-spin' />
                Processing...
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

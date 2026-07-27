'use client'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
export type FieldType =
  | 'text'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'textarea'
  | 'date'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'phoneNumber'
  | 'url'
  | 'tab'
  | 'range'

type TProps = {
  label?: string
  name?: string
  placeholder?: string
  error?: string
  helperText?: string
  required?: boolean
  type?: Exclude<FieldType, 'select' | 'radio' | 'checkbox'>
  rows?: number
  maxLength?: number
  showCharCount?: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  value?: string | number
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onCheckedChange?: (checked: boolean) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  onLeftIconClick?: () => void
  onRightIconClick?: () => void
}

const CustomInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TProps>(
  (
    {
      label,
      name,
      placeholder,
      error,
      helperText,
      required = false,
      type = 'text',
      rows = 5,
      maxLength,
      showCharCount = false,
      disabled = false,
      className,
      labelClassName,
      inputClassName,
      value,
      checked,
      onChange,
      onCheckedChange,
      onBlur,
      onKeyDown,
      prefix,
      suffix,
      onLeftIconClick,
      onRightIconClick,
      ...props
    },
    ref
  ) => {
    const isTextarea = type === 'textarea'
    const isSwitch = type === 'switch'
    const currentLength = value?.toString().length || 0
    const [showPassword, setShowPassword] = useState(false)

    const isPasswordField = type === 'password'
    const effectiveType = isPasswordField && showPassword ? 'text' : type
    const effectiveSuffix =
      isPasswordField && !suffix ? showPassword ? <EyeOff /> : <Eye /> : suffix
    const effectiveOnRightIconClick =
      isPasswordField && !onRightIconClick ? () => setShowPassword(!showPassword) : onRightIconClick

    const hasPrefix = !!prefix
    const hasSuffix = !!effectiveSuffix

    return (
      <div
        className={cn(
          'space-y-2 [&_label]:max-sm:font-normal [&_label]:max-sm:text-sm max-sm:text-sm',
          className
        )}
      >
        {label && !isSwitch && (
          <label
            htmlFor={name}
            className={cn(
              'block peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed',
              required && 'after:ml-1 after:text-red-500 after:content-["*"]',
              disabled && 'text-gray-400',
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        {isSwitch ? (
          <div className='flex items-center gap-2'>
            <Switch
              id={name}
              name={name}
              checked={checked}
              onCheckedChange={onCheckedChange}
              disabled={disabled}
              className={inputClassName}
              {...props}
            />
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  'font-medium text-sm leading-none peer-disabled:opacity-70 peer-disabled:cursor-not-allowed',
                  required && 'after:ml-1 after:text-red-500 after:content-["*"]',
                  disabled && 'text-gray-400',
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
          </div>
        ) : isTextarea ? (
          <Textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            id={name}
            name={name}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            value={value ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className={cn(error && 'border-red-500 focus-visible:ring-red-500', inputClassName)}
            {...props}
          />
        ) : (
          <div className='relative flex items-center gap-4 w-full'>
            <div className='relative flex-1'>
              {hasPrefix && (
                <button
                  type='button'
                  onClick={onLeftIconClick}
                  disabled={!onLeftIconClick}
                  className={cn(
                    'top-1/2 left-3 z-10 absolute [&>svg]:size-5 text-gray-400 -translate-y-1/2'
                  )}
                >
                  {prefix}
                </button>
              )}

              <Input
                ref={ref as React.ForwardedRef<HTMLInputElement>}
                id={name}
                name={name}
                type={effectiveType}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={disabled}
                value={value ?? ''}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                className={cn(
                  'flex-1 w-full',
                  error && 'border-primary focus-visible:ring-primary',
                  hasPrefix && 'pl-10',
                  hasSuffix && 'pr-10',

                  inputClassName
                )}
                {...props}
              />
            </div>

            {hasSuffix && (
              <button
                type='button'
                onClick={effectiveOnRightIconClick}
                disabled={!effectiveOnRightIconClick}
                className={cn(
                  'top-1/2 right-3 z-10 absolute [&>svg]:size-5 text-gray-500 -translate-y-1/2 shrink-0',
                  effectiveOnRightIconClick
                    ? 'cursor-pointer hover:opacity-90'
                    : 'cursor-default opacity-70'
                )}
              >
                {effectiveSuffix}
              </button>
            )}
          </div>
        )}

        <div className='flex justify-between items-start'>
          <div className='flex flex-col gap-1'>
            {error && <span className='font-medium text-red-500 text-xs'>{error}</span>}
            {helperText && !error && <span className='text-gray-500 text-xs'>{helperText}</span>}
          </div>

          {showCharCount && maxLength && (
            <span
              className={cn(
                'text-xs',
                currentLength > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400',
                currentLength >= maxLength && 'text-red-500'
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

CustomInput.displayName = 'CustomInput'

export default CustomInput

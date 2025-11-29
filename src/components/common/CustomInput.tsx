import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'

type TProps = {
  label?: string
  name?: string
  placeholder?: string
  error?: string
  helperText?: string
  required?: boolean
  type?:
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'switch'
  | 'select'
  | 'file'
  size?: 'small' | 'middle' | 'large'
  rows?: number
  compact?: boolean
  maxLength?: number
  showCharCount?: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  value?: string | number | boolean
  defaultValue?: any
  checked?: boolean
  options?: { value: string | number; label: string }[]
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onValueChange?: (value: string) => void
  onCheckedChange?: (checked: boolean) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  // Number input specific props
  step?: number | string
  min?: number | string
  max?: number | string
  // Prefix/Suffix props
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  // File input specific props
  accept?: string
  multiple?: boolean
  // Password visibility toggle
  showPasswordToggle?: boolean
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
      size = 'middle',
      rows = 4,
      maxLength,
      showCharCount = false,
      disabled = false,
      className,
      labelClassName,
      inputClassName,
      value,
      defaultValue,
      checked,
      options = [],
      onChange,
      onValueChange,
      onCheckedChange,
      onBlur,
      onKeyDown,
      step,
      min,
      max,
      prefix,
      suffix,
      accept,
      multiple,
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const isTextarea = type === 'textarea'
    const isCheckbox = type === 'checkbox'
    const isSwitch = type === 'switch'
    const isSelect = type === 'select'
    const currentLength = value?.toString().length || 0

    // Size variant classes
    const sizeClasses = {
      small: 'h-8 px-2 text-sm',
      middle: 'h-9 px-3 text-sm',
      large: 'h-12 px-4 text-base'
    }

    const textareaSizeClasses = {
      small: 'px-2 py-1 text-sm',
      middle: 'px-3 py-2 text-sm',
      large: 'px-4 py-3 text-base'
    }

    return (
      <div className={cn('flex flex-col', { 'gap-2': label || error || helperText }, className)}>
        {label && !isCheckbox && !isSwitch && (
          <Label
            htmlFor={name}
            className={cn(
              required && 'after:content-["*"] after:text-red-500 after:ml-1',
              disabled && 'text-gray-400',
              labelClassName
            )}
          >
            {label}
          </Label>
        )}

        {isCheckbox ? (
          <div className='flex items-center space-x-2'>
            <Checkbox
              id={name}
              checked={checked}
              onCheckedChange={onCheckedChange}
              disabled={disabled}
              className={inputClassName}
              {...(props as any)}
            />
            <Label
              htmlFor={name}
              className={cn(
                'font-medium text-sm',
                required && 'after:content-["*"] after:text-red-500 after:ml-1',
                disabled && 'text-gray-400',
                labelClassName
              )}
            >
              {label}
            </Label>
          </div>
        ) : isSwitch ? (
          <div className='flex items-center space-x-2'>
            <Switch
              id={name}
              checked={checked}
              onCheckedChange={onCheckedChange}
              disabled={disabled}
              className={inputClassName}
              {...(props as any)}
            />
            <Label
              htmlFor={name}
              className={cn(
                'font-medium text-sm',
                required && 'after:content-["*"] after:text-red-500 after:ml-1',
                disabled && 'text-gray-400',
                labelClassName
              )}
            >
              {label}
            </Label>
          </div>
        ) : isSelect ? (
          <Select onValueChange={onValueChange} value={value as string} disabled={disabled}>
            <SelectTrigger className={cn('w-full', error && 'border-red-500', inputClassName)}>
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : isTextarea ? (
          <Textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            id={name}
            name={name}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className={cn(
              textareaSizeClasses[size],
              error && 'border-red-500 focus-visible:ring-red-500',
              inputClassName
            )}
            {...(props as any)}
          />
        ) : prefix || suffix || (type === 'password' && showPasswordToggle) ? (
          // Input with prefix/suffix wrapper
          <div
            className={cn(
              'flex items-center bg-background file:bg-transparent disabled:opacity-50 border border-input file:border-0 focus-within:ring-2 focus-within:ring-ring ring-offset-background focus-within:ring-offset-2 file:font-medium file:text-sm disabled:cursor-not-allowed placeholder:',
              error && 'border-red-500 focus-within:ring-red-500',
              sizeClasses[size].includes('h-8') && 'h-8',
              sizeClasses[size].includes('h-10') && 'h-10',
              sizeClasses[size].includes('h-12') && 'h-12',
              'rounded-md px-3',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {prefix && (
              <div
                className={cn(
                  'flex items-center mr-2',
                  size === 'small' && 'text-sm',
                  size === 'large' && 'text-base'
                )}
              >
                {prefix}
              </div>
            )}
            <Input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              id={name}
              name={name}
              type={type === 'password' && showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
              placeholder={placeholder}
              maxLength={maxLength}
              disabled={disabled}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              step={step}
              min={min}
              max={max}
              accept={accept}
              multiple={multiple}
              className={cn(
                'flex-1 bg-transparent shadow-none p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                // Hide number input arrows/spinners
                {
                  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none':
                    type === 'number'
                },
                inputClassName
              )}
              {...(props as any)}
            />
            {(suffix || (type === 'password' && showPasswordToggle)) && (
              <div
                className={cn(
                  'flex items-center ml-2',
                  size === 'small' && 'text-sm',
                  size === 'large' && 'text-base'
                )}
              >
                {suffix}
                {type === 'password' && showPasswordToggle && (
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          // Regular input without prefix/suffix
          <Input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            maxLength={maxLength}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            step={step}
            min={min}
            max={max}
            accept={accept}
            multiple={multiple}
            className={cn(
              error && 'border-red-500 focus-visible:ring-red-500',
              sizeClasses[size],
              // Hide number input arrows/spinners
              type === 'number' &&
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              inputClassName
            )}
            {...(props as any)}
            size={{ height: 50 }}
          />
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

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { SimpleSelectProps } from './types'

type Props = SimpleSelectProps & { forwardedRef?: React.Ref<HTMLDivElement> }

export default function SimpleSelect({
  value,
  placeholder = 'Select...',
  disabled = false,
  className,
  label,
  error,
  helperText,
  required = false,
  name,
  options = [],
  onChange,
  onBlur,
  forwardedRef
}: Props) {
  return (
    <div ref={forwardedRef} className='w-full space-y-2'>
      {label && (
        <Label
          className={cn(
            'block text-sm leading-none font-medium',
            required && "after:ml-1 after:text-red-500 after:content-['*']",
            error && 'text-red-500'
          )}
        >
          {label}
        </Label>
      )}

      <Select
        value={value !== undefined && value !== null && value !== '' ? String(value) : undefined}
        onValueChange={onChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          className={cn(
            'h-12 w-full lg:h-14',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          onBlur={onBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.length === 0 ? (
            <div className='text-muted-foreground p-4 text-center text-sm'>No options found</div>
          ) : (
            options.map((option, idx) => (
              <SelectItem key={idx} value={String(option.value)} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {error && <p className='text-xs font-medium text-red-500'>{error}</p>}
      {helperText && !error && <p className='text-xs text-gray-500'>{helperText}</p>}
    </div>
  )
}

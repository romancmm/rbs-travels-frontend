import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Option } from './types'

type TreeSelectProps = {
  options: Option[]
  value: string | string[] | undefined
  onChange?: (val: unknown) => void
  placeholder?: string
  loading: boolean
  onSearch?: (search: string) => void
  onOpen?: () => void
  multiple?: boolean
  disabled?: boolean
  className?: string
  label?: string
}

export default function TreeSelectComponent({
  options,
  value,
  onChange,
  placeholder,
  loading,
  onSearch,
  onOpen,
  multiple,
  disabled,
  className,
  label
}: TreeSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isMobile && isOpen && inputRef.current && onSearch) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen, onSearch, loading, isMobile])

  const renderTreeNode = (option: Option, level = 0) => {
    const hasChildren = option.children && option.children.length > 0
    const isExpanded = expandedNodes.has(option.value)
    const isSelected = multiple
      ? Array.isArray(value) && value.includes(option.value)
      : value === option.value

    return (
      <div key={option.value}>
        <div
          className={cn(
            'hover:bg-accent flex cursor-pointer items-center gap-2 px-2 py-1',
            isSelected && 'bg-accent',
            option.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
          )}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => {
            if (option.disabled) return
            if (hasChildren) {
              const newExpanded = new Set(expandedNodes)
              if (isExpanded) {
                newExpanded.delete(option.value)
              } else {
                newExpanded.add(option.value)
              }
              setExpandedNodes(newExpanded)
            }
            onChange?.(option.value)
          }}
        >
          {hasChildren && (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                const newExpanded = new Set(expandedNodes)
                if (isExpanded) {
                  newExpanded.delete(option.value)
                } else {
                  newExpanded.add(option.value)
                }
                setExpandedNodes(newExpanded)
              }}
            >
              {isExpanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </button>
          )}
          {multiple && (
            <input
              type='checkbox'
              checked={isSelected}
              onChange={() => {}}
              disabled={option.disabled}
              className='rounded'
            />
          )}
          <span className='text-sm'>{option.label || option.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>{option.children!.map((child) => renderTreeNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div>
      {label && (
        <label className='mb-2 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
          {label}
        </label>
      )}
      <Select
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (open && onOpen) {
            onOpen()
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger className={cn('w-full', className)} type='button'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className='p-0'>
          {onSearch && (
            <div className='border-b p-2'>
              <Input
                ref={inputRef}
                placeholder='Search...'
                value={searchValue}
                readOnly={isMobile}
                inputMode={isMobile ? 'none' : undefined}
                onFocus={(e) => {
                  if (isMobile) {
                    e.target.blur()
                  }
                }}
                onTouchStart={(e) => {
                  if (isMobile) {
                    e.preventDefault()
                  }
                }}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                  onSearch(e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                className='h-8'
              />
            </div>
          )}
          <div
            className='max-h-64 overflow-auto'
            onMouseMove={() => {
              if (!isMobile && onSearch && inputRef.current && document.activeElement !== inputRef.current) {
                inputRef.current.focus()
              }
            }}
          >
            {loading ? (
              <div className='p-4'>
                <Skeleton className='h-4 w-full' />
              </div>
            ) : options.length === 0 ? (
              <div className='text-muted-foreground p-4 text-center text-sm'>No options found</div>
            ) : (
              options.map((option, idx) => renderTreeNode(option, idx))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  )
}

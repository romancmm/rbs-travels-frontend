import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '@/components/ui/combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'
import useAsync from '@/hooks/useAsync.hook'
import { cn } from '@/lib/utils'
import { Loader2, X } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import {
  filterOptions,
  optionLabel,
  resolveInternalOptions,
  resolveOptions,
  toComboboxOptions,
  toDisplayLabel
} from './helpers'
import TreeSelectComponent from './tree-select'
import type { AdvancedSelectProps, Option } from './types'

const AdvancedSelect = forwardRef<HTMLDivElement, AdvancedSelectProps>(
  (
    {
      label,
      placeholder,
      url,
      multiple = false,
      maxTagCount,
      tree = false,
      value,
      onChange,
      options: mapOptions,
      defaultLabel,
      returnFullData,
      defaultValue,
      searchMode = 'server',
      searchParams,
      className,
      disabled,
      staticOptions,
      error,
      helperText,
      required = false
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [comboboxOpen, setComboboxOpen] = useState(false)
    const [hasInitialFetch, setHasInitialFetch] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
    const anchor = useComboboxAnchor()
    const isMobile = useIsMobile()

    const { data, loading, execute } = useAsync({
      path: url || '',
      method: 'GET',
      immediate: false
    })

    const debouncedSearch = useCallback(
      (search: string) => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
          if (!url) return

          const trimmedSearch = search.trim()

          // When search is cleared, fetch the base endpoint again
          // so full options are restored instead of keeping stale filtered results.
          if (trimmedSearch.length === 0) {
            execute({ path: url })
            return
          }

          const searchEndpoint = `${url}${url.includes('?') ? '&' : '?'}${searchParams || 'searchQuery'}=${trimmedSearch}`
          execute({ path: searchEndpoint })
        }, 600)
      },
      [url, searchParams, execute]
    )

    const triggerInitialFetch = () => {
      if (url && searchMode === 'server' && !staticOptions && !hasInitialFetch) {
        setHasInitialFetch(true)
        execute()
      }
    }

    useEffect(() => {
      if (url && searchMode === 'server' && !staticOptions) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasInitialFetch(false)
      }
    }, [url, searchMode, staticOptions])

    useEffect(() => {
      if (
        (isOpen || comboboxOpen) &&
        url &&
        searchMode === 'server' &&
        !staticOptions &&
        !hasInitialFetch
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasInitialFetch(true)
        execute()
      }
    }, [isOpen, comboboxOpen, url, searchMode, staticOptions, hasInitialFetch, execute])

    useEffect(() => {
      if (
        !isMobile &&
        isOpen &&
        inputRef.current &&
        (searchMode === 'server' || searchMode === 'client')
      ) {
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    }, [isOpen, loading, searchMode, isMobile])

    useEffect(() => {
      if (!isMobile && comboboxOpen && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    }, [comboboxOpen, isMobile])

    const internalOptions = resolveInternalOptions({
      data,
      searchMode,
      url,
      mapOptions,
      returnFullData
    })

    const options = resolveOptions({
      defaultValue,
      staticOptions,
      mapOptions,
      defaultLabel,
      value,
      internalOptions
    })

    const filteredOptions = filterOptions(options, searchMode, searchValue)

    const handleValueChange = (selectedValue: string) => {
      if (!onChange) return

      const selectedOption = options.find((opt: Option) => opt.value === selectedValue)

      if (multiple) {
        const currentValues = Array.isArray(value) ? value : []
        const stringCurrentValues = currentValues.map((v) => String(v))
        const stringSelectedValue = String(selectedValue)

        const newValues = stringCurrentValues.includes(stringSelectedValue)
          ? currentValues.filter((v) => String(v) !== stringSelectedValue)
          : [...currentValues, selectedValue]

        const selectedOptions = options.filter((opt: Option) => newValues.includes(opt.value))
        onChange(returnFullData ? selectedOptions : newValues)
      } else {
        onChange(returnFullData ? selectedOption : selectedValue)
      }

      if (!multiple) {
        setIsOpen(false)
      }
    }

    if (tree) {
      return (
        <TreeSelectComponent
          options={filteredOptions}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          loading={loading}
          onSearch={searchMode === 'server' ? debouncedSearch : setSearchValue}
          onOpen={url ? triggerInitialFetch : undefined}
          multiple={multiple}
          disabled={disabled}
          className={cn(className, '[&_button]:lg:h-14!')}
          label={label}
        />
      )
    }

    if (multiple || searchParams || url || Array.isArray(mapOptions)) {
      const isMultipleMode = multiple === true
      const selectedValues = isMultipleMode ? (Array.isArray(value) ? value : []) : []
      const selectedValue = !isMultipleMode ? (Array.isArray(value) ? value[0] : value) || '' : ''
      const hasOpenToAll = isMultipleMode && selectedValues.includes('open_to_all')
      const comboboxOptions = toComboboxOptions(filteredOptions, hasOpenToAll)

      const handleComboboxChange = (newValue: string | string[] | null) => {
        if (!onChange) return

        setSearchValue('')

        if (isMultipleMode) {
          const newValues = Array.isArray(newValue) ? newValue : newValue ? [newValue] : []
          const selectedOptions = options.filter((opt: Option) => newValues.includes(opt.value))
          onChange(returnFullData ? selectedOptions : newValues)
        } else {
          const finalValue = Array.isArray(newValue) ? newValue[0] : newValue
          const selectedOption = options.find((opt: Option) => opt.value === finalValue)
          onChange(returnFullData ? selectedOption : finalValue)
        }
      }

      const useServerSearch =
        (searchMode === 'server' && url && searchParams) || (searchParams && url)

      return (
        <div
          ref={ref}
          className={cn(
            'relative space-y-2 [&_label]:max-sm:font-normal [&_label]:max-sm:text-sm max-sm:text-sm',
            label && 'space-y-2'
          )}
        >
          {label && (
            <label
              className={cn(
                'block peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed',
                required && "after:ml-1 after:text-red-500 after:content-['*']",
                error && 'text-red-500',
                disabled && 'text-gray-400'
              )}
            >
              {label}
            </label>
          )}

          <Combobox
            items={comboboxOptions}
            value={isMultipleMode ? selectedValues : selectedValue}
            onValueChange={handleComboboxChange}
            multiple={isMultipleMode}
            disabled={disabled}
            open={comboboxOpen}
            onOpenChange={(open) => {
              setComboboxOpen(open)
              if (open && url) {
                triggerInitialFetch()
              }
            }}
          >
            <ComboboxChips
              ref={anchor}
              className={cn(
                isMultipleMode && 'min-h-12 lg:min-h-fit mb-0',
                isMultipleMode &&
                  maxTagCount != null &&
                  !comboboxOpen &&
                  'h-9 min-h-9 flex-nowrap overflow-hidden',
                disabled && 'pointer-events-none opacity-60',
                error && 'border-red-500',
                className
              )}
            >
              {isMultipleMode &&
              maxTagCount != null &&
              !comboboxOpen &&
              selectedValues.length > 0 ? (
                <div
                  className='flex items-center gap-1.5 w-full h-full overflow-hidden cursor-text'
                  onClick={() => {
                    if (disabled) return
                    if (!isMobile) inputRef.current?.focus()
                    setComboboxOpen(true)
                  }}
                >
                  {selectedValues.slice(0, maxTagCount).map((val) => {
                    const item = comboboxOptions.find((opt) => opt.value === val)
                    return (
                      <span
                        key={val}
                        className='bg-muted px-1.5 py-0.5 rounded-sm max-w-24 text-xs truncate shrink-0'
                      >
                        {item?.label || toDisplayLabel(String(val))}
                      </span>
                    )
                  })}
                  {selectedValues.length > maxTagCount && (
                    <span className='bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground text-xs shrink-0'>
                      +{selectedValues.length - maxTagCount}
                    </span>
                  )}
                </div>
              ) : isMultipleMode && maxTagCount != null ? (
                // Open (or nothing selected yet): a clean search input with no
                // chip clutter - selection state is shown via checkmarks in
                // the dropdown list instead.
                <ComboboxChipsInput
                  ref={inputRef}
                  placeholder={selectedValues.length === 0 ? placeholder : 'Search...'}
                  disabled={disabled}
                  readOnly={isMobile}
                  inputMode={isMobile ? 'none' : undefined}
                  value={searchValue}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    if (isMobile) {
                      e.target.blur()
                    }
                  }}
                  onTouchStart={(e: React.TouchEvent<HTMLInputElement>) => {
                    if (isMobile) {
                      e.preventDefault()
                    }
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = e.target.value
                    setSearchValue(newValue)
                    if (useServerSearch) debouncedSearch(newValue)
                  }}
                />
              ) : isMultipleMode ? (
                <>
                  <ComboboxValue>
                    {selectedValues?.map((val, idx) => {
                      const item = comboboxOptions.find((opt) => opt.value === val)
                      return (
                        <ComboboxChip key={idx} showRemove={true}>
                          {item?.label || toDisplayLabel(String(val))}
                        </ComboboxChip>
                      )
                    })}
                  </ComboboxValue>
                  <ComboboxChipsInput
                    ref={inputRef}
                    placeholder={selectedValues.length === 0 ? placeholder : 'Search...'}
                    disabled={disabled}
                    readOnly={isMobile}
                    inputMode={isMobile ? 'none' : undefined}
                    value={searchValue}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                      if (isMobile) {
                        e.target.blur()
                      }
                    }}
                    onTouchStart={(e: React.TouchEvent<HTMLInputElement>) => {
                      if (isMobile) {
                        e.preventDefault()
                      }
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newValue = e.target.value
                      setSearchValue(newValue)
                      if (useServerSearch) debouncedSearch(newValue)
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Backspace' && !searchValue) {
                        e.preventDefault()
                        if (selectedValues.length > 0) {
                          const newValues = selectedValues.slice(0, -1)
                          const selectedOptions = options.filter((opt: Option) =>
                            newValues.includes(opt.value)
                          )
                          onChange?.(returnFullData ? selectedOptions : newValues)
                        }
                      }
                    }}
                  />
                </>
              ) : !comboboxOpen && selectedValue ? (
                <div
                  className='flex justify-between items-center gap-2 w-full h-full cursor-text'
                  onClick={() => {
                    if (disabled) return
                    if (!isMobile) inputRef.current?.focus()
                    setComboboxOpen(true)
                  }}
                >
                  <span className='truncate'>
                    {comboboxOptions.find((opt) => opt.value === selectedValue)?.label ||
                      toDisplayLabel(selectedValue)}
                  </span>
                  <button
                    type='button'
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (disabled) return
                      handleComboboxChange('')
                    }}
                    className='hover:bg-muted rounded-sm transition-colors shrink-0'
                    aria-label='Clear selection'
                  >
                    <X className='w-3.5 h-3.5' />
                  </button>
                </div>
              ) : (
                <ComboboxChipsInput
                  ref={inputRef}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={isMobile}
                  inputMode={isMobile ? 'none' : undefined}
                  value={searchValue}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    if (isMobile) {
                      e.target.blur()
                    }
                  }}
                  onTouchStart={(e: React.TouchEvent<HTMLInputElement>) => {
                    if (isMobile) {
                      e.preventDefault()
                    }
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = e.target.value
                    setSearchValue(newValue)
                    if (useServerSearch) debouncedSearch(newValue)
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Backspace' && !searchValue && selectedValue) {
                      e.preventDefault()
                      handleComboboxChange(null)
                    }
                  }}
                />
              )}
            </ComboboxChips>

            <ComboboxContent anchor={anchor}>
              <>
                {loading && filteredOptions.length === 0 ? (
                  <ComboboxEmpty className='flex-col space-y-2 px-2 text-center'>
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <Skeleton key={idx} className='mb-2 w-full h-7' />
                    ))}
                  </ComboboxEmpty>
                ) : (
                  <>
                    <ComboboxEmpty className='p-10 text-center'>No options found</ComboboxEmpty>
                    <ComboboxList>
                      {(item: Option) => (
                        <ComboboxItem key={item.value} value={item.value}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </>
                )}

                {loading && filteredOptions.length > 0 && (
                  <div className='flex items-center gap-2 px-3 py-2 border-t text-muted-foreground text-xs'>
                    <Loader2 className='mr-2 w-4 h-4 animate-spin' /> Searching...
                  </div>
                )}
              </>
            </ComboboxContent>
          </Combobox>

          {error && (
            <p className='max-w-full overflow-hidden font-medium text-red-500 text-xs text-wrap whitespace-pre-wrap'>
              {error}
            </p>
          )}
          {helperText && !error && <p className='block pt-1 text-gray-500 text-xs'>{helperText}</p>}
        </div>
      )
    }

    const displayValue = Array.isArray(value) ? value[0] : value
    const selectedOption = options.find((opt: Option) => opt.value === displayValue)

    return (
      <div ref={ref} className={cn('space-y-2', label && 'space-y-2')}>
        {label && (
          <label
            className={cn(
              'block peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed',
              required && "after:ml-1 after:text-red-500 after:content-['*']",
              error && 'text-red-500'
            )}
          >
            {label}
          </label>
        )}
        <Select
          value={displayValue}
          onValueChange={handleValueChange}
          disabled={disabled}
          open={isOpen}
          onOpenChange={(open: boolean) => {
            setIsOpen(open)
            if (open) {
              triggerInitialFetch()
            }
          }}
        >
          <SelectTrigger
            className={cn(
              'w-full h-12! lg:h-14',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            type='button'
          >
            <SelectValue placeholder={placeholder}>
              {selectedOption ? optionLabel(selectedOption) : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <div className='p-4'>
                <Skeleton className='w-full h-4' />
              </div>
            ) : options.length === 0 ? (
              <div className='p-4 text-muted-foreground text-sm text-center'>No options found</div>
            ) : (
              options.map((option: Option, idx: number) => (
                <SelectItem key={idx} value={option.value} disabled={option.disabled}>
                  {optionLabel(option)}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {error && (
          <p className='max-w-full overflow-hidden font-medium text-red-500 text-xs text-wrap whitespace-pre-wrap'>
            {error}
          </p>
        )}
        {helperText && !error && <p className='text-gray-500 text-xs'>{helperText}</p>}
      </div>
    )
  }
)

AdvancedSelect.displayName = 'AdvancedSelect'

export default AdvancedSelect

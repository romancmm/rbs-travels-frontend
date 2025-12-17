'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export type ComboboxOption = {
    value: string
    label: string
    disabled?: boolean
}

export interface ComboboxProps {
    options: ComboboxOption[]
    value?: string
    placeholder?: string
    emptyText?: string
    searchPlaceholder?: string
    onSelect?: (value: string) => void
    onSearch?: (search: string) => void
    disabled?: boolean
    className?: string
    loading?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function Combobox({
    options,
    value,
    placeholder = 'Select option...',
    emptyText = 'No option found.',
    searchPlaceholder = 'Search...',
    onSelect,
    onSearch,
    disabled,
    className,
    loading = false,
    open,
    onOpenChange
}: ComboboxProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState('')

    const isOpen = open !== undefined ? open : internalOpen
    const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen

    const selectedOption = options.find((option) => option.value === value)

    const handleSelect = (currentValue: string) => {
        onSelect?.(currentValue === value ? '' : currentValue)
        setIsOpen(false)
    }

    const handleSearch = (search: string) => {
        setSearchValue(search)
        onSearch?.(search)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={isOpen}
                    className={cn('justify-between w-full', className)}
                    disabled={disabled}
                    type='button'
                >
                    <span className='truncate'>{selectedOption ? selectedOption.label : placeholder}</span>
                    <ChevronsUpDown className='opacity-50 ml-2 w-4 h-4 shrink-0' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0 w-full' align='start'>
                <Command shouldFilter={!onSearch}>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onValueChange={handleSearch}
                    />
                    <CommandList>
                        {loading ? (
                            <div className='p-4'>
                                <Skeleton className='w-full h-4' />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>{emptyText}</CommandEmpty>
                                <CommandGroup>
                                    {options.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={handleSelect}
                                            disabled={option.disabled}
                                        >
                                            {option.label}
                                            <Check
                                                className={cn(
                                                    'ml-auto w-4 h-4',
                                                    value === option.value ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

import type { ComboboxOption, Option } from './types';

export function optionLabel(option: Option): string {
    return option.label || option.title || option.value
}

export function resolveInternalOptions({
    data,
    searchMode,
    url,
    mapOptions,
    returnFullData
}: {
    data: any
    searchMode: 'server' | 'client'
    url?: string
    mapOptions?: ((data: unknown) => Option[]) | Option[]
    returnFullData?: boolean
}): Option[] {
    if (!(data && searchMode === 'server' && url)) {
        return []
    }

    const rawOptions = mapOptions
        ? Array.isArray(mapOptions)
            ? mapOptions
            : mapOptions(data)
        : data?.data?.map?.((item: Record<string, unknown>) =>
            returnFullData
                ? {
                    ...item,
                    label: item.name as string,
                    title: item.name as string,
                    value: item.id as string
                }
                : {
                    label: item.name as string,
                    title: item.name as string,
                    value: item.id as string
                }
        )

    return rawOptions || []
}

export function resolveOptions({
    defaultValue,
    staticOptions,
    mapOptions,
    defaultLabel,
    value,
    internalOptions
}: {
    defaultValue?: Option[]
    staticOptions?: Option[]
    mapOptions?: ((data: unknown) => Option[]) | Option[]
    defaultLabel?: string
    value?: string | string[]
    internalOptions: Option[]
}): Option[] {
    if (defaultValue?.length) return defaultValue
    if (staticOptions) return staticOptions
    if (Array.isArray(mapOptions)) return mapOptions

    if (defaultLabel && value && !internalOptions.some((opt: Option) => opt.value === value)) {
        return [{ label: defaultLabel, title: defaultLabel, value: value as string }, ...internalOptions]
    }

    return internalOptions
}

export function filterOptions(options: Option[], searchMode: 'server' | 'client', searchValue: string) {
    if (!(searchMode === 'client' && searchValue)) {
        return options
    }

    const normalizedSearch = searchValue.toLowerCase()
    return options.filter(
        (opt: Option) =>
            opt.title?.toLowerCase().includes(normalizedSearch) ||
            opt.label?.toLowerCase().includes(normalizedSearch)
    )
}

/**
 * Converts a raw key like `visually_impaired` or `visually-impaired`
 * to a human-readable label like `Visually Impaired`.
 * Used as a display fallback when options haven't loaded yet.
 */
export function toDisplayLabel(value: string): string {
    return String(value ?? '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function toComboboxOptions(options: Option[], hasOpenToAll: boolean): ComboboxOption[] {
    return options.map((opt) => ({
        value: opt.value,
        label: optionLabel(opt),
        disabled: opt.disabled || (hasOpenToAll && opt.value !== 'open_to_all')
    }))
}

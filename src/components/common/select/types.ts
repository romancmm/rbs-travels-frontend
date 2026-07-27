export type ComboboxOption = {
  value: string
  label: string
  disabled?: boolean
}

export type Option = {
  title?: string
  value: string
  label?: string
  disabled?: boolean
  children?: Option[]
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export type AdvancedSelectProps = {
  name?: string
  label?: string
  placeholder?: string
  url?: string
  multiple?: boolean
  /** When set, caps visible selected chips at this count and collapses the
   *  rest into a "+N" indicator (antd-style) instead of wrapping to multiple
   *  lines. Only applies while the combobox is closed. */
  maxTagCount?: number
  tree?: boolean
  value?: string | string[]
  onChange?: (val: unknown) => void
  options?: (data: unknown) => Option[] | Option[]
  defaultLabel?: string
  defaultValue?: Option[]
  returnFullData?: boolean
  searchMode?: 'server' | 'client'
  searchParams?: string
  className?: string
  disabled?: boolean
  staticOptions?: Option[]
  error?: string
  helperText?: string
  required?: boolean
}

export interface SimpleSelectProps {
  value?: string | number
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  name?: string
  options?: SelectOption[]
  onChange?: (value: string) => void
  onBlur?: () => void
}

export type CustomSelectProps = AdvancedSelectProps | SimpleSelectProps

export function isSimpleSelect(props: CustomSelectProps): props is SimpleSelectProps {
  if (
    'multiple' in props ||
    'tree' in props ||
    'staticOptions' in props ||
    'url' in props ||
    'service' in props ||
    'showSearch' in props ||
    'searchMode' in props ||
    'searchParams' in props ||
    'returnFullData' in props
  ) {
    return false
  }

  if ('error' in props || 'helperText' in props || 'required' in props || 'onBlur' in props) {
    return true
  }

  if (
    'options' in props &&
    props.options &&
    Array.isArray(props.options) &&
    props.options.length > 0
  ) {
    const firstOption = props.options[0]
    return (
      typeof firstOption === 'object' &&
      'label' in firstOption &&
      typeof firstOption.label === 'string' &&
      !('title' in firstOption)
    )
  }

  return false
}

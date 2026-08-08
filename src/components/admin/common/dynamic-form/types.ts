import type { Control, FieldValues, Path, UseFormReturn } from 'react-hook-form'

export type ColSpan = 1 | 2 | 'full'

type BaseField<T extends FieldValues> = {
  name: Path<T>
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  colSpan?: ColSpan
}

export type TextLikeType = 'text' | 'textarea' | 'number' | 'email' | 'password' | 'tel' | 'url'

export type TextFieldConfig<T extends FieldValues = FieldValues> = BaseField<T> & {
  type: TextLikeType
  rows?: number
  maxLength?: number
  showCharCount?: boolean
}

export type SwitchFieldConfig<T extends FieldValues = FieldValues> = BaseField<T> & {
  type: 'switch'
  // When set, this switch is disabled (and read-only) whenever the named field's value is empty.
  disabledWhenEmpty?: Path<T>
}

export type CheckboxFieldConfig<T extends FieldValues = FieldValues> = BaseField<T> & {
  type: 'checkbox'
}

export type SelectOption = { value: string; label: string }

export type SelectFieldConfig<T extends FieldValues = FieldValues> = BaseField<T> & {
  type: 'select'
  options: SelectOption[]
  multiple?: boolean
}

export type RadioFieldConfig<T extends FieldValues = FieldValues> = BaseField<T> & {
  type: 'radio'
  options: SelectOption[]
  orientation?: 'horizontal' | 'vertical'
}

export type ImageFieldConfig<T extends FieldValues = FieldValues> = BaseField<T> & {
  type: 'image'
  multiple?: boolean
  maxAllow?: number
  size?: 'small' | 'medium' | 'large' | 'extra-large'
  allowedTypes?: string[]
}

export type ColorFieldConfig<T extends FieldValues = FieldValues> = BaseField<T> & {
  type: 'color'
  fallbackValue?: string
  presets?: string[]
}

export type DateFieldConfig<T extends FieldValues = FieldValues> = BaseField<T> & {
  type: 'date' | 'datetime'
}

export type HiddenFieldConfig<T extends FieldValues = FieldValues> = {
  type: 'hidden'
  name: Path<T>
}

export type GroupFieldConfig<T extends FieldValues = FieldValues> = {
  type: 'group'
  title?: string
  description?: string
  colSpan?: ColSpan
  columns?: 1 | 2 | 3 | 4
  className?: string
  fields: FieldConfig<T>[]
}

// Nested arrays and their item fields resist full generic type-safety (the
// item shape isn't `T`, and RHF's array path typing doesn't compose well
// across a dynamic config tree) - itemFields intentionally trade some type
// safety for a config shape that stays simple to write and read.
export type ArrayFieldConfig<T extends FieldValues = FieldValues> = {
  type: 'array'
  name: Path<T>
  label?: string
  description?: string
  className?: string
  itemFields: FieldConfig<any>[]
  defaultItem: Record<string, any>
  minItems?: number
  maxItems?: number
  itemLabel?: (index: number) => string
  addLabel?: string
  emptyLabel?: string
}

export type CustomFieldConfig<T extends FieldValues = FieldValues> = {
  type: 'custom'
  key?: string
  colSpan?: ColSpan
  className?: string
  render: (ctx: { control: Control<T>; form: UseFormReturn<T> }) => React.ReactNode
}

export type LeafFieldConfig<T extends FieldValues = FieldValues> =
  | TextFieldConfig<T>
  | SwitchFieldConfig<T>
  | CheckboxFieldConfig<T>
  | SelectFieldConfig<T>
  | RadioFieldConfig<T>
  | ImageFieldConfig<T>
  | ColorFieldConfig<T>
  | DateFieldConfig<T>

export type FieldConfig<T extends FieldValues = FieldValues> =
  | LeafFieldConfig<T>
  | HiddenFieldConfig<T>
  | GroupFieldConfig<T>
  | ArrayFieldConfig<T>
  | CustomFieldConfig<T>

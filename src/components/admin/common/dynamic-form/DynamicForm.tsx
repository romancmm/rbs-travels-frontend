'use client'

import { AddItemButton } from '@/components/admin/common/AddItemButton'
import { DatePicker } from '@/components/admin/common/DatePicker'
import { ColorPickerField } from '@/components/common/ColorPickerField'
import CustomInput from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import FilePicker from '@/components/common/FilePicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldValues,
  type UseFormReturn
} from 'react-hook-form'
import type {
  ArrayFieldConfig,
  FieldConfig,
  GroupFieldConfig,
  LeafFieldConfig,
  SwitchFieldConfig
} from './types'

const COL_SPAN_CLASS: Record<'1' | '2' | 'full', string> = {
  '1': '',
  '2': 'lg:col-span-2',
  full: 'col-span-full'
}

const colSpanClass = (span?: 1 | 2 | 'full') =>
  COL_SPAN_CLASS[String(span ?? 1) as '1' | '2' | 'full']

const GROUP_COLUMNS_CLASS: Record<1 | 2 | 3 | 4, string> = {
  1: '',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'sm:grid-cols-2 xl:grid-cols-4'
}

// Pulls a nested react-hook-form error message by dot-path (e.g. 'about.facilities.0.title'),
// since FieldConfig.name is a plain string path rather than a typed accessor.
function getErrorMessage(errors: unknown, path: string): string | undefined {
  const value = path.split('.').reduce<any>((acc, key) => (acc == null ? acc : acc[key]), errors)
  return typeof value?.message === 'string' ? value.message : undefined
}

// Loosened from RHF's ControllerRenderProps<T, Path<T>>: renderLeafField dispatches
// across many unrelated field shapes, so it isn't worth threading the generic through.
type LeafRenderProps = {
  name: string
  value: any
  onChange: (...event: any[]) => void
  onBlur: () => void
}

function getFieldKey(field: FieldConfig<any>, index: number): string | number {
  if ('name' in field && field.name) return field.name
  if ('key' in field && field.key) return field.key
  return index
}

type DynamicFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  fields: FieldConfig<T>[]
  className?: string
}

export function DynamicForm<T extends FieldValues>({
  form,
  fields,
  className
}: DynamicFormProps<T>) {
  return (
    <div className={cn('gap-4 grid grid-cols-1 lg:grid-cols-2 bg-white p-4 rounded-lg', className)}>
      {fields.map((field, index) => (
        <DynamicField key={getFieldKey(field, index)} form={form} field={field} />
      ))}
    </div>
  )
}

function DynamicField<T extends FieldValues>({
  form,
  field
}: {
  form: UseFormReturn<T>
  field: FieldConfig<T>
}) {
  const { control, formState } = form

  if (field.type === 'custom') {
    return (
      <div className={cn(colSpanClass(field.colSpan), field.className)}>
        {field.render({ control, form })}
      </div>
    )
  }

  if (field.type === 'hidden') {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhfField }) => (
          <input type='hidden' {...rhfField} value={rhfField.value ?? ''} />
        )}
      />
    )
  }

  if (field.type === 'group') {
    return <GroupDynamicField form={form} field={field} />
  }

  if (field.type === 'array') {
    return <ArrayDynamicField form={form} field={field} />
  }

  if (field.type === 'switch' && field.disabledWhenEmpty) {
    return (
      <div className={cn(colSpanClass(field.colSpan), field.className)}>
        <Controller
          control={control}
          name={field.name}
          render={({ field: rhfField }) => (
            <SwitchLeafField control={control} field={field} rhfField={rhfField} />
          )}
        />
      </div>
    )
  }

  return (
    <div className={cn(colSpanClass(field.colSpan), field.className)}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhfField }) =>
          renderLeafField(field, rhfField, getErrorMessage(formState.errors, field.name))
        }
      />
    </div>
  )
}

// Watches a dependency field so the switch can be disabled/read-only whenever
// that field (e.g. a sibling URL input) is empty.
function SwitchLeafField<T extends FieldValues>({
  control,
  field,
  rhfField
}: {
  control: Control<T>
  field: SwitchFieldConfig<T>
  rhfField: LeafRenderProps
}) {
  const dependencyValue = useWatch({ control, name: field.disabledWhenEmpty! })
  const isDependencyEmpty = !dependencyValue || String(dependencyValue).trim() === ''
  const disabled = field.disabled || isDependencyEmpty

  return (
    <CustomInput
      type='switch'
      label={field.label}
      disabled={disabled}
      name={rhfField.name}
      checked={!!rhfField.value}
      onCheckedChange={rhfField.onChange}
    />
  )
}

function GroupDynamicField<T extends FieldValues>({
  form,
  field
}: {
  form: UseFormReturn<T>
  field: GroupFieldConfig<T>
}) {
  return (
    <div className={cn('space-y-4', colSpanClass(field.colSpan ?? 'full'), field.className)}>
      {(field.title || field.description) && (
        <div>
          {field.title && <h4 className='font-semibold text-sm'>{field.title}</h4>}
          {field.description && (
            <p className='text-muted-foreground text-xs'>{field.description}</p>
          )}
        </div>
      )}
      <div className={cn('gap-4 grid grid-cols-1', GROUP_COLUMNS_CLASS[field.columns ?? 2])}>
        {field.fields.map((childField, index) => (
          <DynamicField key={getFieldKey(childField, index)} form={form} field={childField} />
        ))}
      </div>
    </div>
  )
}

function ArrayDynamicField<T extends FieldValues>({
  form,
  field
}: {
  form: UseFormReturn<T>
  field: ArrayFieldConfig<T>
}) {
  const { control } = form
  const { fields: items, append, remove } = useFieldArray({ control, name: field.name as any })

  const canAdd = field.maxItems === undefined || items.length < field.maxItems
  const canRemove = items.length > (field.minItems ?? 0)

  return (
    <div className={cn('space-y-3 col-span-full', field.className)}>
      {field.label && <label className='font-semibold text-lg'>{field.label}</label>}
      {field.description && <p className='text-muted-foreground text-sm'>{field.description}</p>}

      {items.length === 0 ? (
        <div className='p-4 border-2 border-dashed rounded-lg text-muted-foreground text-sm text-center'>
          {field.emptyLabel ?? 'No items added yet.'}
        </div>
      ) : (
        <div className='space-y-4'>
          {items.map((item, index) => (
            <div key={item.id} className='space-y-3 p-4 border rounded-lg'>
              <div className='flex justify-between items-center'>
                <h4 className='font-medium text-sm'>
                  {field.itemLabel?.(index) ?? `Item ${index + 1}`}
                </h4>
                {canRemove && (
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={() => remove(index)}
                    className='hover:bg-red-50 hover:text-red-700'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                )}
              </div>
              <div className='gap-3 grid grid-cols-1 lg:grid-cols-2'>
                {field.itemFields.map((itemField, fi) => (
                  <DynamicField
                    key={fi}
                    form={form}
                    field={
                      {
                        ...itemField,
                        name:
                          'name' in itemField
                            ? `${field.name}.${index}.${itemField.name}`
                            : undefined
                      } as FieldConfig<T>
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {canAdd && (
        <AddItemButton
          label={field.addLabel ?? 'Add Item'}
          onClick={() => append(field.defaultItem as any)}
        />
      )}
    </div>
  )
}

function renderLeafField(field: LeafFieldConfig, rhfField: LeafRenderProps, error?: string) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
    case 'number':
    case 'textarea':
      return (
        <CustomInput
          type={field.type}
          label={field.label}
          placeholder={field.placeholder}
          rows={field.rows}
          maxLength={field.maxLength}
          showCharCount={field.showCharCount}
          disabled={field.disabled}
          required={field.required}
          error={error}
          helperText={field.description}
          name={rhfField.name}
          onBlur={rhfField.onBlur}
          onChange={rhfField.onChange}
          value={rhfField.value ?? ''}
        />
      )

    case 'switch':
      return (
        <CustomInput
          type='switch'
          label={field.label}
          disabled={field.disabled}
          name={rhfField.name}
          checked={!!rhfField.value}
          onCheckedChange={rhfField.onChange}
        />
      )

    case 'checkbox':
      return (
        <div className='flex items-center gap-2'>
          <Checkbox
            id={rhfField.name}
            checked={!!rhfField.value}
            onCheckedChange={rhfField.onChange}
            disabled={field.disabled}
          />
          {field.label && <Label htmlFor={rhfField.name}>{field.label}</Label>}
          {error && <span className='text-red-500 text-xs'>{error}</span>}
        </div>
      )

    case 'select':
      return (
        <div className='space-y-2'>
          {field.label && <Label>{field.label}</Label>}
          <CustomSelect
            placeholder={field.placeholder}
            options={() => field.options}
            value={rhfField.value}
            onChange={rhfField.onChange}
            multiple={field.multiple}
            disabled={field.disabled}
          />
          {error && <span className='text-red-500 text-xs'>{error}</span>}
        </div>
      )

    case 'radio':
      return (
        <div className='space-y-2'>
          {field.label && <Label>{field.label}</Label>}
          <RadioGroup
            value={rhfField.value}
            onValueChange={rhfField.onChange}
            className={field.orientation === 'horizontal' ? 'flex gap-4' : undefined}
          >
            {field.options.map((option) => (
              <div key={option.value} className='flex items-center gap-2'>
                <RadioGroupItem value={option.value} id={`${rhfField.name}-${option.value}`} />
                <Label htmlFor={`${rhfField.name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {error && <span className='text-red-500 text-xs'>{error}</span>}
        </div>
      )

    case 'image':
      return (
        <div className='space-y-2'>
          {field.label && <Label>{field.label}</Label>}
          <FilePicker
            value={rhfField.value || ''}
            onChangeAction={rhfField.onChange}
            multiple={field.multiple}
            maxAllow={field.maxAllow}
            size={field.size}
            allowedTypes={field.allowedTypes}
          />
          {error && <span className='text-red-500 text-xs'>{error}</span>}
        </div>
      )

    case 'color':
      return (
        <ColorPickerField
          label={field.label}
          hint={field.description}
          value={rhfField.value}
          fallbackValue={field.fallbackValue}
          presets={field.presets}
          onChange={rhfField.onChange}
          onBlur={rhfField.onBlur}
        />
      )

    case 'date':
    case 'datetime':
      return (
        <DatePicker
          label={field.label}
          placeholder={field.placeholder}
          showTime={field.type === 'datetime'}
          disabled={field.disabled}
          error={error}
          name={rhfField.name}
          value={rhfField.value}
          onChange={rhfField.onChange}
          onBlur={rhfField.onBlur}
        />
      )
  }
}

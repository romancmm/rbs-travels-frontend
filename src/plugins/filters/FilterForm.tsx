'use client'

import CustomInput from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import { AddButton } from '@/components/common/PermissionGate'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-mobile'
import { debounce } from '@/lib/debounce'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, Filter, RotateCcw, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface FilterField {
  type: 'input' | 'select-api' | 'date'
  name: string
  label?: string
  placeholder?: string
  url?: string
  multiple?: boolean
  isMultiStore?: boolean
  options?: (data: any) => FilterOption[]
}

type FilterOption = { label: string; value: string }

type FilterFormProps = {
  fields: FilterField[]
  values: Record<string, any>
  onChange: (val: Record<string, any>) => void
  onReset?: () => void
  extra?: React.ReactNode
  addButton?: { title?: string; onClick?: () => void; href?: string; resource: string }
  defaultValues?: FilterOption[]
}

export function FilterForm({
  fields,
  values,
  onChange,
  onReset,
  extra,
  addButton,
  defaultValues
}: FilterFormProps) {
  const { control, reset, watch } = useForm({
    defaultValues: values
  })

  const [openDrawer, setOpenDrawer] = useState(false)
  const [openDatePopovers, setOpenDatePopovers] = useState<Record<string, boolean>>({})
  const isMobile = useIsMobile(1080)

  // Watch all form values for changes
  const watchedValues = watch()

  /** ✅ Handlers */
  const updateValue = useMemo(
    () =>
      debounce((key: string, val: any) => {
        onChange({ ...values, [key]: val })
      }, 300),
    [values, onChange]
  )

  const handleReset = useCallback(() => {
    reset()
    onReset?.()
  }, [reset, onReset])

  const toggleDatePopover = (fieldName: string, isOpen: boolean) => {
    setOpenDatePopovers((prev) => ({ ...prev, [fieldName]: isOpen }))
  }

  /** ✅ Sync form values with props */
  useEffect(() => {
    reset(values)
  }, [values, reset])

  /** ✅ Sync watched values with parent onChange */
  useEffect(() => {
    if (JSON.stringify(watchedValues) !== JSON.stringify(values)) {
      Object.keys(watchedValues).forEach((key) => {
        if (watchedValues[key] !== values[key]) {
          updateValue(key, watchedValues[key])
        }
      })
    }
  }, [watchedValues, values, updateValue])

  /** ✅ Render single field */
  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'input':
        return (
          <div key={field.name}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <div className='relative'>
                  <CustomInput
                    type='text'
                    placeholder={field.placeholder}
                    value={formField.value || ''}
                    onChange={(e) => formField.onChange(e.target.value)}
                    // className='pr-8'
                    suffix={<Search className='size-4 text-gray-400' />}
                  />
                </div>
              )}
            />
          </div>
        )

      case 'select-api':
        return (
          <div key={field.name}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <CustomSelect
                  placeholder={field.placeholder}
                  url={field.url}
                  multiple={field.multiple}
                  value={formField.value}
                  onChange={formField.onChange}
                  options={field.options}
                  defaultValue={defaultValues}
                  className='bg-white'
                />
              )}
            />
          </div>
        )

      case 'date':
        return (
          <div key={field.name}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <Popover
                  open={openDatePopovers[field.name]}
                  onOpenChange={(open) => toggleDatePopover(field.name, open)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'justify-start w-full h-10 font-normal text-left',
                        !formField.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 w-4 h-4' />
                      {formField.value ? (
                        format(new Date(formField.value), 'PPP')
                      ) : (
                        <span>{field.placeholder}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='p-0 w-auto' align='start'>
                    <Calendar
                      mode='single'
                      selected={formField.value ? new Date(formField.value) : undefined}
                      onSelect={(date) => {
                        formField.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                        toggleDatePopover(field.name, false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        )

      default:
        return null
    }
  }

  const isMultiStore = false

  /** ✅ Render fields */
  const fieldsUI = (
    <div className='flex flex-row gap-4 w-full'>
      <div className='flex flex-wrap flex-1 gap-4 w-full *:w-50'>
        {fields.filter((field) => isMultiStore !== field.isMultiStore).map(renderField)}
      </div>

      {onReset && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ type: 'spring', duration: 0.6, ease: 'easeInOut' }}
        >
          <Button
            type='button'
            variant='outline'
            size={isMobile ? 'sm' : 'default'}
            onClick={handleReset}
            title='Reset filters'
          >
            <RotateCcw className='w-4 h-4' />
            <span className='sr-only lg:not-sr-only'>Reset</span>
          </Button>
        </motion.div>
      )}
    </div>
  )

  /** ✅ Render Add Button */
  const addButtonUI = addButton && (
    <AddButton
      resource={addButton.resource}
      title={addButton.title}
      href={addButton.href}
      onClick={addButton.onClick}
      size={isMobile ? 'default' : 'lg'}
    />
  )

  /** ✅ Final Render */
  return isMobile ? (
    <Suspense>
      <div className='flex items-center gap-3 w-full'>
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerTrigger asChild>
            <Button variant='outline' size='lg'>
              <Filter className='w-4 h-4' />
              <span className='sr-only lg:not-sr-only'>Filter</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>Apply filters to refine your search results.</DrawerDescription>
            </DrawerHeader>
            <div className='px-4 pb-10'>
              <div className='space-y-4'>
                {fields
                  .filter((field) => isMultiStore !== field.isMultiStore)
                  .map((field) => (
                    <div key={field.name} className='w-full'>
                      {field.label && (
                        <label className='block mb-2 font-medium text-foreground text-sm'>
                          {field.label}
                        </label>
                      )}
                      {renderField(field)}
                    </div>
                  ))}
              </div>
              {extra && <div className='mt-4'>{extra}</div>}
            </div>
            <DrawerFooter>
              <div className='flex gap-3'>
                {onReset && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleReset}
                    className='flex-1 text-destructive hover:text-destructive'
                  >
                    <RotateCcw className='w-4 h-4' />
                    Reset
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button className='flex-1'>Done</Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        {addButtonUI}
      </div>
    </Suspense>
  ) : (
    <Suspense>
      <div className='flex items-center gap-4'>
        {fieldsUI}
        {addButtonUI}
        {extra && <div>{extra}</div>}
      </div>
    </Suspense>
  )
}

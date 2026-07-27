'use client'

import CustomSelect from '@/components/common/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { debounce } from '@/lib/debounce'
import { cn } from '@/lib/utils'
import { Filter, Plus, RotateCcw, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { Suspense, useCallback, useMemo, useState } from 'react'

const NON_FILTER_KEYS = new Set(['page', 'limit', 'sortBy', 'sortOrder'])

type FilterOption = { label: string; value: string }
type FilterFormProps = {
  fields: FilterField[]
  values: Record<string, unknown>
  onChange: (val: Record<string, unknown>) => void
  onReset?: () => void
  extra?: React.ReactNode
  addButton?: { title?: string; onClick?: () => void; href?: string }
  defaultValues?: FilterOption[]
}

function countActiveFilters(values: Record<string, unknown>) {
  return Object.entries(values).filter(([key, val]) => {
    if (NON_FILTER_KEYS.has(key)) return false
    if (val === undefined || val === null || val === '') return false
    if (Array.isArray(val)) return val.length > 0
    return true
  }).length
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
  const [openDrawer, setOpenDrawer] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, unknown>>(values)
  const isMobile = useIsMobile(1280)
  const activeFilterCount = countActiveFilters(values)

  /** ✅ Handlers */
  const updateValue = useMemo(
    () =>
      debounce((key: string, val: unknown) => {
        const newValues = { ...formValues, [key]: val }
        setFormValues(newValues)
        onChange(newValues)
      }, 100),
    [formValues, onChange]
  )

  const handleReset = useCallback(() => {
    setFormValues({})
    onReset?.()
  }, [onReset])

  /** ✅ Render single field - `stacked` is used inside the mobile drawer
   *  (full width, labelled); the default is the compact desktop toolbar. */
  const renderField = (field: FilterField, stacked = false) => {
    const wrapperClassName = stacked ? 'w-full' : 'w-44 sm:w-48'
    const label = stacked && (
      <label className='block mb-1.5 font-medium text-muted-foreground text-xs'>
        {field.label}
      </label>
    )

    switch (field.type) {
      case 'input':
        return (
          <div key={field.name} className={wrapperClassName}>
            {label}
            <div className='relative'>
              <Input
                placeholder={field.placeholder}
                value={(formValues[field.name] as string) || ''}
                onChange={(e) => updateValue(field.name, e.target.value)}
                className='pr-8'
              />
              <Search className='top-1/2 right-2.5 absolute opacity-40 w-4 h-4 -translate-y-1/2' />
            </div>
          </div>
        )

      case 'select-api':
        return (
          <div key={field.name} className={cn(wrapperClassName, !stacked && 'sm:min-w-56')}>
            {label}
            <CustomSelect
              className='w-full'
              placeholder={field.placeholder}
              value={formValues[field.name] as string | string[] | undefined}
              onChange={(val: unknown) => updateValue(field.name, val)}
              url={field.url}
              options={field.options}
              defaultValue={defaultValues}
              searchMode='server'
              searchParams='search'
              multiple={field.multiple}
              maxTagCount={stacked ? undefined : 1}
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className={wrapperClassName}>
            {label}
            <Select
              value={(formValues[field.name] as string) || undefined}
              onValueChange={(val) => updateValue(field.name, val)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'date':
        return (
          <div key={field.name} className={wrapperClassName}>
            {label}
            <Input
              type='date'
              placeholder={field.placeholder}
              value={(formValues[field.name] as string) || ''}
              onChange={(e) => updateValue(field.name, e.target.value)}
            />
          </div>
        )

      default:
        return null
    }
  }

  const resetButton = onReset && (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', duration: 0.6, ease: 'easeInOut' }}
    >
      <Button
        variant='outline'
        onClick={handleReset}
        size='sm'
        className='text-muted-foreground hover:text-foreground'
      >
        <RotateCcw className='w-3.5 h-3.5' />
        Reset
      </Button>
    </motion.div>
  )

  /** ✅ Compact toolbar (desktop, >=1280px) */
  const compactFieldsUI = (
    <div className='flex flex-wrap items-center gap-2.5 bg-muted/40 p-2.5 border rounded-xl'>
      {fields.map((field) => renderField(field))}
      {resetButton}
    </div>
  )

  /** ✅ Stacked fields (mobile drawer) */
  const stackedFieldsUI = (
    <div className='flex flex-col gap-4'>{fields.map((field) => renderField(field, true))}</div>
  )

  /** ✅ Add Button */
  const addButtonUI = addButton && (
    <Button
      size={isMobile ? 'default' : 'lg'}
      onClick={addButton.onClick}
      asChild={!!addButton.href}
    >
      {addButton.href ? (
        <a href={addButton.href}>
          <Plus className='mr-2 w-4 h-4' />
          <span className='sr-only lg:not-sr-only'>{addButton.title ?? 'Add New'}</span>
        </a>
      ) : (
        <>
          <Plus className='mr-2 w-4 h-4' />
          <span className='sr-only lg:not-sr-only'>{addButton.title ?? 'Add New'}</span>
        </>
      )}
    </Button>
  )

  /** ✅ Final Render */
  return isMobile ? (
    <Suspense>
      <div className='flex items-center gap-2 w-full'>
        <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
          <SheetTrigger asChild>
            <Button variant='outline' size='lg' className='relative'>
              <Filter className='mr-2 w-4 h-4' />
              <span className='sr-only lg:not-sr-only'>Filter</span>
              {activeFilterCount > 0 && (
                <Badge className='-top-2 -right-2 absolute flex justify-center items-center p-0 rounded-full size-5'>
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='flex flex-col w-full sm:max-w-sm'>
            <SheetHeader className='border-b'>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className='flex-1 px-4 overflow-y-auto'>
              {stackedFieldsUI}
              {extra && <div className='mt-4'>{extra}</div>}
            </div>
            <SheetFooter className='flex-row border-t'>
              {onReset && (
                <Button variant='outline' className='flex-1' onClick={handleReset}>
                  <RotateCcw className='w-3.5 h-3.5' />
                  Reset
                </Button>
              )}
              <Button className='flex-1' onClick={() => setOpenDrawer(false)}>
                Done
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        {addButtonUI}
      </div>
    </Suspense>
  ) : (
    <Suspense>
      <div className='flex flex-wrap items-center gap-3'>
        {compactFieldsUI}
        {addButtonUI}
      </div>
    </Suspense>
  )
}

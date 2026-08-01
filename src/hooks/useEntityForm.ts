'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type FieldValues, type UseFormProps, type UseFormReturn } from 'react-hook-form'
import type { ZodType } from 'zod'

type UseEntityFormOptions<TFieldValues extends FieldValues> = Omit<
  UseFormProps<TFieldValues>,
  'resolver' | 'values'
> & {
  schema: ZodType<TFieldValues, any, any>
  values: TFieldValues
}

/**
 * Shared react-hook-form setup for every admin form: wires the zod resolver and
 * keeps the form synced to `values` so edit forms populate correctly even when
 * the record they edit (e.g. from useAsync/SWR) only arrives after mount -
 * react-hook-form deep-compares `values` and resets the form whenever it changes,
 * instead of the one-time snapshot `defaultValues` would capture at mount.
 */
export function useEntityForm<TFieldValues extends FieldValues>({
  schema,
  values,
  ...formProps
}: UseEntityFormOptions<TFieldValues>): UseFormReturn<TFieldValues> {
  return useForm<TFieldValues>({
    ...formProps,
    resolver: zodResolver(schema as any),
    values
  })
}

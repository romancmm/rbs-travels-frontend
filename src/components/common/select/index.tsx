'use client'

import { forwardRef } from 'react'
import AdvancedSelect from './advanced-select'
import SimpleSelect from './simple-select'
import { isSimpleSelect, type CustomSelectProps } from './types'

const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>((props, ref) => {
  if (isSimpleSelect(props)) {
    return <SimpleSelect {...props} forwardedRef={ref} />
  }

  return <AdvancedSelect {...props} ref={ref} />
})

CustomSelect.displayName = 'CustomSelect'

export type {
  AdvancedSelectProps,
  ComboboxOption,
  CustomSelectProps,
  Option,
  SelectOption,
  SimpleSelectProps
} from './types'

export default CustomSelect

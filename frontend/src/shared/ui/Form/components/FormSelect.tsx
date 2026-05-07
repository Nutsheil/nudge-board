import { MenuItem } from '@mui/material'
import type { ReactNode } from 'react'
import type { FieldValues } from 'react-hook-form'

import { FormTextField } from './FormTextField'
import type { FormTextFieldProps } from './FormTextField'

export type FormSelectOption = {
  value: string | number
  label: ReactNode
}

export type FormSelectProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  FormTextFieldProps<TFieldValues>,
  'select' | 'children' | 'type'
> & {
  options: FormSelectOption[]
}

export const FormSelect = <TFieldValues extends FieldValues = FieldValues>(props: FormSelectProps<TFieldValues>) => {
  const { options, ...rest } = props

  return (
    <FormTextField<TFieldValues> {...rest} select>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </FormTextField>
  )
}

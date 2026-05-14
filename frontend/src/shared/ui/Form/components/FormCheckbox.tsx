import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material'
import type { CheckboxProps, FormControlLabelProps } from '@mui/material'
import type { ReactNode } from 'react'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'

import { useTranslateError } from '@/shared/lib'

type BaseProps = Omit<CheckboxProps, 'name' | 'checked' | 'onChange' | 'onBlur' | 'inputRef' | 'defaultChecked'>
export type FormCheckboxProps<TFieldValues extends FieldValues = FieldValues> = BaseProps & {
  name: FieldPath<TFieldValues>
  label: ReactNode
  labelPlacement?: FormControlLabelProps['labelPlacement']
  helperText?: ReactNode
}

export const FormCheckbox = <TFieldValues extends FieldValues = FieldValues>(
  props: FormCheckboxProps<TFieldValues>,
) => {
  const { name, label, labelPlacement, helperText, ...checkboxProps } = props
  const { control } = useFormContext<TFieldValues>()
  const translateError = useTranslateError()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorMessage = translateError(fieldState.error?.message)
        const helper = errorMessage ?? helperText

        return (
          <FormControl error={Boolean(fieldState.error)}>
            <FormControlLabel
              label={label}
              labelPlacement={labelPlacement}
              control={
                <Checkbox
                  {...checkboxProps}
                  checked={Boolean(field.value)}
                  onChange={(_, checked) => field.onChange(checked)}
                  onBlur={field.onBlur}
                  slotProps={{ input: { ref: field.ref } }}
                />
              }
            />
            {helper && <FormHelperText>{helper}</FormHelperText>}
          </FormControl>
        )
      }}
    />
  )
}

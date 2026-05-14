import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'

import { useTranslateError } from '@/shared/lib'

type BaseProps = Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'inputRef' | 'defaultValue'>
export type FormTextFieldProps<TFieldValues extends FieldValues = FieldValues> = BaseProps & {
  name: FieldPath<TFieldValues>
}

export const FormTextField = <TFieldValues extends FieldValues = FieldValues>(
  props: FormTextFieldProps<TFieldValues>,
) => {
  const { name, helperText, ...rest } = props
  const { control } = useFormContext<TFieldValues>()
  const translateError = useTranslateError()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...rest}
          {...field}
          value={field.value ?? ''}
          inputRef={field.ref}
          error={Boolean(fieldState.error)}
          helperText={translateError(fieldState.error?.message) ?? helperText}
        />
      )}
    />
  )
}

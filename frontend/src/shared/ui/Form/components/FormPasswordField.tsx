import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { IconButton, InputAdornment } from '@mui/material'
import { useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormTextField } from './FormTextField'
import type { FormTextFieldProps } from './FormTextField'

export type FormPasswordFieldProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  FormTextFieldProps<TFieldValues>,
  'type'
>

export const FormPasswordField = <TFieldValues extends FieldValues = FieldValues>(
  props: FormPasswordFieldProps<TFieldValues>,
) => {
  const { slotProps, ...rest } = props
  const [show, setShow] = useState(false)
  const { t } = useTranslation('common')

  return (
    <FormTextField<TFieldValues>
      {...rest}
      type={show ? 'text' : 'password'}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label={show ? t('common.password.hide') : t('common.password.show')}
                edge='end'
                size='small'
                onClick={() => setShow((prev) => !prev)}
              >
                {show ? <VisibilityOffIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

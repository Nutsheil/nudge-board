import type { FieldValues } from 'react-hook-form'

import { FormCheckbox } from './FormCheckbox'
import { FormPasswordField } from './FormPasswordField'
import { FormSelect } from './FormSelect'
import { FormTextField } from './FormTextField'

export const createFormFields = <T extends FieldValues>() => {
  return {
    FormTextField: FormTextField<T>,
    FormCheckbox: FormCheckbox<T>,
    FormPasswordField: FormPasswordField<T>,
    FormSelect: FormSelect<T>,
  }
}

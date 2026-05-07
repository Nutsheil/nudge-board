import type { ComponentProps, ReactNode } from 'react'
import { FormProvider, useForm, type FieldValues, type SubmitHandler, type UseFormProps } from 'react-hook-form'

type NativeFormProps = Omit<ComponentProps<'form'>, 'onSubmit' | 'children' | 'noValidate'>

type Props<TValues extends FieldValues> = {
  children: ReactNode
  onSubmit: SubmitHandler<TValues>
  formProps?: NativeFormProps
} & Omit<UseFormProps<TValues>, 'resolver'>

export const SimpleForm = <TValues extends FieldValues>(props: Props<TValues>) => {
  const { children, onSubmit, formProps, mode = 'onTouched', ...useFormProps } = props

  const methods = useForm<TValues>({
    ...useFormProps,
    mode,
  })

  return (
    <FormProvider {...methods}>
      <form {...formProps} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  )
}

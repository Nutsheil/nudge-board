import { zodResolver } from '@hookform/resolvers/zod'
import type { ComponentProps, ReactNode } from 'react'
import { FormProvider, useForm, type UseFormProps, type UseFormReturn } from 'react-hook-form'
import type { z, ZodObject } from 'zod'

type NativeFormProps = Omit<ComponentProps<'form'>, 'onSubmit' | 'children' | 'noValidate'>

type ZodFormSubmit<TSchema extends ZodObject, TContext> = (
  values: z.output<TSchema>,
  methods: UseFormReturn<z.input<TSchema>, TContext, z.output<TSchema>>,
) => void | Promise<void>

type Props<TSchema extends ZodObject, TContext = unknown> = {
  children: ReactNode
  onSubmit: ZodFormSubmit<TSchema, TContext>
  schema: TSchema
  formProps?: NativeFormProps
} & Omit<UseFormProps<z.input<TSchema>, TContext, z.output<TSchema>>, 'resolver'>

export const ZodForm = <TSchema extends ZodObject, TContext = unknown>(props: Props<TSchema, TContext>) => {
  const { children, onSubmit, schema, formProps, mode = 'onTouched', ...useFormProps } = props

  const methods = useForm<z.input<TSchema>, TContext, z.output<TSchema>>({
    ...useFormProps,
    mode,
    resolver: zodResolver(schema),
  })

  return (
    <FormProvider {...methods}>
      <form {...formProps} noValidate onSubmit={methods.handleSubmit((values) => onSubmit(values, methods))}>
        {children}
      </form>
    </FormProvider>
  )
}

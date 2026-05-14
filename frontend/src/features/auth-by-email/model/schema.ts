import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('validation.email.invalid'),
  password: z.string().min(1, 'validation.password.required'),
})

export type LoginValues = z.infer<typeof loginSchema>

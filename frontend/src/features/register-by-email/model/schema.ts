import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().min(1, 'validation.name.required'),
    email: z.email('validation.email.invalid'),
    password: z.string().min(8, 'validation.password.tooShort'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'validation.password.mismatch',
  })

export type RegisterValues = z.infer<typeof registerSchema>

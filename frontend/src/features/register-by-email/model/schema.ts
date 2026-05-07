import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Введите имя'),
    email: z.email('Некорректный email'),
    password: z.string().min(8, 'Минимум 8 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  })

export type RegisterValues = z.infer<typeof registerSchema>

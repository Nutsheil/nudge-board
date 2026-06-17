import { z } from 'zod'

export const boardSchema = z.object({
  name: z.string().trim().min(1, 'validation.boardName.required').max(64, 'validation.boardName.tooLong'),
  description: z
    .string()
    .trim()
    .max(500, 'validation.boardDescription.tooLong')
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
})

export type BoardFormValues = z.infer<typeof boardSchema>

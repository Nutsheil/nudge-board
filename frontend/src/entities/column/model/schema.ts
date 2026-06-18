import { z } from 'zod'

export const columnSchema = z.object({
  name: z.string().trim().min(1, 'validation.columnName.required').max(64, 'validation.columnName.tooLong'),
})

export type ColumnFormValues = z.infer<typeof columnSchema>

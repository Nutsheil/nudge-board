import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'validation.taskTitle.required').max(200, 'validation.taskTitle.tooLong'),
})

export type TaskFormValues = z.infer<typeof taskSchema>

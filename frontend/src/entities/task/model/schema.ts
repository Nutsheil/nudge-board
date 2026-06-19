import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'validation.taskTitle.required').max(200, 'validation.taskTitle.tooLong'),
})

export type TaskFormValues = z.infer<typeof taskSchema>

const intString = (key: string) => z.string().regex(/^\d*$/, key)

export const taskEditSchema = z.object({
  title: z.string().trim().min(1, 'validation.taskTitle.required').max(200, 'validation.taskTitle.tooLong'),
  description: z.string().max(2000, 'validation.taskDescription.tooLong'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string(),
  timeEstimate: intString('validation.taskTime.invalid'),
  timeSpent: intString('validation.taskTime.invalid'),
})

export type TaskEditValues = z.infer<typeof taskEditSchema>

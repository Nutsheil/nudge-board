import { z } from 'zod'

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, 'Введите название').max(64, 'Не более 64 символов'),
  description: z.string().trim().max(500, 'Не более 500 символов').optional(),
})

export type CreateWorkspaceValues = z.infer<typeof createWorkspaceSchema>

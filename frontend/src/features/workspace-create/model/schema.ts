import { z } from 'zod'

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, 'validation.workspaceName.required').max(64, 'validation.workspaceName.tooLong'),
  description: z
    .string()
    .trim()
    .max(500, 'validation.workspaceDescription.tooLong')
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
})

export type CreateWorkspaceValues = z.infer<typeof createWorkspaceSchema>

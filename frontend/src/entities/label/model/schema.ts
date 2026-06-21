import { z } from 'zod'

import { LABEL_COLORS } from './types'

export const labelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'validation.labelName.required')
    .max(30, 'validation.labelName.tooLong'),
  color: z.enum(LABEL_COLORS),
})

export type LabelFormValues = z.infer<typeof labelSchema>

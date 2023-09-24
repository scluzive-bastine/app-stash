import { z } from 'zod'

export const DiscussionValidator = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be longer than 3 characters' })
    .max(128, { message: 'Title must not be greater than 128 characters' }),
  content: z.any(),
})

export type DiscussionCreationRequest = z.infer<typeof DiscussionValidator>

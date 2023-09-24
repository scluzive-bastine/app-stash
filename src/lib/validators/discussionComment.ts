import { z } from 'zod'

export const DiscussionCommentValidator = z.object({
  discussionId: z.string(),
  text: z.string(),
  replyToId: z.string().optional(),
})

export type DiscussionCommentRequest = z.infer<typeof DiscussionCommentValidator>

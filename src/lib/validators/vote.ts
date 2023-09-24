import { z } from 'zod'

export const ProductVoteValidator = z.object({
  productId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
})

export type ProductVoteRequest = z.infer<typeof ProductVoteValidator>

export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
})

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>

export const DiscussionVoteValidator = z.object({
  discussionId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
})

export type DiscussionVoteRequest = z.infer<typeof DiscussionVoteValidator>

// export const DiscussionCommentVoteValidator = z.object({
//   commentId: z.string(),
//   voteType: z.enum(['UP', 'DOWN']),
// })

// export type DiscussionCommentVoteRequest = z.infer<typeof DiscussionCommentVoteValidator>

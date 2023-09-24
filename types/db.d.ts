import { Discussion, DiscussionComment, DiscussionVote, Product, User } from '@prisma/client'

export type ExtendedProduct = Product & {}
export type ExtendedDiscussion = Discussion & {
  author: User
  comments: DiscussionComment[]
  votes: DiscussionVote[]
}

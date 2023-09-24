import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { commentId, voteType } = CommentVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session) {
      return new Response('Unauthorised', { status: 401 })
    }

    const exisitingVote = await db.discussionCommentVote.findFirst({
      where: {
        userId: session.user.id,
        discussionCommentId: commentId,
      },
    })

    if (exisitingVote) {
      if (exisitingVote.type === voteType) {
        await db.discussionCommentVote.delete({
          where: {
            userId_discussionCommentId: {
              userId: session.user.id,
              discussionCommentId: commentId,
            },
          },
        })
        return new Response('OK')
      } else {
        await db.discussionCommentVote.update({
          where: {
            userId_discussionCommentId: {
              userId: session.user.id,
              discussionCommentId: commentId,
            },
          },
          data: {
            type: voteType,
          },
        })
      }
      return new Response('OK')
    }

    await db.discussionCommentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        discussionCommentId: commentId,
      },
    })
    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }
    return new Response('Could not register vote, please try again', { status: 500 })
  }
}

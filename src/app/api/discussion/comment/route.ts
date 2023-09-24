import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { DiscussionCommentValidator } from '@/lib/validators/discussionComment'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    const body = await req.json()
    const { discussionId, text, replyToId } = DiscussionCommentValidator.parse(body)

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    await db.discussionComment.create({
      data: {
        discussionId,
        text,
        replyToId,
        authorId: session.user.id,
      },
    })
    return new Response('Ok')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }
    return new Response('Could not create comment', {
      status: 500,
    })
  }
}

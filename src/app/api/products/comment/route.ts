import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentValidator } from '@/lib/validators/comment'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    const body = await req.json()
    const { productId, text, replyToId } = CommentValidator.parse(body)

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    await db.comment.create({
      data: {
        productId,
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

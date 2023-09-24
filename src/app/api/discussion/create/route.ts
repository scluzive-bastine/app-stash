import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { DiscussionValidator } from '@/lib/validators/discussion'
import slugify from 'slugify'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { title, content } = DiscussionValidator.parse(body)

    // Generate the slug from the title
    const slug = slugify(title, {
      lower: true, // Convert the slug to lowercase
      remove: /[*+~.()'"!:@]/g, // Remove special characters
    })

    await db.discussion.create({
      data: {
        title,
        content,
        slug,
        authorId: session.user.id,
      },
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response('Could not post discussion at this time, please try again later', {
      status: 500,
    })
  }
}

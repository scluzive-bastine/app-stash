import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { DiscussionVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'
import { CachedDiscussion } from '../../../../../types/redis'
import redis from '@/lib/redis'

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { discussionId, voteType } = DiscussionVoteValidator.parse(body)
    const session = await getAuthSession()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const existingVote = await db.discussionVote.findFirst({
      where: {
        userId: session.user.id,
        discussionId,
      },
    })
    const discussion = await db.discussion.findFirst({
      where: {
        id: discussionId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    // Check if product exists
    if (!discussion) {
      return new Response('Product not found', { status: 404 })
    }

    if (existingVote) {
      // check if vote type === vote type in database, if so delete the vote
      if (existingVote.type === voteType) {
        await db.discussionVote.delete({
          where: {
            userId_discussionId: {
              discussionId,
              userId: session.user.id,
            },
          },
        })
        return new Response('Ok')
      }

      await db.discussionVote.update({
        where: {
          userId_discussionId: {
            discussionId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      })

      // Caching with redis
      const votesAmt = discussion.votes.reduce((acc, vote) => {
        if (vote.type === 'UP') return acc + 1
        if (vote.type === 'DOWN') return acc - 1
        return acc
      }, 0)

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedDiscussion = {
          authorUsername: discussion.author.username ?? '',
          content: JSON.stringify(discussion.content),
          id: discussion.id,
          title: discussion.title,
          currentVote: voteType,
          createdAt: discussion.createdAt,
        }
        await redis.hset(`discussion:${discussion.slug}`, cachePayload)
      }

      return new Response('OK')
    }

    //   If there's no exisiting vote in db create a new one
    await db.discussionVote.create({
      data: {
        userId: session.user.id,
        discussionId,
        type: voteType,
      },
    })

    // Caching with redis
    const votesAmt = discussion.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0)

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedDiscussion = {
        authorUsername: discussion.author.username ?? '',
        content: JSON.stringify(discussion.content),
        id: discussion.id,
        title: discussion.title,
        currentVote: voteType,
        createdAt: discussion.createdAt,
      }
      await redis.hset(`discussion:${discussion.slug}`, cachePayload)
    }

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }
    return new Response('Could not register vote, please try again', { status: 500 })
  }
}

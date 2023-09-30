import EditorOutput from '@/components/discussion/EditorOutput'
import CommentSection from '@/components/discussion/comments/CommentSection'
import DiscussionVoteServer from '@/components/discussion/discussion-vote/DiscussionVoteServer'
import { db } from '@/lib/db'
import redis from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { Discussion, DiscussionCommentVote, DiscussionVote, User } from '@prisma/client'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { CachedDiscussion } from '../../../../types/redis'
import { ArrowBigUp, Loader2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

interface PageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = params
  // const cachedDiscussion = (await redis.hgetall(`discussion:${slug}`)) as CachedDiscussion
  let post: (Discussion & { votes: DiscussionVote[]; author: User }) | null = null

  // if (!cachedDiscussion) {
  post = await db.discussion.findFirst({
    where: {
      slug,
    },
    include: {
      votes: true,
      author: true,
    },
  })
  // }

  if (!post) return notFound()
  return (
    <main className='mx-auto max-w-3xl py-10 relative'>
      <div className='w-full p-4 flex flex-col md:flex-row gap-5 relative'>
        <DiscussionVoteServer
          discussionId={post.id}
          getData={async () => {
            return await db.discussion.findFirst({
              where: {
                slug,
              },
              include: {
                votes: true,
              },
            })
          }}
          className='hidden md:flex'
        />
        <div className='order-first md:order-none w-full'>
          <div className='flex flex-col gap-2 mb-10'>
            <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900 dark:text-gray-100'>
              {post.title}
            </h1>
            <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
              Posted by {post.author.name} | {formatTimeToNow(new Date(post.createdAt))}
            </p>
            <DiscussionVoteServer
              discussionId={post.id}
              getData={async () => {
                return await db.discussion.findFirst({
                  where: {
                    slug,
                  },
                  include: {
                    votes: true,
                  },
                })
              }}
              className='flex md:hidden'
            />
          </div>
          <EditorOutput content={post.content} />
          <CommentSection discussionId={post.id} />
        </div>
      </div>
    </main>
  )
}

export default page

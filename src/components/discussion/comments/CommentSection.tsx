import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import React from 'react'
import CreateComment from './CreateComment'
import PostComment from './PostComment'

interface CommentSectionProps {
  discussionId: string
}

const CommentSection = async ({ discussionId }: CommentSectionProps) => {
  const session = await getAuthSession()

  const comments = await db.discussionComment.findMany({
    where: {
      discussionId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  return (
    <div>
      <CreateComment
        discussionId={discussionId}
        user={
          session?.user
            ? { image: session?.user.image || null, name: session?.user.name || null }
            : undefined
        }
      />

      <div className='mt-10'>
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce((acc, vote) => {
              if (vote.type === 'UP') return acc + 1
              if (vote.type === 'DOWN') return acc - 1
              return acc
            }, 0)

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            )

            return (
              <div key={topLevelComment.id} className='flex flex-col'>
                <div className='mb-2'>
                  <PostComment
                    discussionId={discussionId}
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmount={topLevelCommentVotesAmt}
                  />
                </div>
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1
                      if (vote.type === 'DOWN') return acc - 1
                      return acc
                    }, 0)

                    const replyVote = reply.votes.find((vote) => vote.userId === session?.user.id)

                    return (
                      <div
                        key={reply.id}
                        className='ml-2 pl-4 py-2 border-l-2 border-gray-300 dark:border-gray-700'
                      >
                        <PostComment
                          discussionId={discussionId}
                          comment={reply}
                          currentVote={replyVote}
                          votesAmount={replyVotesAmt}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CommentSection

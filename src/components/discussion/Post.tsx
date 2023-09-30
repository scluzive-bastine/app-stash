import React from 'react'
import UserAvatar from '../UserAvatar'
import { Discussion, DiscussionVote, User, Vote, VoteType } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import EditorOutput from './EditorOutput'
import { ExtendedDiscussion } from '../../../types/db'
import DiscussionVoteClient from './discussion-vote/DiscussionVoteClient'
import { formatTimeToNow } from '@/lib/utils'

interface PostProps {
  discussion: ExtendedDiscussion
  initialVotesAmount: number
  initialVote: VoteType | undefined
}

const Post = ({ discussion, initialVotesAmount, initialVote }: PostProps) => {
  return (
    <div className='pb-2 flex space-x-5 items-start'>
      <div className='flex-shrink-0'>
        <UserAvatar user={discussion.author} />
      </div>
      <div>
        <Link
          href={`/discussions/${discussion.slug}`}
          className='text-lg font-semibold text-gray-800 dark:text-gray-200'
        >
          {discussion.title}
        </Link>
        <div className='max-h-40 overflow-clip relative text-sm'>
          <EditorOutput content={discussion.content} />
          <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent dark:from-[#030d25] dark:to-transparent' />
        </div>
        <div className=' mt-2 flex flex-col md:flex-row space-x-4 md:items-center'>
          <div className='flex gap-2'>
            <DiscussionVoteClient
              discussionId={discussion.id}
              initialVotesAmount={initialVotesAmount}
              initialVote={initialVote}
              className='flex flex-row md:flex-row border-0'
            />
            <Link
              href={`/discussions/${discussion.slug}`}
              className='flex w-fit items-center gap-2 text-sm text-gray-500'
            >
              <MessageSquare className='w-4 h-4' />
              {discussion.comments.length} Comments
            </Link>
          </div>
          <p className='text-gray-500 text-sm'>{formatTimeToNow(new Date(discussion.createdAt))}</p>
        </div>
      </div>
    </div>
  )
}

export default Post

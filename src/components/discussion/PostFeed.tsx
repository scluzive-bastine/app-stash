import React from 'react'
import { ExtendedDiscussion } from '../../../types/db'
import Link from 'next/link'
import UserAvatar from '../UserAvatar'
import { ArrowBigDown, ArrowBigUp, MessageSquare, MessagesSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface PostFeedProps {
  discussions: ExtendedDiscussion[]
}

const PostFeed = ({ discussions }: PostFeedProps) => {
  return (
    <div className='w-full'>
      {discussions.map((discussion) => (
        <div
          key={discussion.id}
          className='pb-2 border-b border-gray-300 dark:border-gray-700 flex space-x-5 items-start'
        >
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
            <p className='text-sm text-gray-500'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur accusamus in et
              nemo reprehenderit. Reiciendis fugit sint molestiae veritatis mollitia!
            </p>
            <div className=' mt-2 flex space-x-4 items-center'>
              <div className='flex gap-1 items-center'>
                <Button className={''} variant={'ghost'} aria-label='upvote' size={'icon'}>
                  <ArrowBigUp className={cn('w-5 h-5')} />
                </Button>
                <p className='text-gray-800 dark:text-gray-100 font-semibold py-2 text-sm'>1</p>
                <Button variant={'ghost'} aria-label='downvote' size={'icon'}>
                  <ArrowBigDown className={cn('w-5 h-5')} />
                </Button>
              </div>
              <Link
                href={`/discussions/${discussion.slug}`}
                className='flex w-fit items-center gap-2 text-sm text-gray-500'
              >
                <MessageSquare className='w-4 h-4' />0 Comments
              </Link>
              <p className='text-gray-500 text-sm'>20 mins ago</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PostFeed

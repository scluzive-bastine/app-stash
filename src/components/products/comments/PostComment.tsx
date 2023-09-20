'use client'
import ButtonLoader from '@/components/ButtonLoader'
import UserAvatar from '@/components/UserAvatar'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { formatTimeToNow } from '@/lib/utils'
import { CommentRequest, CommentValidator } from '@/lib/validators/comment'
import { Comment, CommentVote, User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowBigDown, ArrowBigUp, MessageSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface PostCommentProps {
  productId: string
  comment: ExtendedComment
}

const PostComment: FC<PostCommentProps> = ({ productId, comment }) => {
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const { data: session } = useSession()

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ replyToId, text, productId }: CommentRequest) => {
      const payload: CommentRequest = {
        text,
        replyToId,
        productId,
      }

      const { data } = await axios.patch('/api/products/comment', payload)
      return data
    },
    onError: () => {
      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setIsReplying(false)
    },
  })

  const handleIsReplying = () => {
    setIsReplying((prev) => !prev)
  }
  return (
    <div className='flex flex-col'>
      <div className='flex flex-items-center space-x-2'>
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className='flex-shrink-0 w-6 h-6'
        />
        <div className='flex items-center space-x-1'>
          <p className='font-medium text-gray-800 dark:text-gray-100'>{comment.author.name}</p>
          <p className='text-xs text-gray-500'> {formatTimeToNow(new Date(comment.createdAt))} </p>
        </div>
      </div>
      <p className='text-gray-700 dark:text-gray-200 mt-2 text-sm'>{comment.text}</p>

      {/* Up, Down and vote count */}
      <div className='flex mt-2 items-center flex-wrap'>
        <div className='flex gap-x-1'>
          <Button variant={'ghost'} aria-label='upvote' size={'icon'}>
            <ArrowBigUp className='w-5 h-5' />
            {/* 👍🏽 */}
          </Button>
          <p className='text-gray-800 dark:text-gray-100 font-semibold py-2'>30</p>
          <Button variant={'ghost'} aria-label='upvote' size={'icon'}>
            <ArrowBigDown className='w-5 h-5' />
            {/* 👎🏽 */}
          </Button>
        </div>
        <Button
          variant={'ghost'}
          size={'sm'}
          className='text-sm'
          onClick={() => handleIsReplying()}
        >
          <MessageSquare className='w-4 h-4 mr-1.5' />
          Reply
        </Button>
        {isReplying && (
          <div className='w-full grid mt-1'>
            <Label htmlFor='comment'>Your Comment</Label>
            <div className='flex space-x-2 mt-2'>
              {/* User image */}
              <UserAvatar
                user={{
                  name: session?.user.name || null,
                  image: session?.user.image || null,
                }}
                className='flex-shrink-0 w-6 h-6'
              />
              <div className='w-full'>
                <Textarea
                  id='comment'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='what are your thoughts'
                  className='focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500/80 focus-visible:ring-offset-0'
                />
                <div className='flex space-x-2 justify-end mt-2'>
                  <Button
                    tabIndex={-1}
                    variant={'outline'}
                    className='flex'
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={'primary'}
                    className='flex'
                    disabled={isLoading}
                    onClick={() => {
                      if (!input) return
                      postComment({
                        replyToId: comment.replyToId ?? comment.id,
                        text: input,
                        productId,
                      })
                    }}
                  >
                    {isLoading && <ButtonLoader />}
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostComment

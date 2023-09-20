'use client'
import UserAvatar from '@/components/UserAvatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getAuthSession } from '@/lib/auth'
import { User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { CommentRequest } from '@/lib/validators/comment'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import ButtonLoader from '@/components/ButtonLoader'

interface CreateCommentProps {
  productId: string
  replyToId?: string
  user?: Pick<User, 'image' | 'name'> | undefined
}

const CreateComment = ({ productId, replyToId, user }: CreateCommentProps) => {
  const [comment, setComment] = useState<string>('')
  const router = useRouter()

  const { mutate: createComment, isLoading } = useMutation({
    mutationFn: async ({ productId, replyToId, text }: CommentRequest) => {
      const payload: CommentRequest = {
        productId,
        text,
        replyToId,
      }
      const { data } = await axios.patch('/api/products/comment', payload)
      return data
    },
    onError: (error) => {
      // if (error instanceof AxiosError) {
      //           if (err.response?.status === 401) {
      //             return loginToast()
      //           }
      // }
      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setComment('')
    },
  })

  return (
    <div className='border-y border-gray-300 dark:border-gray-700 p-4 mt-10'>
      <Label htmlFor='comment'>Your Comment</Label>
      <div className='flex space-x-2 mt-2'>
        <UserAvatar
          user={{
            name: user?.name || null,
            image: user?.image || null,
          }}
          className='flex-shrink-0'
        />
        <div className='w-full'>
          <Textarea
            id='comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={1}
            placeholder='what are your thoughts'
            className='focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500/80 focus-visible:ring-offset-0'
          />
          <div className='flex justify-end mt-2'>
            <Button
              variant={'primary'}
              className='flex'
              onClick={() => createComment({ productId, text: comment, replyToId })}
              disabled={comment.length === 0}
            >
              {isLoading && <ButtonLoader />}
              Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateComment

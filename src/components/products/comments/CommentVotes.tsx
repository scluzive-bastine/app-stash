'use client'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { CommentVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { FC, useState } from 'react'

type PartialVote = Pick<CommentVote, 'type'>

interface CommentVotesProps {
  commentId: string
  initialVotesAmount: number
  initialVote?: PartialVote
}

const CommentVotes: FC<CommentVotesProps> = ({ commentId, initialVotesAmount, initialVote }) => {
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const previousVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        voteType,
        commentId,
      }
      await axios.patch('/api/products/comment/vote', payload)
    },
    onError: (error, voteType) => {
      if (voteType === 'UP') setVotesAmount((prev) => prev - 1)
      else setVotesAmount((prev) => prev + 1)

      setCurrentVote(previousVote)

      // Login toast if error is 401 status

      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered, please try again',
        variant: 'destructive',
      })
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmount((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmount((prev) => prev + 1)
      } else {
        setCurrentVote({ type })
        if (type === 'UP') setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN') setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className='flex gap-1'>
      <Button
        className={cn()}
        onClick={() => vote('UP')}
        variant={'ghost'}
        aria-label='upvote'
        size={'icon'}
      >
        <ArrowBigUp
          className={cn('w-5 h-5', {
            'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
          })}
        />
        {/* 👍🏽 */}
      </Button>
      <p className='text-gray-800 dark:text-gray-100 font-semibold py-2 text-sm'>{votesAmount}</p>
      <Button onClick={() => vote('DOWN')} variant={'ghost'} aria-label='downvote' size={'icon'}>
        <ArrowBigDown
          className={cn('w-5 h-5', {
            'text-red-500 fill-red-500': currentVote?.type === 'DOWN',
          })}
        />
        {/* 👎🏽 */}
      </Button>
    </div>
  )
}

export default CommentVotes

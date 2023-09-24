'use client'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { DiscussionVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DiscussionVoteClientProps {
  discussionId: string
  initialVotesAmount: number
  initialVote?: VoteType | null
  className?: string
}

const DiscussionVoteClient = ({
  discussionId,
  initialVotesAmount,
  initialVote,
  className,
}: DiscussionVoteClientProps) => {
  const [currentVote, setCurrentVote] = useState(initialVote)
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
  const previousVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: DiscussionVoteRequest = {
        discussionId,
        voteType,
      }

      await axios.patch(`/api/discussion/vote`, payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmount((prev) => prev - 1)
      else setVotesAmount((prev) => prev + 1)

      // reset current vote
      setCurrentVote(previousVote)

      //  if (err instanceof AxiosError) {
      //    if (err.response?.status === 401) {
      //      return loginToast()
      //    }
      //  }
      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered, please try again',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmount((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmount((prev) => prev + 1)
      } else {
        setCurrentVote(type)
        if (type === 'UP') setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN') setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div
      className={cn(
        'w-fit h-fit sticky top-2 flex flex-row md:flex-col gap-1 p-1 border border-gray-300 dark:border-gray-700 rounded-md justify-center',
        className
      )}
    >
      <Button onClick={() => vote('UP')} size='sm' variant='ghost' aria-label='upvote'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-gray-800 dark:text-white', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP',
          })}
        />
      </Button>
      <p className='text-gray-800 dark:text-gray-100 font-semibold py-2 text-sm text-center'>
        {votesAmount}
      </p>
      <Button onClick={() => vote('DOWN')} size='sm' variant='ghost' aria-label='upvote'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-gray-800 dark:text-white', {
            'text-red-500 fill-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}

export default DiscussionVoteClient

'use client'
import { FC, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowBigUp } from 'lucide-react'
import { Vote, VoteType } from '@prisma/client'
import { usePrevious } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import { ProductVoteRequest } from '@/lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { type } from 'os'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type PartialVote = Pick<Vote, 'type'>

interface UpVoteProductProps {
  initialVote?: PartialVote
  productId: string
  voteAmount: number
}

const UpVoteProduct: FC<UpVoteProductProps> = ({ initialVote, productId, voteAmount }) => {
  const [currentVote, setCurrentVote] = useState(initialVote)
  const [votesAmount, setVotesAmount] = useState<number>(voteAmount)
  const previousVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: ProductVoteRequest = {
        voteType,
        productId,
      }

      await axios.patch('/api/products/vote', payload)
    },
    onError: (error, voteType) => {
      // Update vote count
      if (voteType === 'UP') setVotesAmount((prev) => prev - 1)
      else setVotesAmount((prev) => prev + 1)

      setCurrentVote(previousVote)

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          // return login toast
        }
      }

      toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered, please try again',
        variant: 'destructive',
      })
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmount((prev) => prev - 1)
        else setVotesAmount((prev) => prev + 1)
      } else {
        setCurrentVote({ type })
        if (type === 'UP') setVotesAmount((prev) => prev + 1)
        else setVotesAmount((prev) => prev - 1)
      }
    },
  })

  return (
    <Button
      className={cn(
        'uppercase text-white dark:text-white',
        currentVote?.type === 'UP' && 'bg-emerald-600 hover:bg-emerald-600/80'
      )}
      onClick={() => vote(currentVote?.type === 'UP' ? 'DOWN' : 'UP')}
    >
      <ArrowBigUp className='mr-2' /> UpVote {votesAmount}
    </Button>
  )
}

export default UpVoteProduct

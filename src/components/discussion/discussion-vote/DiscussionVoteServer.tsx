import { Discussion, DiscussionVote, VoteType } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import DiscussionVoteClient from './DiscussionVoteClient'

interface DiscussionVoteServerProps {
  discussionId: string
  initialVotesAmount?: number
  initialVote?: VoteType | null
  getData?: () => Promise<(Discussion & { votes: DiscussionVote[] }) | null>
  className?: string
}

const DiscussionVoteServer = async ({
  discussionId,
  initialVotesAmount,
  initialVote,
  getData,
  className,
}: DiscussionVoteServerProps) => {
  const session = await getServerSession()

  let _votesAmt: number = 0
  let _currentVote: DiscussionVote['type'] | null | undefined = undefined

  if (getData) {
    // fetch data in component
    const discussion = await getData()
    if (!discussion) return notFound()

    _votesAmt = discussion.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0)
    _currentVote = discussion.votes.find((vote) => vote.userId === session?.user.id)?.type
  } else {
    // passed as props
    _votesAmt = initialVotesAmount!
    _currentVote = initialVote
  }

  return (
    <DiscussionVoteClient
      discussionId={discussionId}
      initialVotesAmount={_votesAmt}
      initialVote={_currentVote}
      className={className}
    />
  )
}

export default DiscussionVoteServer

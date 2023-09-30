'use client'
import React, { useEffect, useRef } from 'react'
import { ExtendedDiscussion } from '../../../types/db'
import Post from './Post'
import { useSession } from 'next-auth/react'
import { getAuthSession } from '@/lib/auth'
import { useInfiniteQuery } from '@tanstack/react-query'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import axios from 'axios'
import { useIntersection } from '@mantine/hooks'
import { Skeleton } from '../ui/skeleton'
import PostLoader from './PostLoader'

interface PostFeedProps {
  discussions: ExtendedDiscussion[]
}

const PostFeed = ({ discussions }: PostFeedProps) => {
  const { data: session } = useSession()
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query = `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`

      const { data } = await axios.get(query)
      return data as ExtendedDiscussion[]
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },

      initialData: { pages: [discussions], pageParams: [1] },
    }
  )

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  console.log(isFetchingNextPage)

  const posts = data?.pages.flatMap((page) => page) ?? discussions
  return (
    <ul>
      {posts.map((discussion) => {
        const voteAmount = discussion.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0)

        const currentVote = discussion.votes.find((vote) => vote.userId === session?.user.id)?.type
        return (
          <li key={discussion.id} ref={ref}>
            <Post
              discussion={discussion}
              initialVotesAmount={voteAmount}
              initialVote={currentVote}
            />
          </li>
        )
      })}
      {isFetchingNextPage && <PostLoader />}
    </ul>
  )
}

export default PostFeed

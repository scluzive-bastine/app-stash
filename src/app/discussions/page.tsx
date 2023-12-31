import PostFeed from '@/components/discussion/PostFeed'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'

const page = async () => {
  const posts = await db.discussion.findMany({
    include: {
      author: true,
      votes: true,
      comments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  })
  return (
    <main className='max-w-6xl mx-auto'>
      <div className='my-20 px-4 md:px-0'>
        <h1 className='text-2xl font-semibold text-black dark:text-white mb-10'>Discussion</h1>

        <div className='md:flex md:space-x-4 md:divide-x divide-gray-300 dark:divide-gray-800 mt-10 px-4'>
          <div className='w-full flex flex-col gap-5'>
            <PostFeed discussions={posts} />
          </div>
          <div className='w-[400px] p-4 flex-shrink-0'>
            <h2>Trending Apps</h2>
          </div>
        </div>
      </div>
    </main>
  )
}

export default page

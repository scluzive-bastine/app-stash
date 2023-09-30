import { Skeleton } from '../ui/skeleton'

const PostLoader = () => {
  return (
    <div className='flex items-start space-x-4'>
      <Skeleton className='h-10 w-10 rounded-full flex-shrink-0 bg-gray-300/80 dark:bg-gray-700/90' />
      <div className='space-y-2 w-4/5'>
        <Skeleton className='h-5 w-full bg-gray-300/80 dark:bg-gray-700/90' />
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-3 w-4/5 bg-gray-300/80 dark:bg-gray-700/90' />
          <Skeleton className='h-3 w-3/5 bg-gray-300/80 dark:bg-gray-700/90' />
          <Skeleton className='h-3 w-2/5 bg-gray-300/80 dark:bg-gray-700/90' />
          <Skeleton className='h-3 w-3/5 bg-gray-300/80 dark:bg-gray-700/90' />
        </div>
        <div className='flex flex-col md:flex-row gap-2 mt-2'>
          <div className='flex gap-2'>
            <Skeleton className='w-20 h-6 rounded bg-gray-300/80 dark:bg-gray-700/90' />
            <Skeleton className='w-40 h-6 rounded bg-gray-300/80 dark:bg-gray-700/90' />
          </div>
          <Skeleton className='w-20 h-6 rounded bg-gray-300/80 dark:bg-gray-700/90' />
        </div>
      </div>
    </div>
  )
}

export default PostLoader

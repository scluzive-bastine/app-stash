import SignIn from '@/components/auth/SignIn'
import { FC } from 'react'

const page: FC = () => {
  return (
    <div className='relative h-[calc(100vh-5rem)]'>
      <div className='absolute inset-0'>
        <div className='max-w-lg mx-auto h-full flex flex-col items-center justify-center p-2'>
          <SignIn />
        </div>
      </div>
    </div>
  )
}

export default page

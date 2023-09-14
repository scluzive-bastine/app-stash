import SignIn from '@/components/auth/SignIn'
import { FC } from 'react'

const page: FC = () => {
  return (
    <div className='absolute inset-0'>
      <div className='h-full flex flex-col gap-20 max-w-2xl mx-auto items-center justify-center'>
        <h2>Sign up</h2>
        <SignIn />
      </div>
    </div>
  )
}

export default page

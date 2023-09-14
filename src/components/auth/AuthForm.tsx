'use client'
import { FC, useState } from 'react'
import { Button } from '../ui/button'
import { Icons } from '../Icons'
import { signIn } from 'next-auth/react'
import { cn } from '@/lib/utils'

const PROVIDER = 'google'

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const AuthForm: FC<AuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn(PROVIDER)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        onClick={loginWithGoogle}
        className='w-full bg-black dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-gray-700/50 text-white dark:text-white'
        size='lg'
      >
        {isLoading ? null : <Icons.google className='w-6 h-6 mr-3' />}
        <span>Google</span>
      </Button>
    </div>
  )
}

export default AuthForm

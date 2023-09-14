import { FC } from 'react'
import AuthForm from './AuthForm'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'

const SignIn: FC = () => {
  return (
    <div className='container mx-auto flex flex-col w-full justify-center'>
      <h1 className='text-center'>Welcome back</h1>
      <AuthForm />
    </div>
  )
}

export default SignIn

import { FC } from 'react'
import AuthForm from './AuthForm'
import Link from 'next/link'
import { Icons } from '../Icons'

const SignIn: FC = () => {
  return (
    <div className='container mx-auto flex flex-col w-full justify-center text-center gap-4 border p-4 md:p-10 rounded-xl'>
      <Icons.logo className='w-10 h-10 mx-auto' />
      <h1 className='text-lg text-center font-semibold text-black dark:text-white'>Welcome back</h1>
      <p className='text-sm text-gray-800 dark:text-gray-400 max-w-xs mx-auto '>
        Join our community of passionate users, exploring and curating the finest applications and
        innovations across the digital landscape.
      </p>
      <AuthForm />

      <p className='px-8 text-center text-xs text-gray-700 dark:text-gray-400'>
        We&apos;ll never post to any of your accounts without your permission.
      </p>
    </div>
  )
}

export default SignIn

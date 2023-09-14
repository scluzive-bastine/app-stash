import { FC } from 'react'
import AuthForm from './AuthForm'
import Link from 'next/link'

const SignUp = () => {
  return (
    <div className='container mx-auto flex flex-col w-full justify-center'>
      <h1>Welcome, Sign up</h1>
      <AuthForm />
    </div>
  )
}

export default SignUp

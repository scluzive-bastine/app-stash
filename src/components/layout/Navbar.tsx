import React from 'react'
import { ModeToggle } from '../ModeToggle'
import { Icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import Search from '../Search'
import MobileSidebar from './MobileSidebar'
import { navigations } from '@/lib/constants'
import { getAuthSession } from '@/lib/auth'
import UserAccountNav from '@/components/UserAccountNav'
import CreateProduct from '@/components/CreateProduct'

const Navbar = async () => {
  const session = await getAuthSession()
  return (
    <div className='w-full px-4 md:px-8 py-4 relative z-10 border-b border-gray-200 dark:border-gray-800 h-20'>
      <div className='h-full'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-8'>
            <div className='flex gap-4 md:gap-0'>
              <MobileSidebar />
              <Link href={'/'} className='flex gap-2 items-center'>
                <Icons.logo className='w-10 h-10' />
                <p className='text-lg text-black dark:text-white font-light'>
                  app<span className='font-medium'>Stash</span>
                </p>
              </Link>
            </div>
            <div className='hidden md:flex space-x-4 h-full'>
              {navigations.map((link) => (
                <Link
                  href={link.link}
                  key={link.name}
                  className='h-full flex items-center text-gray-900 dark:text-gray-300 hover:text-gray-800/70 dark:hover:text-gray-300/70'
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <Search className='hidden md:flex items-center' />
            <ModeToggle />
            {session ? (
              <>
                <CreateProduct />
                <UserAccountNav user={session.user} />
              </>
            ) : (
              <Link href='/sign-in' className={buttonVariants({ variant: 'primary' })}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FC } from 'react'
import { DropdownMenuItem } from './ui/dropdown-menu'
import Link from 'next/link'
import { createProductLinks } from '@/lib/constants'

interface CreateProductProps {}

const CreateProduct: FC<CreateProductProps> = ({}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none hidden md:flex'>Create</DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-[300px] lg:mr-2'>
        {createProductLinks.map((link) => (
          <DropdownMenuItem
            key={link.name}
            className='py-2 text-md cursor-pointer dark:hover:bg-gray-800'
          >
            <Link href={link.link} className='flex space-x-3'>
              {' '}
              <span className='text-sm px-3 py-2 h-full rounded border border-gray-300 dark:border-gray-700'>
                {link.emoji}
              </span>{' '}
              <div className='flex flex-col'>
                <span className='font-semibold text-sm text-gray-800 dark:text-white'>
                  {link.name}
                </span>
                <small className='text-gray-500'>Launch your product</small>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CreateProduct

import { FC } from 'react'
import { Input } from './ui/input'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchProps {
  className?: string
}

const Search = ({ className }: SearchProps) => {
  return (
    <div className={cn('relative', className)}>
      <SearchIcon className='w-4 h-4 absolute left-2 text-gray-500' />
      <Input
        type='text'
        placeholder='Search [⌘ + k]'
        className='outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-8'
      />
    </div>
  )
}

export default Search

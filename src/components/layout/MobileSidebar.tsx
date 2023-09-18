import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Search from '@/components/Search'
import { navigations } from '@/lib/constants'
import Link from 'next/link'

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant='ghost' size='icon' className='md:hidden' asChild>
          <Menu className='w-8 h-8' />
        </Button>
      </SheetTrigger>
      <SheetContent className='w-full'>
        <Search className='flex items-center mt-5' />
        <ul className='flex flex-col space-y-3 mt-10'>
          {navigations.map((link) => (
            <li
              key={link.name}
              className='font-semibold text-gray-900 dark:text-gray-300 hover:text-gray-800/70 dark:hover:text-gray-300/70'
            >
              <Link href={link.link}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar

import { FC } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import CreateProductForm from '@/components/products/CreateProductForm'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <main className='mx-auto max-w-2xl py-20 px-4'>
      <div className='flex space-x-10 items-center border-b border-gray-200 dark:border-gray-800 pb-4'>
        <div className='w-16 h-16 rounded-lg flex items-center justify-center text-center text-2xl bg-emerald-500/20 '>
          🚀
        </div>
        <div>
          <h2 className='text-gray-800 dark:text-white text-xl md:text-2xl font-semibold'>
            Launch your product
          </h2>
          <p className='text-gray-500 text-sm'>Create Product and get community feedbacks</p>
        </div>
      </div>
      <div className='mt-10'>
        <CreateProductForm />
      </div>
    </main>
  )
}

export default page

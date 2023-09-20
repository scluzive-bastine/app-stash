import React from 'react'
import { productCategories } from '@/lib/constants'
import { db } from '@/lib/db'
import ProductFeed from '@/components/products/ProductFeed'
import { SlidersHorizontal } from 'lucide-react'

const page = async () => {
  const products = await db.product.findMany({
    include: {
      productImages: true,
    },
    take: 10,
  })

  return (
    <main className='max-w-6xl mx-auto'>
      <div className='flex px-4 space-x-2 divide-x-2 divide-gray-300 dark:divide-gray-800 border-b border-gray-300 dark:border-gray-700 py-4'>
        <div className='flex flex-shrink-0 items-center rounded-full text-white font-semibold text-sm space-x-2 bg-gradient-to-r from-blue-800 to-pink-500 w-fit px-4'>
          <SlidersHorizontal className='w-5 h-5' />{' '}
          <span className='hidden md:flex'>All Categories</span>
        </div>
        <ul className='flex space-x-4 pl-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide'>
          {productCategories.map((category) => (
            <li
              key={category.id}
              className='text-sm text-gray-800 dark:text-white font-semibold flex-shrink-0 border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-700/50 hover:bg-gray-200/50 transition-all ease-in-out duration-150 snap-always snap-center'
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      <div className='md:flex md:space-x-4 md:divide-x divide-gray-300 dark:divide-gray-800 mt-10 px-4'>
        <div className='w-full flex flex-col gap-4'>
          <ProductFeed initialProducts={products} />
        </div>
        <div className='w-[400px] p-4 flex-shrink-0'>
          <h2>Blog Posts</h2>
        </div>
      </div>
    </main>
  )
}

export default page

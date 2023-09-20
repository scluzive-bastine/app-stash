import React, { FC } from 'react'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import { ArrowBigUp } from 'lucide-react'
import { ExtendedProduct } from '../../../types/db'
import { productCategories } from '@/lib/constants'
import Link from 'next/link'
import { getCategoryName } from '@/lib/utils'

interface ProductFeedProps {
  initialProducts: ExtendedProduct[]
}

const ProductFeed: FC<ProductFeedProps> = ({ initialProducts }) => {
  return initialProducts.map((product) => (
    <Link href={`/products/${product.slug}`} key={product.id}>
      <div className='group border border-gray-300 dark:border-gray-700 rounded-md p-4 flex space-x-4 cursor-pointer'>
        <div className='w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-md flex items-center justify-center'>
          <AspectRatio ratio={1}>
            <Image
              fill
              alt='Product Logo'
              className='rounded-md object-cover group-hover:scale-125 transition-all duration-150 ease-linear'
              src={product.logoUrl}
            />
          </AspectRatio>
        </div>
        <div className='w-full flex md:space-x-2 items-center justify-between'>
          <div>
            <h2 className='text-sm md:text-lg font-semibold text-gray-800 dark:text-white'>
              {product.title}
            </h2>
            <p className='text-xs text-gray-500 md:mb-2'>{product.tagLine}</p>
            <span className='text-xs'>#{getCategoryName(product.category)}</span>
          </div>
          <div className='text-sm border border-gray-300 dark:border-gray-700 px-3 py-1.5 flex space-x-1 items-center w-fit h-fit rounded-md'>
            <ArrowBigUp className='w-5 h-5' />
            <span>50</span>
          </div>
        </div>
      </div>
    </Link>
  ))
}

export default ProductFeed

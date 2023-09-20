import { Icons } from '@/components/Icons'
import UserAvatar from '@/components/UserAvatar'
import CommentSection from '@/components/products/comments/CommentSection'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { cn, getCategoryName } from '@/lib/utils'
import { ArrowBigUp, GlobeIcon, LinkIcon, Linkedin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const { slug } = params

  const product = await db.product.findFirst({
    where: {
      slug,
    },
    include: {
      votes: true,
      productImages: true,
      comments: true,
      owner: true,
    },
  })

  if (!product) return notFound()

  return (
    <main className='w-full mx-auto'>
      <div className='w-full h-40 bg-gray-300 dark:bg-blue-950/20 relative overflow-hidden'>
        <Image
          className='w-full h-full'
          fill
          alt='Product Page Header Background'
          src={'/bg-pd.jpg'}
        />
      </div>
      <div className='max-w-6xl mx-auto relative z-10'>
        <div className='flex justify-between items-start -mt-16 px-4 md:px-0'>
          <div className='w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden border-2 border-emerald-500/50 p-1 rounded-full flex items-center justify-center'>
            <AspectRatio ratio={1}>
              <Image
                fill
                alt='Product Logo'
                className='rounded-full object-cover group-hover:scale-125 transition-all duration-150 ease-linear'
                src={product.logoUrl}
              />
            </AspectRatio>
          </div>
          <div className='flex space-x-4 items-center mt-8'>
            <Link href='#'>
              <GlobeIcon className='w-5 h-5 hover:scale-110 transition duration-200 ease-in-out text-gray-100' />
            </Link>
            <Link href={'#'}>
              <Icons.twitter className='w-5 h-5 hover:scale-110 transition duration-200 ease-in-out fill-gray-100' />
            </Link>
            <Link href={'#'}>
              <Linkedin className='w-5 h-5 hover:scale-110 transition duration-200 ease-in-out text-gray-100' />
            </Link>
          </div>
        </div>
        <div className='grid grid-cols-12 md:gap-10 px-4 w-full'>
          <div className='col-span-12 md:col-span-8 relative'>
            {/* Product Header */}
            <header className='md:flex md:space-x-3 justify-between items-center mt-5'>
              <div>
                <h1 className='text-2xl font-semibold text-black dark:text-white'>
                  {product.title}
                </h1>
                <p className='text-gray-500 text-sm'>{product.tagLine}</p>
                <small className='font-semibold text-gray-800 dark:text-gray-100'>
                  #{getCategoryName(product.category)}
                </small>
              </div>
              <Button>
                {' '}
                <ArrowBigUp className='mr-2' /> Up Vote
              </Button>
            </header>
            {/* Product description */}
            <div className='text-sm mt-5 text-gray-700 dark:text-gray-300'>
              {product.description}
            </div>
            <div className='mt-5 md:mt-10 w-full'>
              {/* Product Images */}
              <div className='flex space-x-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory'>
                {product.productImages.map((productImage_) => (
                  <div
                    key={productImage_.id}
                    className='w-52 md:w-[400px] flex-shrink-0 overflow-hidden'
                  >
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        className='w-full object-cover'
                        alt='product images'
                        fill
                        src={productImage_.image}
                      />
                    </AspectRatio>
                  </div>
                ))}
              </div>

              {/* Comment */}
              <CommentSection productId={product.id} />
            </div>
          </div>
          <div className='col-span-12 md:col-span-4 '>More details</div>
        </div>
      </div>
    </main>
  )
}

export default page

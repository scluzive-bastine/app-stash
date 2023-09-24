import { FC } from 'react'
import CreateProductForm from '@/components/products/CreateProductForm'
import PageHeader from '@/components/PageHeader'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <main className='mx-auto max-w-2xl py-20 px-4'>
      <PageHeader
        title='Launch your product'
        subheader='Create Product and get community feedbacks'
        icon='🚀'
      />
      <div className='mt-10'>
        <CreateProductForm />
      </div>
    </main>
  )
}

export default page

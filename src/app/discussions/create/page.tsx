import PageHeader from '@/components/PageHeader'
import Editor from '@/components/discussion/Editor'
import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div className='mx-auto max-w-2xl py-20 px-4'>
      <PageHeader
        title='Discussions'
        subheader='Write and share knowledge with the community'
        icon='💬'
      />

      {/* Form */}
      <Editor />
      <div className='flex justify-end'>
        <Button className='w-full' form='discussion-post-form'>
          Post Discussion
        </Button>
      </div>
    </div>
  )
}

export default page

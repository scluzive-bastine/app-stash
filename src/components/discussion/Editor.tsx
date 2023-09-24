'use client'
import { DiscussionCreationRequest, DiscussionValidator } from '@/lib/validators/discussion'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'
import { toast } from '@/hooks/use-toast'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

const Editor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiscussionCreationRequest>({
    resolver: zodResolver(DiscussionValidator),
    defaultValues: {
      title: '',
      content: null,
    },
  })

  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const [isMounted, setIsMounted] = useState<boolean>(false)
  // const pathname = usePathname()
  const router = useRouter()

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({ files: [file], endpoint: 'discussionImage' })

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          InlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== undefined) {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: 'Something went wrong',
          description: (value as { message: string }).message,
          variant: 'destructive',
        })
      }
    }
  }, [errors])

  // setting fous on the title and initializing the editor
  useEffect(() => {
    const init = async () => {
      await initializeEditor()
      setTimeout(() => {
        // set focus to title
        _titleRef.current?.focus()
      }, 0)
    }
    if (isMounted) {
      init()
      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const { mutate: createPost } = useMutation({
    mutationFn: async ({ title, content }: DiscussionCreationRequest) => {
      const payload: DiscussionCreationRequest = {
        title,
        content,
      }
      const { data } = await axios.post('/api/discussion/create', payload)
      return data
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Your post was not published, please try again later',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      // r/community/submit into r/community
      // const newPathname = pathname.split('/').slice(0, -1).join('/')
      router.push('/discussions')
      router.refresh()

      return toast({
        title: 'Successful',
        description: 'Your post has been submitted',
      })
    },
  })
  async function onSubmit(data: DiscussionCreationRequest) {
    const blocks = await ref.current?.save()
    const payload: DiscussionCreationRequest = {
      title: data.title,
      content: blocks,
    }
    createPost(payload)
  }

  if (!isMounted) {
    return null
  }

  const { ref: titleRef, ...rest } = register('title')
  return (
    <div className='w-full my-10 border border-gray-300 dark:border-gray-700 rounded-lg p-4'>
      <form id='discussion-post-form' className='w-fit' onSubmit={handleSubmit(onSubmit)}>
        <div className='prose prose-stone dark:prose-invert'>
          <TextareaAutosize
            ref={(e) => {
              titleRef(e)
              //   @ts-ignore
              _titleRef.current = e
            }}
            {...rest}
            placeholder='Title'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
          />
          <div id='editor' className='min-h-[500px]' />
        </div>
      </form>
    </div>
  )
}

export default Editor

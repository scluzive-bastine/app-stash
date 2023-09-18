'use client'
import React, { useCallback, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductCreationRequest, ProductValidator } from '@/lib/validators/product'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import {
  Check,
  ChevronsUpDown,
  ImagePlus,
  LinkIcon,
  LinkedinIcon,
  Loader2,
  UploadCloud,
} from 'lucide-react'
import { Label } from '../ui/label'
import { Icons } from '../Icons'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, Command } from '../ui/command'
import { productCategories } from '@/lib/constants'
import { FileWithPath, UploadButton } from '@uploadthing/react'
import { useUploadThing } from '@/lib/uploadthing'
import { useDropzone } from '@uploadthing/react/hooks'
import { generateClientDropzoneAccept, generateMimeTypes } from 'uploadthing/client'
import Image from 'next/image'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { OurFileRouter } from '@/app/api/uploadthing/core'
import { toast } from '@/hooks/use-toast'
import { usePathname, useRouter } from 'next/navigation'
import ButtonLoader from '../ButtonLoader'

const CreateProductForm = () => {
  const router = useRouter()
  const pathname = usePathname()

  const [files, setFiles] = useState<File[]>([])
  const [logoUrl, setLogourl] = useState<string>('')

  const form = useForm({
    resolver: zodResolver(ProductValidator),
    defaultValues: {
      title: '',
      tagLine: '',
      description: '',
      websiteUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      category: '',
      imageUrl: [] as string[],
      logoUrl: '',
    },
  })

  const { mutate: createProduct, isLoading } = useMutation({
    mutationFn: async ({
      title,
      tagLine,
      description,
      websiteUrl,
      twitterUrl,
      linkedinUrl,
      imageUrl,
      logoUrl,
      category,
    }: ProductCreationRequest) => {
      const payload: ProductCreationRequest = {
        title,
        tagLine,
        description,
        websiteUrl,
        twitterUrl,
        linkedinUrl,
        imageUrl,
        logoUrl,
        category,
      }

      const { data } = await axios.post('/api/products/create', payload)

      return data
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Your product was not uploaded, please try again later',
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      const slug = data

      const newPathname = pathname.split('/').slice(0, -1).join('/')

      router.push(newPathname + '/' + slug)
      router.refresh()

      return toast({
        title: 'Successful',
        description: 'Your product has been submitted',
      })
    },
  })

  const onSubmit = async (data: ProductCreationRequest) => {
    const payload: ProductCreationRequest = {
      title: data.title,
      tagLine: data.tagLine,
      description: data.description,
      websiteUrl: data.websiteUrl,
      twitterUrl: data.twitterUrl,
      linkedinUrl: data.linkedinUrl,
      imageUrl: data.imageUrl,
      category: data.category,
      logoUrl: data.logoUrl,
    }
    createProduct(payload)
  }

  // Upload image
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles)
  }, [])

  // Update setFiles to accept an array of files
  const updateFiles = (newFiles: FileList | null) => {
    if (newFiles) {
      // Convert FileList to an array of Files
      const fileList = Array.from(newFiles)
      setFiles(fileList)
    } else {
      setFiles([]) // Clear the files if newFiles is null or undefined
    }
  }

  // update Logo Url
  const updateLogoUrl = (logo: string) => {
    setLogourl(logo)
    form.setValue('logoUrl', logo)
  }

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      const imageUrls = res?.map((image) => image.url) as string[]
      form.setValue('imageUrl', imageUrls)

      toast({
        title: 'Successful',
        description: 'product images uploaded',
      })
    },
    onUploadError: (error: Error) => {
      toast({
        title: 'Something went wrong',
        description: `${error.message}`,
      })
      setFiles([])
      // show toast error
    },
  })

  const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : []

  const maxFileCount = permittedFileInfo?.config.image?.maxFileCount as number

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles: maxFileCount,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* Title */}
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <Label htmlFor='title'>Title</Label>
              <FormControl>
                <Input
                  placeholder='Astro 2.0'
                  className='h-10 text-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500/80 focus-visible:ring-offset-0'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />
        {/* Tagline */}
        <FormField
          control={form.control}
          name='tagLine'
          render={({ field }) => (
            <FormItem>
              <Label htmlFor='tagLine'>Tag line</Label>
              <FormControl>
                <Input
                  placeholder='Elevate Your Productivity with...'
                  className='h-10 text-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500/80 focus-visible:ring-offset-0'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />
        {/* Product Description */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <Label htmlFor='description'>Product Description</Label>
              <FormControl>
                <Textarea
                  placeholder='Describe your amazing product...'
                  className='h-10 text-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500/80 focus-visible:ring-offset-0'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />
        {/* Website URL */}
        <FormField
          control={form.control}
          name='websiteUrl'
          render={({ field }) => (
            <FormItem>
              <Label htmlFor='websiteUrl'>Website Link</Label>
              <FormControl>
                <div className='relative'>
                  <span className='absolute h-full w-10 bg-gray-200 dark:bg-gray-200/10 flex items-center justify-center rounded-l-md'>
                    <LinkIcon className='w-4 h-4 text-gray-500' />
                  </span>
                  <Input
                    placeholder='https://yourapp.com'
                    className='h-10 pl-12 text-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500/80 focus-visible:ring-offset-0'
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />
        {/* Social Media Links */}
        <div className='grid grid-cols-2 gap-2'>
          <FormField
            control={form.control}
            name='twitterUrl'
            render={({ field }) => (
              <FormItem>
                <Label htmlFor='twitterUrl'>Twitter Link</Label>
                <FormControl>
                  <div className='relative'>
                    <span className='absolute h-full w-10 bg-gray-200 dark:bg-gray-200/10 flex items-center justify-center rounded-l-md'>
                      <Icons.twitter className='w-4 h-4 fill-current text-gray-500' />
                    </span>
                    <Input
                      placeholder='https://twitter.com/name'
                      className='h-10 pl-12 text-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500/80 focus-visible:ring-offset-0'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className='text-xs font-normal' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='linkedinUrl'
            render={({ field }) => (
              <FormItem>
                <Label htmlFor='linkedinUrl'>LinkedIn Link</Label>
                <FormControl>
                  <div className='relative'>
                    <span className='absolute h-full w-10 bg-gray-200 dark:bg-gray-200/10 flex items-center justify-center rounded-l-md'>
                      <LinkedinIcon className='w-4 h-4 text-gray-500' />
                    </span>
                    <Input
                      placeholder='https://linkedin.com/name'
                      className='h-10 pl-12 text-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-500/80 focus-visible:ring-offset-0'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className='text-xs font-normal' />
              </FormItem>
            )}
          />
        </div>
        {/* Category */}
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem className='flex flex-col relative'>
              <Label htmlFor='category'>Select Category</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? productCategories.find((category) => category.value === field.value)?.name
                        : 'Select Category'}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='relative w-[300px] lg:w-[calc(42rem-1rem)] max-h-[150px] overflow-auto p-0'>
                  <Command className='w-full h-full relative'>
                    <CommandInput placeholder='Search category...' />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {productCategories.map((category) => (
                        <CommandItem
                          value={category.name}
                          key={category.value}
                          onSelect={() => {
                            form.setValue('category', category.value)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              category.value === field.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />
        {/* Upload logo */}
        <p className='text-sm font-semibold'>Select Logo Url</p>
        <div className='flex gap-5 p-2 border border-gray-300 dark:border-gray-800 rounded-md'>
          <div>
            <div className='w-20 h-20 relative rounded-full border-2 border-gray-300 dark:border-gray-700'>
              {form.getValues('logoUrl') ? (
                <Image
                  fill
                  src={form.getValues('logoUrl')}
                  className='aspect-square rounded-full object-cover'
                  alt='logo'
                />
              ) : (
                <div className='w-full h-full bg-gray-200 dark:bg-gray-200/10 rounded-full flex items-center'>
                  <ImagePlus className='w-10 h-10 mx-auto text-gray-500' />
                </div>
              )}
            </div>
          </div>
          <UploadButton<OurFileRouter>
            endpoint='logoUploader'
            className='custom-button'
            content={{
              button({ ready, isUploading }) {
                if (ready) {
                  return 'Upload Logo'
                } else if (isUploading) {
                  return 'Uploading...'
                }

                return 'Getting ready...'
              },
              allowedContent({ ready, fileTypes, isUploading }) {
                if (!ready) return 'Checking what to allow'
                if (isUploading)
                  return (
                    <span className='flex space-x-2 items-center'>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      <span>Uploading...</span>
                    </span>
                  )
                return `Allowed: ${fileTypes.join(', ')}`
              },
            }}
            onClientUploadComplete={(res) => {
              // Do something with the response
              const url = res?.map((data) => data.url)

              if (url && url.length > 0) {
                updateLogoUrl(url[0])
              }
              toast({
                description: 'Image uploaded successfully',
              })
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              toast({
                title: 'Something went wrong',
                description: `${error.message}`,
                variant: 'destructive',
              })
            }}
          />
        </div>
        {/* Product Images Upload */}
        <p className='text-sm font-semibold'>Select Product Images</p>
        <div
          className='p-5 border border-gray-300 dark:border-gray-800 rounded-md flex flex-col justify-center relative'
          {...getRootProps()}
        >
          <input {...getInputProps} className='hidden' />
          <div className='text-center flex flex-col'>
            <UploadCloud className='w-10 h-10 mx-auto text-gray-500' />
            <label htmlFor='file' className='absolute inset-0'>
              <input
                id='file'
                className='hidden'
                type='file'
                multiple
                accept={generateMimeTypes(fileTypes ?? [])?.join(', ')}
                onChange={(e) => updateFiles(e.target.files)}
              />
            </label>
            <p className='text-blue-500 font-semibold text-sm mt-4'>
              Choose files or drag and drop
            </p>
            <small className='mt-2 text-gray-500 text-xs'>Allowed content (img, gif) max: 3</small>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {files.length > 0 &&
              files.map((file) => (
                <div
                  key={file.name}
                  className='relative p-1 w-full h-20 rounded-md border-2 border-gray-200 dark:border-gray-800'
                >
                  <Image
                    className='w-full object-cover rounded-md'
                    fill
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                  />
                </div>
              ))}
          </div>
          {files.length > 0 && (
            <Button
              className='w-fit mx-auto mt-5 relative z-10 mb-2 bg-blue-800 hover:bg-blue-800/80 dark:hover:bg-blue-800'
              type='button'
              disabled={form.getValues('imageUrl').length > 0 || isUploading}
              onClick={() => startUpload(files)}
            >
              {isUploading ? (
                <p className='flex space-x-1 items-center'>
                  <Loader2 className='animate-spin w-4 h-4 ' />
                  <span>Uploading</span>
                </p>
              ) : form.getValues('imageUrl').length > 0 ? (
                'Uploaded'
              ) : (
                <p> Upload {files.length} files</p>
              )}
            </Button>
          )}
        </div>
        <Button
          disabled={isLoading}
          className='w-full'
          size='lg'
          onClick={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <span className='flex space-x-2 items-center'>
              <ButtonLoader />
              Submitting
            </span>
          ) : (
            ' Create Product'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateProductForm

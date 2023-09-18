// Or import from your typed, generated components
import { FileWithPath, UploadDropzone, Uploader } from '@uploadthing/react'

import type { OurFileRouter } from '@/app/api/uploadthing/core'
import { useUploadThing } from '@/lib/uploadthing'
import { Loader2, UploadCloud, UploadIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useCallback, useState } from 'react'
import { useDropzone } from '@uploadthing/react/hooks'
import { generateClientDropzoneAccept, generateMimeTypes } from 'uploadthing/client'
import Image from 'next/image'

export default function UploadImageForm() {
  const [files, setFiles] = useState<File[]>([])
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

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: () => {
      alert('uploaded successfully!')
    },
    onUploadError: (error) => {
      console.log(error)
      setFiles([])
    },
    onUploadBegin: () => {
      alert('upload has begun')
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
        <p className='text-blue-500 font-semibold text-sm mt-4'>Choose files or drag and drop</p>
        <small className='mt-2 text-gray-500 text-xs'>Allowed content (img, gif) max: 3</small>
      </div>
      {files.length > 0 && (
        <Button className='w-fit mx-auto mt-5 relative z-10' onClick={() => startUpload(files)}>
          {isUploading ? (
            <p>
              <Loader2 className='animate-spin w-4 h-4 ' />
              Uploading
            </p>
          ) : (
            <p> Upload {files.length} files</p>
          )}
        </Button>
      )}
      <div className='grid grid-cols-3 gap-2 mt-4'>
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
      {/* <Button className='w-fit mx-auto mt-5'>Ready</Button> */}
    </div>
  )
}

import { getAuthSession } from '@/lib/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const auth = (req: Request) => ({ id: 'fakeId' }) // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 3 } })
    .middleware(async ({ req }) => {
      // const user = await auth(req)

      const session = await getAuthSession()

      if (!session) throw new Error('Unauthorized')

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)

      console.log('file url', file.url)
    }),
  logoUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // const user = await auth(req)

      const session = await getAuthSession()

      if (!session) throw new Error('Unauthorized')

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)

      console.log('file url', file.url)
    }),
  discussionImage: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const user = await auth(req)

      if (!user) throw new Error('Unauthorized')

      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

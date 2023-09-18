import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ProductValidator } from '@/lib/validators/product'
import { z } from 'zod'
import slugify from 'slugify'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) new Response('Unathorized', { status: 401 })

    const body = await req.json()

    const {
      title,
      tagLine,
      description,
      websiteUrl,
      twitterUrl,
      linkedinUrl,
      category,
      imageUrl,
      logoUrl,
    } = ProductValidator.parse(body)

    const productImages = imageUrl.map((url: string) => ({ image: url }))
    // Generate the slug from the title
    const slug = slugify(title, {
      lower: true, // Convert the slug to lowercase
      remove: /[*+~.()'"!:@]/g, // Remove special characters
    })

    await db.product.create({
      data: {
        title,
        tagLine,
        description,
        websiteUrl,
        twitterUrl,
        linkedinUrl,
        category,
        ownerId: session?.user.id ?? '',
        logoUrl,
        slug,
        productImages: {
          create: productImages,
        },
      },
      include: {
        productImages: true, // To include the related product images in the response
      },
    })
    return new Response(slug)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }
    return new Response('Could not submit product at this time, please try again later', {
      status: 500,
    })
  }
}

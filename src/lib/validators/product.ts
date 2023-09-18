import { z } from 'zod'
export const ProductValidator = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be longer than 3 characters' })
    .max(128, { message: 'Title must not be greater than 128 characters' }),
  tagLine: z
    .string()
    .min(3, { message: 'Tagline must be longer than 3 characters' })
    .max(128, { message: 'Tagline must not be greater than 128 characters' }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters.',
    })
    .max(300, {
      message: 'Description must not be longer than 300 characters.',
    }),
  websiteUrl: z.string().url({ message: 'Website url is required' }),
  twitterUrl: z
    .string()
    .regex(/^https:\/\/twitter\.com\/.+/, {
      message: 'Please enter a valid Twitter URL starting with "https://twitter.com/".',
    })
    .optional(),
  linkedinUrl: z
    .string()
    .regex(/^https:\/\/linkedin\.com\/in\/[a-zA-Z0-9-]+/, {
      message: 'Please enter a valid LinkedIn URL starting with "https://linkedin.com/in/".',
    })
    .optional(),
  category: z.string(),
  imageUrl: z.array(z.string()),
  logoUrl: z.string(),
})

export type ProductCreationRequest = z.infer<typeof ProductValidator>

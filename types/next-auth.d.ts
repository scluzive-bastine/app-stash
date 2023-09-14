import NextAuth from 'next-auth'

type UserId = string
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      image: string | null
      name?: string | null
      email?: string | null
      username?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId
    username?: string | null
  }
}

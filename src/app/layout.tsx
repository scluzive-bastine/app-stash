import '@/app/styles/globals.css'
import Providers from '@/components/Providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'appStash',
  description: 'Search for apps and Join communities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

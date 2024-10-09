import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dua Request App',
  description: 'A community-driven platform for sharing and supporting duas',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
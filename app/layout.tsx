import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import './globals.css'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NYAI - AI-Powered Document Intelligence',
  description: 'Transform complex documents into clear insights with AI. Get instant document analysis, smart drafting, and expert consultations all in one platform.',
  keywords: 'AI document analysis, legal tech, document drafting, expert consultation, artificial intelligence',
  openGraph: {
    title: 'NYAI - AI-Powered Document Intelligence',
    description: 'Transform complex documents into clear insights with AI',
    images: ['/images/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: 'dark' }} dynamic={true}>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <main>{children}</main>
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  )
} 
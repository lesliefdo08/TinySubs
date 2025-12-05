import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TinySubs - Frictionless Onchain Micro-Subscriptions',
  description: 'Decentralized micro-subscription platform for creators. Charge tiny recurring payments using blockchain technology.',
  keywords: 'crypto, subscriptions, blockchain, web3, micro-payments, creators',
  authors: [{ name: 'TinySubs' }],
  openGraph: {
    title: 'TinySubs',
    description: 'Frictionless Onchain Micro-Subscriptions for Everything',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>
              {children}
            </main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#FFFFFF',
                  color: '#0C0C0C',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '16px',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </div>
        </Providers>
      </body>
    </html>
  )
}

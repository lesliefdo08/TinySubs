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
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Navbar />
            <main className="relative z-10">
              {children}
            </main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  border: '1px solid #374151',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
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

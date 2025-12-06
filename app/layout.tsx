import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TinySubs - Onchain Micro-Subscriptions for Creators',
  description: 'Launch subscription plans starting at $0.01/month. Built on Base with smart contracts. 2.5% platform fee, instant withdrawals.',
  keywords: 'base, blockchain subscriptions, web3 creator economy, micro-payments, onchain, smart contracts, decentralized subscriptions',
  authors: [{ name: 'Leslie Fernando', url: 'https://github.com/lesliefdo08' }],
  openGraph: {
    title: 'TinySubs - Onchain Micro-Subscriptions',
    description: 'Launch subscription plans starting at $0.01/month on Base blockchain',
    type: 'website',
    siteName: 'TinySubs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TinySubs - Onchain Micro-Subscriptions',
    description: 'Launch subscription plans starting at $0.01/month on Base blockchain',
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

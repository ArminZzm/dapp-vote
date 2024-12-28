import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import '@rainbow-me/rainbowkit/styles.css'
import GlobalStatesContextProvider from '@/context/GlobalStatesContext'
import BlockChainProvider from '@/provider/BlockChainProvider'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { ToastContainer } from 'react-toastify'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Available Polls',
  description: 'A Dapp For Available Polls'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BlockChainProvider>
          <GlobalStatesContextProvider>
            <div className="min-h-[750px] p-10 bg-[url('/bg.jpeg')] bg-no-repeat bg-cover">
              <Header />
              {children}
              <Footer />
            </div>
            <ToastContainer
              position="bottom-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </GlobalStatesContextProvider>
        </BlockChainProvider>
      </body>
    </html>
  )
}

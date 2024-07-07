import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { cookieToInitialState } from 'wagmi'

import { config } from '../../config'
import Web3ModalProvider from '../../context'
import { Header } from '@/components/Header/Header'
import { ThemeContextProvider } from '@/context/ThemeContext'
import ThemeProvider from '@/providers/ThemeProvider'
import ThemeSwitcher from '@/components/themeSwitcher/ThemeSwitcher'
import { Footer } from '@/components/Footer/Footer'

export const metadata: Metadata = {
  title: 'BucksPay',
  description: 'Easy Pay'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider>
          <ThemeProvider>
            <div className='containerMain'>
              <Header />
              <main>
                <Web3ModalProvider initialState={initialState}>{children}</Web3ModalProvider>
              </main>
              <Footer />
              <ThemeSwitcher />
            </div>
          </ThemeProvider>
        </ThemeContextProvider>
      </body>
    </html >
  )
}
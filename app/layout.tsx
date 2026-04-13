import type { Metadata } from 'next'
import { JetBrains_Mono, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  weight: ['300', '400', '500', '700']
});

const syne = Syne({ 
  subsets: ["latin"],
  variable: '--font-sans',
  weight: ['400', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'FTPVault – Secure File Transfer',
  description: 'Upload, manage, and share files with lightning speed and military-grade encryption.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable}`}>
      <body className="font-mono antialiased bg-[#080c14] text-[#e2e8f0]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

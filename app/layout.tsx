import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '30天社媒增长实验 | 30-Day Social Growth Experiment',
  description: '一个公开的30天社交媒体增长实验，展示如何从0起号到500粉丝的完整过程 | A public 30-day social media growth experiment showing the complete process from 0 to 500 followers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
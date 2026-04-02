import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ContentRankLabs — Rank Higher, Write Smarter',
  description: 'Generate SEO-optimized content, meta tags, and keyword strategies powered by AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="bg-mesh min-h-screen min-w-screen text-surface-900 dark:text-surface-50">{children}</body>
    </html>
  )
}

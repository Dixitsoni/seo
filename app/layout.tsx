import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ContentRankLabs — Rank Higher, Write Smarter',
  description: 'Generate SEO-optimized content, meta tags, and keyword strategies powered by AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preload" href="/aFTU7PB1QTsUX8KYthqQBA.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/aFTR7PB1QTsUX8KYvumzEYOtbQ.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/rP2Wp2ywxg089UriCZaSExdy3sGt9zz86D3wyKy58Q.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/rP2Hp2ywxg089UriCZOIHQ.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="bg-mesh min-h-screen min-w-screen text-surface-900 dark:text-surface-50">{children}</body>
    </html>
  )
}

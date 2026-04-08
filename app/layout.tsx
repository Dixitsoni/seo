import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import AutoSEO from '../components/seo/AutoSEO'
import SEOOptimizer from '../components/seo/SEOOptimizer'

const dmMono = localFont({
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  src: [
    { path: './assets/aFTU7PB1QTsUX8KYthqQBA.woff2', weight: '400', style: 'normal' },
    { path: './assets/aFTR7PB1QTsUX8KYvumzEYOtbQ.woff2', weight: '500', style: 'normal' },
  ],
})

const dmSans = localFont({
  variable: '--font-body',
  display: 'swap',
  preload: true,
  src: [
    { path: './assets/rP2Hp2ywxg089UriCZOIHQ.woff2', weight: '400', style: 'normal' },
    { path: './assets/rP2Hp2ywxg089UriCZOIHQ.woff2', weight: '500', style: 'normal' },
    { path: './assets/rP2Hp2ywxg089UriCZOIHQ.woff2', weight: '600', style: 'normal' },
    { path: './assets/rP2Hp2ywxg089UriCZ2IHSeH.woff2', weight: '300', style: 'normal' },
    { path: './assets/rP2Wp2ywxg089UriCZaSExdy3sGt9zz86D3wyKy58Q.woff2', weight: '300', style: 'italic' },
  ],
})

const dmSerif = localFont({
  variable: '--font-display',
  display: 'swap',
  preload: true,
  src: [
    { path: './assets/-nFnOHM81r4j6k0gjAW3mujVU2B2G_Bx0g.woff2', weight: '400', style: 'normal' },
    { path: './assets/-nFhOHM81r4j6k0gjAW3mujVU2B2G_VB0PD2.woff2', weight: '400', style: 'italic' },
  ],
})

export const metadata: Metadata = {
  title: 'ContentRankLabs — Rank Higher, Write Smarter',
  description: 'Generate SEO-optimized content, meta tags, and keyword strategies powered by AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmMono.variable} ${dmSans.variable} ${dmSerif.variable} light`}>
      <body className="bg-mesh min-h-screen min-w-screen text-surface-900 dark:text-surface-50">
        {/* Auto SEO Scripts */}
        <AutoSEO />

        {children}
      </body>
    </html>
  )
}

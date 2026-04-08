'use client'
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, FileText, Search, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      {/* Nav */}
      <nav className="border-b border-surface-800/30 backdrop-blur-sm sticky top-0 z-50 bg-white/50 dark:bg-surface-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg text-white dark:text-surface-50">ContentRankLabs</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/analyze" className="text-sm text-surface-900 dark:text-white hover:text-surface-600 transition-colors">SEO Analyzer</Link>
            <Link href="/dashboard" className="text-sm bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl text-blue-200 leading-[1.05] mb-6 animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            SEO Content That
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500 italic">
              Actually Ranks
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            Generate keyword-optimized articles, meta tags, and content briefs in seconds.
            Built for marketers who care about results, not just words.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5">
              Start Generating Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/analyze" className="inline-flex items-center gap-2 bg-surface-800 hover:bg-surface-700 text-blue-700 px-8 py-4 rounded-xl font-semibold text-base transition-colors border border-surface-700">
              <Search className="w-4 h-4" />
              Analyze a URL
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-3">Everything you need to dominate search</h2>
          <p className="text-blue-300">All the SEO tools, zero the guesswork.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              title: 'Full Article Generation',
              desc: 'H1, H2, body copy, meta title, and meta description — all structured for Google.',
              color: 'text-brand-400',
              bg: 'bg-brand-900/20 border-brand-800/40',
            },
            {
              icon: Search,
              title: 'Keyword Intelligence',
              desc: 'Analyze search intent, cluster keywords, and target the right queries for your audience.',
              color: 'text-violet-400',
              bg: 'bg-violet-900/20 border-violet-800/40',
            },
            {
              icon: TrendingUp,
              title: 'SEO Score & Audit',
              desc: 'Real-time scoring on keyword density, readability, structure, and meta optimization.',
              color: 'text-amber-400',
              bg: 'bg-amber-900/20 border-amber-800/40',
            },
            {
              icon: Zap,
              title: 'Schema Markup Generator',
              desc: 'Auto-generate FAQ, HowTo, and Article JSON-LD schema to boost SERP features.',
              color: 'text-rose-400',
              bg: 'bg-rose-900/20 border-rose-800/40',
            },
            {
              icon: Shield,
              title: 'Content Brief Builder',
              desc: 'Generate detailed outlines before writing — covering topics, subtopics, and angles.',
              color: 'text-sky-400',
              bg: 'bg-sky-900/20 border-sky-800/40',
            },
            {
              icon: Sparkles,
              title: 'Meta Tag Optimizer',
              desc: 'Perfect title and description length, keyword placement, and click-through optimization.',
              color: 'text-emerald-400',
              bg: 'bg-emerald-900/20 border-emerald-800/40',
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => {
            const href = {
              'Full Article Generation': '/dashboard?tool=full-article',
              'Keyword Intelligence': '/dashboard?tool=keyword-intelligence',
              'SEO Score & Audit': '/dashboard?tool=seo-audit',
              'Schema Markup Generator': '/dashboard?tool=schema-markup',
              'Content Brief Builder': '/dashboard?tool=content-brief',
              'Meta Tag Optimizer': '/dashboard?tool=meta-tag',
            }[title] || '/dashboard?tool=full-article'

            return (
              <Link key={title} href={href} className={`block p-6 rounded-2xl border ${bg} hover:scale-[1.02] transition-transform shadow-lg hover:shadow-2xl hover:border-white/40 cursor-pointer`}>
                <div className={`${color} mb-4`}>
                  <Icon className="w-6 h-6"/>
                </div>
                <h3 className="font-semibold text-white dark:text-surface-50 mb-2">{title}</h3>
                <p className={`text-sm ${color} dark:text-surface-300 leading-relaxed`}>{desc}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-brand-900/60 to-brand-800/40 border border-brand-700/40 p-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Ready to rank on page one?</h2>
          <p className="text-white mb-8 text-lg">No credit card. No fluff. Just results.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/25">
            Open the Generator
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      </main>
      {/* Footer */}
      <footer className="border-t border-surface-800/60 py-5 px-6 text-center text-surface-600 text-sm">
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span className="font-display text-white">ContentRankLabs</span>
          </div>
          <div className="text-xs text-white">(formerly SERPPrecision / KeywordVelocity)</div>
        </div>
        <p className='text-white'>Built {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

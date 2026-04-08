'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Sparkles, ArrowLeft, FileText, Search, Copy, Check,
  ChevronDown, ChevronUp, Loader2, AlertCircle, TrendingUp,
  Clock, Hash, Star
} from 'lucide-react'

type SeoData = {
  metaTitle: string
  metaDescription: string
  slug: string
  h1: string
  introduction: string
  sections: Array<{ h2: string; content: string; h3List?: string[] }>
  faqSchema: Array<{ question: string; answer: string }>
  schemaMarkup?: {
    article?: Record<string, unknown>
    faqPage?: Record<string, unknown>
    howTo?: Record<string, unknown>
  }
  contentBrief?: {
    searchIntent?: string
    contentAngle?: string
    targetAudience?: string
    wordCountRange?: string
    outline?: Array<{ h2: string; points?: string[] }>
    internalLinkIdeas?: string[]
    externalSourceIdeas?: string[]
    contentGapsToFill?: string[]
    toneGuidelines?: string[]
  }
  keywordIntelligence?: {
    primaryIntent?: string
    intentBreakdown?: string[]
    keywordClusters?: Array<{ clusterName: string; keywords: string[] }>
    relatedKeywords?: string[]
    longTailKeywords?: string[]
    peopleAlsoAsk?: string[]
    difficultyEstimate?: string
    volumeEstimate?: string
  }
  metaTagOptimizer?: {
    issues?: string[]
    improvedMetaTitle?: string
    improvedMetaDescription?: string
    titleVariants?: string[]
    descriptionVariants?: string[]
  }
  conclusion: string
  keywordDensity: number
  estimatedReadTime: number
  seoScore: number
  seoTips: string[]
}

type FormState = {
  keyword: string
  secondaryKeywords: string
  contentType: string
  wordCount: string
  tone: string
  audience: string
}

const CONTENT_TYPES = ['Blog Article', 'Product Page', 'Landing Page', 'How-To Guide', 'Listicle', 'Pillar Page']
const TONES = ['Professional', 'Conversational', 'Authoritative', 'Friendly', 'Technical', 'Persuasive']
const WORD_COUNTS = ['800', '1200', '1500', '2000', '2500', '3000']

function DashboardClient() {
  const [form, setForm] = useState<FormState>({
    keyword: '',
    secondaryKeywords: '',
    contentType: 'Blog Article',
    wordCount: '1200',
    tone: 'Professional',
    audience: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<SeoData | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<number | null>(0)
  const [activeTab, setActiveTab] = useState<'content' | 'meta' | 'schema' | 'brief' | 'keywords' | 'tips'>('content')

  const searchParams = useSearchParams()
  const selectedTool = searchParams.get('tool') || 'full-article'
  const toolConfig = {
    'full-article': {
      title: 'Content Generator',
      subtitle: 'Fill in your target keyword and preferences, then let AI do the writing.',
    },
    'schema-markup': {
      title: 'Schema Markup Generator',
      subtitle: 'Generate FAQ, HowTo, and Article JSON-LD schema for rich results.',
    },
    'content-brief': {
      title: 'Content Brief Builder',
      subtitle: 'Create SEO-optimized outlines, topic clusters and angles for writing.',
    },
    'meta-tag': {
      title: 'Meta Tag Optimizer',
      subtitle: 'Optimize title and description with keyword intent for CTR lift.',
    },
    'keyword-intelligence': {
      title: 'Keyword Intelligence',
      subtitle: 'Discover intent and long-tail clusters to power your content strategy.',
    },
    'seo-audit': {
      title: 'SEO Score & Audit',
      subtitle: 'Get real-time scoring and recommendations for content optimization.',
    },
  }[selectedTool] || {
    title: 'Content Generator',
    subtitle: 'Fill in your target keyword and preferences, then let AI do the writing.',
  }

  const handleGenerate = async () => {
    if (!form.keyword.trim()) { setError('Please enter a primary keyword.'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Generation failed')
      setResult(json.data)
      setActiveTab('content')
      setExpandedSection(0)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button onClick={() => copyToClipboard(text, id)} className="p-1.5 rounded-lg hover:bg-surface-700 transition-colors text-surface-500 hover:text-surface-300">
      {copied === id ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )

  const scoreColor = (s: number) => s >= 80 ? 'text-brand-400' : s >= 60 ? 'text-amber-400' : 'text-rose-400'
  const scoreBg   = (s: number) => s >= 80 ? 'bg-brand-900/30 border-brand-700/40' : s >= 60 ? 'bg-amber-900/30 border-amber-700/40' : 'bg-rose-900/30 border-rose-700/40'

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-surface-800/60 backdrop-blur-sm sticky top-0 z-50 bg-surface-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-surface-500 hover:text-surface-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display text-base text-surface-50">ContentRankLabs</span>
            </div>
          </div>
          <Link href="/analyze" className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-200 transition-colors">
            <Search className="w-4 h-4" /> SEO Analyzer
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">

          {/* ─── LEFT PANEL: Form ─── */}
          <aside className="space-y-5">
            <div>
              <h1 className="font-display text-2xl text-surface-50 mb-1">{toolConfig.title}</h1>
              <p className="text-sm text-surface-500">{toolConfig.subtitle}</p>
            </div>

            {/* Primary keyword */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Primary Keyword *</label>
              <input
                type="text"
                value={form.keyword}
                onChange={e => setForm(p => ({ ...p, keyword: e.target.value }))}
                placeholder="e.g. best project management software"
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-600 transition-colors text-sm"
              />
            </div>

            {/* Secondary keywords */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Secondary Keywords</label>
              <input
                type="text"
                value={form.secondaryKeywords}
                onChange={e => setForm(p => ({ ...p, secondaryKeywords: e.target.value }))}
                placeholder="task manager, team collaboration, agile tools"
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-600 transition-colors text-sm"
              />
              <p className="text-xs text-surface-600 mt-1">Separate with commas</p>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Content Type</label>
              <div className="grid grid-cols-3 gap-2">
                {CONTENT_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(p => ({ ...p, contentType: t }))}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors border ${
                      form.contentType === t
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-surface-900 border-surface-700 text-surface-400 hover:border-surface-600'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {TONES.map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(p => ({ ...p, tone: t }))}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors border ${
                      form.tone === t
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-surface-900 border-surface-700 text-surface-400 hover:border-surface-600'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Word count */}
            <div>
              {/* <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Target Word Count</label> */}
              <select
                value={form.wordCount}
                onChange={e => setForm(p => ({ ...p, wordCount: e.target.value }))}
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 focus:outline-none focus:border-brand-600 transition-colors text-sm"
              >
                {WORD_COUNTS.map(w => <option key={w} value={w}>{w} words</option>)}
              </select>
            </div>

            {/* Audience */}
            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Target Audience</label>
              <input
                type="text"
                value={form.audience}
                onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
                placeholder="e.g. small business owners, marketing managers"
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-600 transition-colors text-sm"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-rose-900/30 border border-rose-700/50 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:bg-surface-800 disabled:text-surface-600 text-white font-semibold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/20 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating content…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate SEO Content</>
              )}
            </button>
          </aside>

          {/* ─── RIGHT PANEL: Results ─── */}
          <main>
            {!result && !loading && (
              <div className="h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-center mx-auto mb-5 animate-float">
                    <FileText className="w-9 h-9 text-surface-600" />
                  </div>
                  <h2 className="font-display text-xl text-surface-400 mb-2">Your content will appear here</h2>
                  <p className="text-sm text-surface-600 max-w-sm mx-auto">Enter a keyword and click generate to create your SEO-optimized article with meta tags, FAQ schema, and more.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`shimmer rounded-xl h-${i === 0 ? '12' : '20'} bg-surface-800/60`} style={{ height: i === 0 ? 48 : i === 1 ? 32 : 80 }} />
                ))}
              </div>
            )}

            {result && (
              <div className="space-y-5 animate-fade-in">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'SEO Score', value: `${result.seoScore}%`, icon: TrendingUp, color: scoreColor(result.seoScore), bg: scoreBg(result.seoScore) },
                    { label: 'Read Time', value: `${result.estimatedReadTime} min`, icon: Clock, color: 'text-sky-400', bg: 'bg-sky-900/20 border-sky-800/40' },
                    { label: 'Keyword Density', value: `${(result.keywordDensity * 100).toFixed(1)}%`, icon: Hash, color: 'text-violet-400', bg: 'bg-violet-900/20 border-violet-800/40' },
                    { label: 'Sections', value: result.sections.length, icon: Star, color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-800/40' },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className={`p-4 rounded-xl border ${bg} text-center`}>
                      <Icon className={`w-4 h-4 ${color} mx-auto mb-1.5`} />
                      <div className={`text-lg font-bold ${color}`}>{value}</div>
                      <div className="text-xs text-surface-600 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="border-b border-surface-800 flex gap-1 flex-wrap">
                  {(['content', 'meta', 'schema', 'brief', 'keywords', 'tips'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors relative ${
                        activeTab === tab ? 'text-brand-400 tab-active' : 'text-surface-500 hover:text-surface-300'
                      }`}
                    >
                      {tab === 'meta' ? 'Meta Optimizer' : tab === 'schema' ? 'Schema' : tab === 'brief' ? 'Content Brief' : tab === 'keywords' ? 'Keyword Intel' : tab === 'tips' ? 'SEO Tips' : 'Content'}
                    </button>
                  ))}
                </div>

                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-4">
                    {/* H1 */}
                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">H1 Headline</span>
                        <CopyBtn text={result.h1} id="h1" />
                      </div>
                      <p className="font-display text-xl text-surface-100">{result.h1}</p>
                    </div>

                    {/* Introduction */}
                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Introduction</span>
                        <CopyBtn text={result.introduction} id="intro" />
                      </div>
                      <p className="text-sm text-surface-400 leading-relaxed">{result.introduction}</p>
                    </div>

                    {/* Sections */}
                    {result.sections.map((sec, i) => (
                      <div key={i} className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                          className="w-full flex items-center justify-between p-5 hover:bg-surface-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-brand-600 bg-brand-900/30 px-2 py-0.5 rounded">H2</span>
                            <span className="font-semibold text-surface-200 text-sm text-left">{sec.h2}</span>
                          </div>
                          {expandedSection === i ? <ChevronUp className="w-4 h-4 text-surface-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-surface-500 shrink-0" />}
                        </button>
                        {expandedSection === i && (
                          <div className="px-5 pb-5 border-t border-surface-800/60">
                            <div className="flex justify-end pt-3 mb-3">
                              <CopyBtn text={sec.content} id={`sec-${i}`} />
                            </div>
                            <div className="prose-dark">
                              {sec.h3List && sec.h3List.length > 0 && (
                                <ul className="mb-3">
                                  {sec.h3List.map((h3, j) => <li key={j} className="text-xs text-surface-500">▸ {h3}</li>)}
                                </ul>
                              )}
                              {sec.content.split('\n').filter(Boolean).map((para, j) => (
                                <p key={j}>{para}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Conclusion */}
                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Conclusion</span>
                        <CopyBtn text={result.conclusion} id="conclusion" />
                      </div>
                      <p className="text-sm text-surface-400 leading-relaxed">{result.conclusion}</p>
                    </div>
                  </div>
                )}

                {/* Meta Tags Tab */}
                {activeTab === 'meta' && (
                  <div className="space-y-4">
                    {[
                      { label: 'Meta Title', value: result.metaTitle, id: 'meta-title', hint: `${result.metaTitle.length} chars — ideal: 50-60`, ok: result.metaTitle.length >= 50 && result.metaTitle.length <= 60 },
                      { label: 'Meta Description', value: result.metaDescription, id: 'meta-desc', hint: `${result.metaDescription.length} chars — ideal: 150-160`, ok: result.metaDescription.length >= 150 && result.metaDescription.length <= 160 },
                      { label: 'URL Slug', value: result.slug, id: 'slug', hint: 'SEO-friendly URL', ok: true },
                    ].map(({ label, value, id, hint, ok }) => (
                      <div key={id} className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${ok ? 'text-brand-500' : 'text-amber-500'}`}>{hint}</span>
                            <CopyBtn text={value} id={id} />
                          </div>
                        </div>
                        <div className="bg-surface-800/60 rounded-lg p-3 font-mono text-sm text-surface-200 break-all">{value}</div>
                      </div>
                    ))}

                    {result.metaTagOptimizer && (
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Meta Tag Optimizer</span>
                        </div>

                        {result.metaTagOptimizer.issues && result.metaTagOptimizer.issues.length > 0 && (
                          <div>
                            <p className="text-xs text-surface-500 mb-2">Issues</p>
                            <div className="flex flex-wrap gap-2">
                              {result.metaTagOptimizer.issues.map((issue, i) => (
                                <span key={i} className="text-xs bg-surface-800 border border-surface-700 rounded-full px-3 py-1 text-surface-300">{issue}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {(result.metaTagOptimizer.improvedMetaTitle || result.metaTagOptimizer.improvedMetaDescription) && (
                          <div className="space-y-3">
                            {result.metaTagOptimizer.improvedMetaTitle && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-surface-500 uppercase tracking-wider">Improved Title</span>
                                  <CopyBtn text={result.metaTagOptimizer.improvedMetaTitle} id="meta-improved-title" />
                                </div>
                                <div className="bg-surface-800/60 rounded-lg p-3 text-sm text-surface-200">{result.metaTagOptimizer.improvedMetaTitle}</div>
                              </div>
                            )}
                            {result.metaTagOptimizer.improvedMetaDescription && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-surface-500 uppercase tracking-wider">Improved Description</span>
                                  <CopyBtn text={result.metaTagOptimizer.improvedMetaDescription} id="meta-improved-desc" />
                                </div>
                                <div className="bg-surface-800/60 rounded-lg p-3 text-sm text-surface-200">{result.metaTagOptimizer.improvedMetaDescription}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {result.metaTagOptimizer.titleVariants && result.metaTagOptimizer.titleVariants.length > 0 && (
                          <div>
                            <p className="text-xs text-surface-500 mb-2">Title Variants</p>
                            <div className="space-y-2">
                              {result.metaTagOptimizer.titleVariants.map((t, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 bg-surface-800/60 rounded-lg p-3 text-sm text-surface-200">
                                  <span className="flex-1">{t}</span>
                                  <CopyBtn text={t} id={`meta-title-variant-${i}`} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.metaTagOptimizer.descriptionVariants && result.metaTagOptimizer.descriptionVariants.length > 0 && (
                          <div>
                            <p className="text-xs text-surface-500 mb-2">Description Variants</p>
                            <div className="space-y-2">
                              {result.metaTagOptimizer.descriptionVariants.map((d, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 bg-surface-800/60 rounded-lg p-3 text-sm text-surface-200">
                                  <span className="flex-1">{d}</span>
                                  <CopyBtn text={d} id={`meta-desc-variant-${i}`} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Schema Tab */}
                {activeTab === 'schema' && (
                  <div className="space-y-4">
                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Schema Markup (JSON-LD)</span>
                        <CopyBtn
                          text={JSON.stringify({
                            article: result.schemaMarkup?.article || { '@context': 'https://schema.org', '@type': 'Article' },
                            faqPage: result.schemaMarkup?.faqPage || { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: result.faqSchema.map(q => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })) },
                            howTo: result.schemaMarkup?.howTo || { '@context': 'https://schema.org', '@type': 'HowTo' },
                          }, null, 2)}
                          id="schema"
                        />
                      </div>
                      <pre className="text-xs text-brand-300 bg-surface-950 rounded-lg p-4 overflow-x-auto">
                        {JSON.stringify({
                          article: result.schemaMarkup?.article || { '@context': 'https://schema.org', '@type': 'Article' },
                          faqPage: result.schemaMarkup?.faqPage || { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: result.faqSchema.map(q => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })) },
                          howTo: result.schemaMarkup?.howTo || { '@context': 'https://schema.org', '@type': 'HowTo' },
                        }, null, 2)}
                      </pre>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
                        <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">Article</p>
                        <pre className="text-[11px] text-surface-300 bg-surface-950 rounded-lg p-3 overflow-x-auto">
                          {JSON.stringify(result.schemaMarkup?.article || { '@context': 'https://schema.org', '@type': 'Article' }, null, 2)}
                        </pre>
                      </div>
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
                        <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">FAQPage</p>
                        <pre className="text-[11px] text-surface-300 bg-surface-950 rounded-lg p-3 overflow-x-auto">
                          {JSON.stringify(result.schemaMarkup?.faqPage || { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: result.faqSchema.map(q => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })) }, null, 2)}
                        </pre>
                      </div>
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
                        <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">HowTo</p>
                        <pre className="text-[11px] text-surface-300 bg-surface-950 rounded-lg p-3 overflow-x-auto">
                          {JSON.stringify(result.schemaMarkup?.howTo || { '@context': 'https://schema.org', '@type': 'HowTo' }, null, 2)}
                        </pre>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {result.faqSchema.map((faq, i) => (
                        <div key={i} className="bg-surface-900 border border-surface-800 rounded-xl p-4">
                          <p className="text-sm font-semibold text-surface-200 mb-2">Q: {faq.question}</p>
                          <p className="text-sm text-surface-500">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {/* Content Brief Tab */}
                {activeTab === 'brief' && (
                  <div className="space-y-4">
                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Content Brief</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-surface-800/60 rounded-lg p-3">
                          <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Search Intent</p>
                          <p className="text-surface-200">{result.contentBrief?.searchIntent || 'Not provided'}</p>
                        </div>
                        <div className="bg-surface-800/60 rounded-lg p-3">
                          <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Content Angle</p>
                          <p className="text-surface-200">{result.contentBrief?.contentAngle || 'Not provided'}</p>
                        </div>
                        <div className="bg-surface-800/60 rounded-lg p-3">
                          <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Target Audience</p>
                          <p className="text-surface-200">{result.contentBrief?.targetAudience || 'Not provided'}</p>
                        </div>
                        <div className="bg-surface-800/60 rounded-lg p-3">
                          <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Word Count Range</p>
                          <p className="text-surface-200">{result.contentBrief?.wordCountRange || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Outline</h4>
                      <div className="space-y-2">
                        {(result.contentBrief?.outline || []).map((section, i) => (
                          <div key={i} className="bg-surface-800/60 rounded-lg p-3 text-sm text-surface-200">
                            <span className="font-semibold">{section.h2}</span>
                            {section.points && section.points.length > 0 && (
                              <span className="text-surface-400"> - {section.points?.join('; ') || ''}</span>
                            )}
                          </div>
                        ))}
                        {(result.contentBrief?.outline || []).length === 0 && (
                          <p className="text-sm text-surface-500">No outline provided.</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Internal Link Ideas</h4>
                        <div className="flex flex-wrap gap-2">
                          {(result.contentBrief?.internalLinkIdeas || []).map((item, i) => (
                            <span key={i} className="text-xs bg-surface-800 border border-surface-700 rounded-full px-3 py-1 text-surface-300">{item}</span>
                          ))}
                          {(result.contentBrief?.internalLinkIdeas || []).length === 0 && (
                            <span className="text-xs text-surface-500">No ideas provided.</span>
                          )}
                        </div>
                      </div>
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">External Source Ideas</h4>
                        <div className="flex flex-wrap gap-2">
                          {(result.contentBrief?.externalSourceIdeas || []).map((item, i) => (
                            <span key={i} className="text-xs bg-surface-800 border border-surface-700 rounded-full px-3 py-1 text-surface-300">{item}</span>
                          ))}
                          {(result.contentBrief?.externalSourceIdeas || []).length === 0 && (
                            <span className="text-xs text-surface-500">No ideas provided.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Content Gaps To Fill</h4>
                        <div className="flex flex-wrap gap-2">
                          {(result.contentBrief?.contentGapsToFill || []).map((item, i) => (
                            <span key={i} className="text-xs bg-surface-800 border border-surface-700 rounded-full px-3 py-1 text-surface-300">{item}</span>
                          ))}
                          {(result.contentBrief?.contentGapsToFill || []).length === 0 && (
                            <span className="text-xs text-surface-500">No gaps listed.</span>
                          )}
                        </div>
                      </div>
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Tone Guidelines</h4>
                        <div className="flex flex-wrap gap-2">
                          {(result.contentBrief?.toneGuidelines || []).map((item, i) => (
                            <span key={i} className="text-xs bg-surface-800 border border-surface-700 rounded-full px-3 py-1 text-surface-300">{item}</span>
                          ))}
                          {(result.contentBrief?.toneGuidelines || []).length === 0 && (
                            <span className="text-xs text-surface-500">No guidance provided.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Keyword Intelligence Tab */}
                {activeTab === 'keywords' && (
                  <div className="space-y-4">
                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Keyword Intelligence</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-surface-800/60 rounded-lg p-3">
                          <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Primary Intent</p>
                          <p className="text-surface-200">{result.keywordIntelligence?.primaryIntent || 'Not provided'}</p>
                        </div>
                        <div className="bg-surface-800/60 rounded-lg p-3">
                          <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Difficulty / Volume</p>
                          <p className="text-surface-200">{result.keywordIntelligence?.difficultyEstimate || 'Unknown'} / {result.keywordIntelligence?.volumeEstimate || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Intent Breakdown</h4>
                      <div className="flex flex-wrap gap-2">
                        {(result.keywordIntelligence?.intentBreakdown || []).map((item, i) => (
                          <span key={i} className="text-xs bg-surface-800 border border-surface-700 rounded-full px-3 py-1 text-surface-300">{item}</span>
                        ))}
                        {(result.keywordIntelligence?.intentBreakdown || []).length === 0 && (
                          <span className="text-xs text-surface-500">No breakdown provided.</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Keyword Clusters</h4>
                      <div className="space-y-2">
                        {(result.keywordIntelligence?.keywordClusters || []).map((cluster, i) => (
                          <div key={i} className="bg-surface-800/60 rounded-lg p-3 text-sm text-surface-200">
                            <span className="font-semibold">{cluster.clusterName}</span>
                            <span className="text-surface-400"> - {cluster.keywords?.join(', ') || ''}</span>
                          </div>
                        ))}
                        {(result.keywordIntelligence?.keywordClusters || []).length === 0 && (
                          <p className="text-sm text-surface-500">No clusters provided.</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Related Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {(result.keywordIntelligence?.relatedKeywords || []).map((item, i) => (
                            <span key={i} className="text-xs bg-surface-800 border border-surface-700 rounded-full px-3 py-1 text-surface-300">{item}</span>
                          ))}
                          {(result.keywordIntelligence?.relatedKeywords || []).length === 0 && (
                            <span className="text-xs text-surface-500">None provided.</span>
                          )}
                        </div>
                      </div>
                      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Long-Tail Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {(result.keywordIntelligence?.longTailKeywords || []).map((item, i) => (
                            <span key={i} className="text-xs bg-surface-800 border border-surface-700 rounded-full px-3 py-1 text-surface-300">{item}</span>
                          ))}
                          {(result.keywordIntelligence?.longTailKeywords || []).length === 0 && (
                            <span className="text-xs text-surface-500">None provided.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">People Also Ask</h4>
                      <div className="space-y-2">
                        {(result.keywordIntelligence?.peopleAlsoAsk || []).map((q, i) => (
                          <div key={i} className="bg-surface-800/60 rounded-lg p-3 text-sm text-surface-200">{q}</div>
                        ))}
                        {(result.keywordIntelligence?.peopleAlsoAsk || []).length === 0 && (
                          <p className="text-sm text-surface-500">No questions provided.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

{/* Tips Tab */}
                {activeTab === 'tips' && (
                  <div className="space-y-3">
                    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-surface-200 mb-4">AI SEO Recommendations</h3>
                      <ul className="space-y-3">
                        {result.seoTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-brand-900/60 border border-brand-700/40 text-brand-400 text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <span className="text-sm text-surface-400 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-surface-400">Loading dashboard...</div>}>
      <DashboardClient />
    </Suspense>
  )
}

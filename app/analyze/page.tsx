'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Search, Loader2, AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

type Grade = { score: number; label: string; notes: string }
type Issue = { severity: 'high' | 'medium' | 'low'; priority?: 'high' | 'medium' | 'low'; message: string }

type CompetitorComparison = {
  url: string
  overallScore: number
  topStrengths: string
  topWeaknesses: string
}

type AuditHistoryItem = {
  id: string
  createdAt: string
  keyword: string
  url: string
  scanDepth: 'single-page' | 'site' | 'domain'
  result: AnalysisData
}

type AnalysisData = {
  overallScore: number
  grades: {
    keywordUsage: Grade
    metaTags: Grade
    readability: Grade
    structure: Grade
    contentDepth: Grade
  }
  websiteAudit?: {
    technicalSEO: string
    mobileUsability: string
    performance: string
    backlinkAnalysis: string
    canonicalHealth?: string
    robotsStatus?: string
    sitemapStatus?: string
    hreflangStatus?: string
  }
  backlinkSummary?: string
  canonicalUrl?: string
  robotsDirectives?: string
  hreflangTags?: string
  sitemapStatus?: string
  competitorComparison?: CompetitorComparison[]
  issues: Issue[]
  recommendations: string[]
  keywordDensity: number
  wordCount: number
  estimatedReadTime: number
}

export default function AnalyzePage() {
  const [keyword, setKeyword] = useState('')
  const [url, setUrl] = useState('')
  const [scanDepth, setScanDepth] = useState<'single-page' | 'site' | 'domain'>('single-page')
  const [competitorUrls, setCompetitorUrls] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisData | null>(null)
  const [history, setHistory] = useState<AuditHistoryItem[]>([])

  const handleAnalyze = async () => {
    if (!keyword.trim() || (!content.trim() && !url.trim())) { setError('Keyword and either content or URL are required.'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, url, scanDepth, competitorUrls: competitorUrls.split(/\s*,\s*/).filter(Boolean), metaTitle, metaDescription, content }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Analysis failed')
      setResult(json.data)

      const newEntry = {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        keyword,
        url,
        scanDepth,
        result: json.data,
      }
      setHistory(prevHistory => {
        const nextHistory = [newEntry, ...prevHistory].slice(0, 20)
        window.localStorage.setItem('seoAuditHistory', JSON.stringify(nextHistory))
        return nextHistory
      })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const saved = window.localStorage.getItem('seoAuditHistory')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        setHistory([])
      }
    }
  }, [])

  const scoreColor = (s: number) => s >= 80 ? '#14b8a6' : s >= 60 ? '#f59e0b' : '#f43f5e'
  const scoreLabel = (s: number) => s >= 80 ? 'text-brand-400' : s >= 60 ? 'text-amber-400' : 'text-rose-400'
  const scoreBorder = (s: number) => s >= 80 ? 'border-brand-700/40' : s >= 60 ? 'border-amber-700/40' : 'border-rose-700/40'

  const circumference = 2 * Math.PI * 45

  const handleExportPdf = async () => {
    if (!result) return

    try {
      const response = await fetch('/api/audit/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          url,
          scanDepth,
          competitorUrls: competitorUrls.split(/\s*,\s*/).filter(Boolean),
          metaTitle,
          metaDescription,
          result,
        }),
      })
      if (!response.ok) throw new Error('Failed to generate PDF')
      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `seo-audit-${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'PDF export failed')
    }
  }
  const IssueIcon = ({ severity }: { severity: string }) => {
    if (severity === 'high') return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
    if (severity === 'medium') return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
    return <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-surface-800/60 backdrop-blur-sm sticky top-0 z-50 bg-surface-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Go back to dashboard" className="text-surface-500 hover:text-surface-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display text-base text-surface-50">ContentRankLabs</span>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm text-surface-400 hover:text-surface-200 transition-colors">Content Generator →</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-surface-50 mb-2">SEO Content Analyzer</h1>
          <p className="text-surface-500">Paste your content and get a detailed SEO audit with actionable recommendations.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Input */}
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Primary Keyword *</label>
                <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
                  placeholder="e.g. project management software"
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-600 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Page URL</label>
                <input type="text" value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-600 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Meta Description</label>
              <input type="text" value={metaDescription} onChange={e => setMetaDescription(e.target.value)}
                placeholder="Your meta description (150-160 chars)"
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-600 text-sm" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="scan-depth" className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Scan depth</label>
                <select
                  id="scan-depth"
                  value={scanDepth}
                  onChange={e => setScanDepth(e.target.value as 'single-page' | 'site' | 'domain')}
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 focus:outline-none focus:border-brand-600 text-sm"
                >
                  <option value="single-page">Single page</option>
                  <option value="site">Site</option>
                  <option value="domain">Domain</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Competitor URLs</label>
                <input type="text" value={competitorUrls} onChange={e => setCompetitorUrls(e.target.value)}
                  placeholder="https://competitor1.com, https://competitor2.com"
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-600 text-sm" />
                <p className="text-xs text-surface-600 mt-1">Comma-separated list for compare mode</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Content *</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={14}
                placeholder="Paste your article or page content here…"
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-surface-100 placeholder-surface-600 focus:outline-none focus:border-brand-600 text-sm resize-none leading-relaxed"
              />
              <p className="text-xs text-surface-600 mt-1">{content.split(/\s+/).filter(Boolean).length} words</p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-rose-900/30 border border-rose-700/50 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            )}

            <button onClick={handleAnalyze} disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:bg-surface-800 disabled:text-surface-600 text-white font-semibold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/20 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : <><Search className="w-4 h-4" /> Run SEO Audit</>}
            </button>
          </div>

          {/* Results */}
          <aside>
            {!result && !loading && (
              <div className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-surface-900 border border-surface-800 flex items-center justify-center mx-auto mb-4 animate-float">
                    <Search className="w-7 h-7 text-surface-600" />
                  </div>
                  <p className="text-surface-500 text-sm">Your SEO audit results<br />will appear here</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                {[120, 80, 160, 100].map((h, i) => (
                  <div key={i} className="shimmer rounded-xl bg-surface-800/60" style={{ height: h }} />
                ))}
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-fade-in">
                {/* Overall Score Ring */}
                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 text-center">
                  <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#292524" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none"
                      stroke={scoreColor(result.overallScore)} strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (result.overallScore / 100) * circumference}
                      className="score-ring transition-all duration-1000"
                    />
                  </svg>
                  <div className="-mt-20 mb-4">
                    <div className={`text-4xl font-bold ${scoreLabel(result.overallScore)}`}>{result.overallScore}</div>
                    <div className="text-xs text-surface-500 mt-1">Overall SEO Score</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-surface-800">
                    <div><div className="text-sm font-semibold text-surface-200">{result.wordCount}</div><div className="text-xs text-surface-600">Words</div></div>
                    <div><div className="text-sm font-semibold text-surface-200">{(result.keywordDensity).toFixed(1)}%</div><div className="text-xs text-surface-600">Density</div></div>
                    <div><div className="text-sm font-semibold text-surface-200">{result.estimatedReadTime}m</div><div className="text-xs text-surface-600">Read</div></div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={handleExportPdf}
                    className="text-xs bg-surface-800 hover:bg-surface-700 border border-surface-700 text-surface-200 px-3 py-2 rounded-lg transition-colors"
                  >
                    Export Audit PDF
                  </button>
                </div>

                {/* Grades */}
                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Category Breakdown</h3>
                  {Object.entries(result.grades).map(([key, grade]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-surface-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className={`text-xs font-semibold ${scoreLabel(grade.score)}`}>{grade.score}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${grade.score}%`, backgroundColor: scoreColor(grade.score) }} />
                      </div>
                      <p className="text-xs text-surface-600 mt-1">{grade.notes}</p>
                    </div>
                  ))}
                </div>

                {result.websiteAudit && (
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
                    <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Website Audit</h3>
                    <div className="space-y-2 text-xs text-surface-300">
                      <p><span className="font-semibold text-surface-200">Technical SEO:</span> {result.websiteAudit.technicalSEO}</p>
                      <p><span className="font-semibold text-surface-200">Mobile Usability:</span> {result.websiteAudit.mobileUsability}</p>
                      <p><span className="font-semibold text-surface-200">Performance:</span> {result.websiteAudit.performance}</p>
                      <p><span className="font-semibold text-surface-200">Backlinks:</span> {result.websiteAudit.backlinkAnalysis}</p>
                      <p><span className="font-semibold text-surface-200">Canonical Health:</span> {result.websiteAudit.canonicalHealth}</p>
                      <p><span className="font-semibold text-surface-200">Robots Status:</span> {result.websiteAudit.robotsStatus}</p>
                      <p><span className="font-semibold text-surface-200">Sitemap Status:</span> {result.websiteAudit.sitemapStatus}</p>
                      <p><span className="font-semibold text-surface-200">Hreflang Status:</span> {result.websiteAudit.hreflangStatus}</p>
                    </div>
                  </div>
                )}

                {result.canonicalUrl && (
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
                    <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Canonical + Technical URLs</h3>
                    <p className="text-xs text-surface-300"><span className="font-semibold">Canonical URL:</span> {result.canonicalUrl}</p>
                    <p className="text-xs text-surface-300"><span className="font-semibold">Robots directives:</span> {result.robotsDirectives || 'N/A'}</p>
                    <p className="text-xs text-surface-300"><span className="font-semibold">Hreflang tags:</span> {result.hreflangTags || 'N/A'}</p>
                    <p className="text-xs text-surface-300"><span className="font-semibold">Sitemap status:</span> {result.sitemapStatus || 'unknown'}</p>
                  </div>
                )}

                {result.backlinkSummary && (
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
                    <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Backlink Summary</h3>
                    <p className="text-xs text-surface-300">{result.backlinkSummary}</p>
                  </div>
                )}

                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
                  <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Audit History</h3>
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setResult(item.result)
                          setKeyword(item.keyword)
                          setUrl(item.url)
                          setScanDepth(item.scanDepth)
                        }}
                        className="w-full text-left p-2 border border-surface-800 rounded-lg hover:bg-surface-800"
                      >
                        <div className="text-xs text-surface-500">{new Date(item.createdAt).toLocaleString()}</div>
                        <div className="text-sm text-surface-100">{item.keyword || item.url}</div>
                      </button>
                    ))}
                    {history.length === 0 && <p className="text-xs text-surface-500">No audit history yet.</p>}
                  </div>
                </div>

                {result.competitorComparison && result.competitorComparison.length > 0 && (
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
                    <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Competitor Comparison</h3>
                    <ul className="space-y-3 text-xs">
                      {result.competitorComparison?.map((comp, i) => (
                        <li key={i} className="border border-surface-800 rounded-lg p-3">
                          <p className="font-semibold text-surface-200">{comp.url}</p>
                          <p>Score: <span className="font-bold text-surface-100">{comp.overallScore}</span></p>
                          <p><span className="font-semibold">Strengths:</span> {comp.topStrengths}</p>
                          <p><span className="font-semibold">Weaknesses:</span> {comp.topWeaknesses}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {result.issues.length > 0 && (
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
                    <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Issues Found</h3>
                    <ul className="space-y-2">
                      {result.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <IssueIcon severity={issue.severity} />
                          <div>
                            <p className="text-xs text-surface-400 leading-relaxed">{issue.message}</p>
                            {issue.priority && (
                              <p className="text-[11px] text-surface-500 mt-1">Priority: <span className="font-semibold text-surface-200">{issue.priority}</span></p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
                  <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-surface-400 leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

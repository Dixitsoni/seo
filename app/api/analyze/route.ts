import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 3000)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, keyword, metaTitle, metaDescription, url, scanDepth = 'single-page', competitorUrls = [] } = body

    if (!keyword?.trim() || (!content?.trim() && !url?.trim())) {
      return NextResponse.json({ error: 'Keyword and either content or URL are required' }, { status: 400 })
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'GOOGLE_API_KEY is not configured' }, { status: 500 })
    }

    let pageContent = content?.trim() ?? ''
    let pageTitle = metaTitle?.trim() ?? ''
    let pageMetaDescription = metaDescription?.trim() ?? ''
    let targetUrl = url?.trim() ?? ''
    let canonicalUrl = ''
    let robotsDirectives = ''
    let hreflangTags = ''
    let sitemapStatus = 'unknown'
    let fetchedHtml = ''

    if (targetUrl) {
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`
      }
      const fetchRes = await fetch(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (SEO audit bot)' } })
      if (!fetchRes.ok) {
        return NextResponse.json({ error: `Unable to fetch URL (${fetchRes.status})` }, { status: 400 })
      }
      const html = await fetchRes.text()
      fetchedHtml = html
      const titleMatch = /<title>([^<]*)<\/title>/i.exec(html)
      const descMatch = /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i.exec(html)
      const canonicalMatch = /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i.exec(html)
      const robotsMatch = /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i.exec(html)
      const hreflangRe = /<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["'][^>]*>/gi
      const hreflangList: string[] = []
      let hreflangMatch: RegExpExecArray | null
      while ((hreflangMatch = hreflangRe.exec(html)) !== null) {
        hreflangList.push(`${hreflangMatch[1]} -> ${hreflangMatch[2]}`)
      }

      pageTitle = pageTitle || titleMatch?.[1]?.trim() || ''
      pageMetaDescription = pageMetaDescription || descMatch?.[1]?.trim() || ''
      canonicalUrl = canonicalMatch?.[1]?.trim() || ''
      robotsDirectives = robotsMatch?.[1]?.trim() || ''
      hreflangTags = hreflangList.join(', ') || ''

      if (!pageContent) {
        pageContent = extractTextFromHtml(fetchedHtml)
      }

      try {
        const sitemapUrl = new URL('/sitemap.xml', targetUrl).href
        const sitemapRes = await fetch(sitemapUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (SEO audit bot)' } })
        sitemapStatus = sitemapRes.ok ? 'found' : 'missing'
      } catch {
        sitemapStatus = 'missing'
      }
    }

    let backlinkSummary = 'Backlink DR/UR metrics not available. Set AHREFS_API_KEY or SEMRUSH_API_KEY to fetch real metrics.'

    if (process.env.AHREFS_API_KEY && targetUrl) {
      try {
        const ahrefsUrl = new URL('https://apiv2.ahrefs.com')
        ahrefsUrl.searchParams.set('token', process.env.AHREFS_API_KEY)
        ahrefsUrl.searchParams.set('from', 'domain_rating')
        ahrefsUrl.searchParams.set('target', targetUrl)
        ahrefsUrl.searchParams.set('mode', 'domain')

        const ahrefsResp = await fetch(ahrefsUrl.toString())
        if (ahrefsResp.ok) {
          const ahrefsJson = await ahrefsResp.json()
          backlinkSummary = `Ahrefs DR ${ahrefsJson.domain_rating || 'N/A'}, referring domains ${ahrefsJson.referring_domains || 'N/A'}.`
        }
      } catch (err) {
        backlinkSummary = `Ahrefs lookup failed: ${err instanceof Error ? err.message : 'unknown error'}`
      }
    }

    const prompt = `Analyze the following content and URL for a comprehensive website SEO audit. ` +
      `Include on-page optimization, technical issues, mobile UX, performance, and off-page recommendations. ` +
      `Return ONLY valid JSON object with the structure shown.\n\n` +
      `Primary Keyword: "${keyword.trim()}"\n` +
      `URL: "${targetUrl || 'N/A'}"\n` +
      `Canonical URL: "${canonicalUrl || 'Not found'}"\n` +
      `Robots directives: "${robotsDirectives || 'Not set'}"\n` +
      `Hreflang tags: "${hreflangTags || 'None'}"\n` +
      `Sitemap: "${sitemapStatus}"\n` +
      `Scan Depth: "${scanDepth}"\n` +
      `Competitor URLs: "${Array.isArray(competitorUrls) ? competitorUrls.join(', ') : competitorUrls || 'None'}"\n` +
      `Meta Title: "${pageTitle || 'Not provided'}"\n` +
      `Meta Description: "${pageMetaDescription || 'Not provided'}"\n\n` +
      `Content:\n${pageContent || 'N/A'}\n\n` +
      `Return EXACT JSON schema:\n` +
      `{\n` +
      `  "overallScore": 82,\n` +
      `  "grades": {\n` +
      `    "keywordUsage": { "score": 85, "label": "Good", "notes": "Keyword used naturally" },\n` +
      `    "metaTags": { "score": 70, "label": "Needs work", "notes": "Meta info could improve" },\n` +
      `    "readability": { "score": 90, "label": "Excellent", "notes": "Readable and clear" },\n` +
      `    "structure": { "score": 80, "label": "Good", "notes": "Headings are well structured" },\n` +
      `    "contentDepth": { "score": 75, "label": "Good", "notes": "Depth can be expanded" }\n` +
      `  },\n` +
      `  "websiteAudit": {\n` +
      `    "technicalSEO": "Technical audit comments",\n` +
      `    "mobileUsability": "Mobile user experience notes",\n` +
      `    "performance": "Speed and core web vitals suggestions",\n` +
      `    "backlinkAnalysis": "High-level backlink/authority insights"\n` +
      `  },\n` +
      `  "backlinkSummary": "Summary of backlink strength with domain rating (DR/UR) guidance",\n` +
      `  "canonicalUrl": "https://example.com/page",
` +
      `  "robotsDirectives": "index, follow",
` +
      `  "hreflangTags": "en-US -> https://example.com/en-us, fr-FR -> https://example.com/fr-fr",
` +
      `  "sitemapStatus": "found",
` +
      `  "competitorComparison": [\n` +
      `    { "url": "https://competitor1.com", "overallScore": 78, "topStrengths": "Strong internal linking", "topWeaknesses": "Thin content" }\n` +
      `  ],\n` +
      `  "issues": [\n` +
      `    { "severity": "high", "priority": "high", "message": "Issue description 1" },\n` +
      `    { "severity": "medium", "priority": "medium", "message": "Issue description 2" },\n` +
      `    { "severity": "low", "priority": "low", "message": "Issue description 3" }\n` +
      `  ],\n` +
      `  "recommendations": [\n` +
      `    "Actionable item 1",\n` +
      `    "Actionable item 2",\n` +
      `    "Actionable item 3"\n` +
      `  ],\n` +
      `  "keywordDensity": 1.8,\n` +
      `  "wordCount": 1200,\n` +
      `  "estimatedReadTime": 6\n` +
      `}`

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.2 },
    })

    const rawText = response.text ?? ''
    const cleaned = rawText.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json({ success: true, data: parsed })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


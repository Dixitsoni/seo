import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, secondaryKeywords, contentType, wordCount, tone, audience } = body

    if (!keyword) {
      return NextResponse.json({ error: 'Primary keyword is required' }, { status: 400 })
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'GOOGLE_API_KEY is not configured' }, { status: 500 })
    }

    const prompt = `You are an expert SEO strategist and content writer with 10+ years of experience ranking content on Google.\n` +
      `Generate a complete SEO output suite: full article, meta tag optimization, schema markup, keyword intelligence, and content brief.\n` +
      `Always respond with valid JSON only -- no markdown, no backticks, no preamble.\n\n` +
      `Project inputs:\n` +
      `Primary Keyword: "${keyword}"\n` +
      `Secondary Keywords: ${secondaryKeywords || 'none'}\n` +
      `Content Type: ${contentType || 'blog article'}\n` +
      `Target Word Count: ${wordCount || 1200} words\n` +
      `Tone: ${tone || 'professional and informative'}\n` +
      `Target Audience: ${audience || 'general readers interested in this topic'}\n\n` +
      `Return ONLY a valid JSON object with this exact structure:\n` +
      `{\n` +
      `  "metaTitle": "SEO title tag (50-60 characters, includes primary keyword)",\n` +
      `  "metaDescription": "Meta description (150-160 characters, includes CTA and primary keyword)",\n` +
      `  "slug": "url-friendly-slug-for-this-article",\n` +
      `  "h1": "Main article headline",\n` +
      `  "introduction": "Engaging 2-3 sentence introduction paragraph",\n` +
      `  "sections": [\n` +
      `    {\n` +
      `      "h2": "Section heading (include keyword naturally)",\n` +
      `      "content": "Full section body text (3-5 paragraphs)",\n` +
      `      "h3List": ["optional subheading 1", "optional subheading 2"]\n` +
      `    }\n` +
      `  ],\n` +
      `  "faqSchema": [\n` +
      `    { "question": "FAQ question 1?", "answer": "Detailed answer 1." },\n` +
      `    { "question": "FAQ question 2?", "answer": "Detailed answer 2." },\n` +
      `    { "question": "FAQ question 3?", "answer": "Detailed answer 3." }\n` +
      `  ],\n` +
      `  "schemaMarkup": {\n` +
      `    "article": {\n` +
      `      "@context": "https://schema.org",\n` +
      `      "@type": "Article",\n` +
      `      "headline": "Article headline",\n` +
      `      "description": "Short summary",\n` +
      `      "author": { "@type": "Person", "name": "Author Name" },\n` +
      `      "datePublished": "2026-01-01",\n` +
      `      "image": "https://example.com/hero.jpg"\n` +
      `    },\n` +
      `    "faqPage": {\n` +
      `      "@context": "https://schema.org",\n` +
      `      "@type": "FAQPage",\n` +
      `      "mainEntity": [\n` +
      `        { "@type": "Question", "name": "FAQ question 1?", "acceptedAnswer": { "@type": "Answer", "text": "Detailed answer 1." } }\n` +
      `      ]\n` +
      `    },\n` +
      `    "howTo": {\n` +
      `      "@context": "https://schema.org",\n` +
      `      "@type": "HowTo",\n` +
      `      "name": "How-to headline",\n` +
      `      "totalTime": "PT20M",\n` +
      `      "step": [\n` +
      `        { "@type": "HowToStep", "name": "Step 1", "text": "Step details" }\n` +
      `      ]\n` +
      `    }\n` +
      `  },\n` +
      `  "contentBrief": {\n` +
      `    "searchIntent": "Informational / Commercial / Transactional / Navigational",\n` +
      `    "contentAngle": "Unique positioning and POV",\n` +
      `    "targetAudience": "Audience description",\n` +
      `    "wordCountRange": "1000-1400",\n` +
      `    "outline": [\n` +
      `      { "h2": "Outline section", "points": ["point 1", "point 2"] }\n` +
      `    ],\n` +
      `    "internalLinkIdeas": ["Link to related post A", "Link to glossary page B"],\n` +
      `    "externalSourceIdeas": ["Authoritative source 1", "Official data source 2"],\n` +
      `    "contentGapsToFill": ["gap 1", "gap 2"],\n` +
      `    "toneGuidelines": ["tone guidance 1", "tone guidance 2"]\n` +
      `  },\n` +
      `  "keywordIntelligence": {\n` +
      `    "primaryIntent": "Primary intent summary",\n` +
      `    "intentBreakdown": ["intent 1", "intent 2"],\n` +
      `    "keywordClusters": [\n` +
      `      { "clusterName": "Cluster 1", "keywords": ["keyword A", "keyword B"] }\n` +
      `    ],\n` +
      `    "relatedKeywords": ["related 1", "related 2"],\n` +
      `    "longTailKeywords": ["long tail 1", "long tail 2"],\n` +
      `    "peopleAlsoAsk": ["question 1", "question 2"],\n` +
      `    "difficultyEstimate": "Easy / Medium / Hard",\n` +
      `    "volumeEstimate": "Low / Medium / High"\n` +
      `  },\n` +
      `  "metaTagOptimizer": {\n` +
      `    "issues": ["Issue 1", "Issue 2"],\n` +
      `    "improvedMetaTitle": "Improved title suggestion (50-60 chars)",\n` +
      `    "improvedMetaDescription": "Improved description suggestion (150-160 chars)",\n` +
      `    "titleVariants": ["Title variant 1", "Title variant 2"],\n` +
      `    "descriptionVariants": ["Description variant 1", "Description variant 2"]\n` +
      `  },\n` +
      `  "conclusion": "Strong concluding paragraph with CTA",\n` +
      `  "keywordDensity": 0.02,\n` +
      `  "estimatedReadTime": 6,\n` +
      `  "seoScore": 87,\n` +
      `  "seoTips": ["tip 1", "tip 2", "tip 3"]\n` +
      `}`

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.2 },
    })

    const rawText = response.text ?? ''
    const cleaned = rawText.replace(/```json|```/g, '').trim()
    const jsonStart = cleaned.indexOf('{')
    const jsonEnd = cleaned.lastIndexOf('}')
    const jsonSlice = jsonStart >= 0 && jsonEnd >= 0 ? cleaned.slice(jsonStart, jsonEnd + 1) : cleaned
    const parsed = JSON.parse(jsonSlice)

    return NextResponse.json({ success: true, data: parsed })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

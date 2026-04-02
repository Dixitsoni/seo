# 🚀 ContentRankLabs

A full-stack Next.js application that uses Claude AI to generate and analyze SEO-optimized content.

---

## ✨ Features

- **Content Generator** — Generate full articles with H1, H2s, intro, body, conclusion, meta tags, and FAQ schema
- **SEO Analyzer** — Audit existing content with scoring, issue detection, and recommendations
- **Schema Markup** — Auto-generate JSON-LD FAQ schema for SERP features
- **Meta Tag Optimizer** — Title and description with character-count validation
- **Real-time SEO Score** — Keyword density, readability, and structure scoring

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Anthropic Claude (claude-sonnet-4)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API key

Copy the example env file and add your Anthropic API key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your API key at: https://console.anthropic.com

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
seo-ai-generator/
├── app/
│   ├── layout.tsx            # Root layout with fonts & metadata
│   ├── page.tsx              # Landing page
│   ├── globals.css           # Global styles + Tailwind
│   ├── dashboard/
│   │   └── page.tsx          # Content Generator UI
│   ├── analyze/
│   │   └── page.tsx          # SEO Analyzer UI
│   └── api/
│       ├── generate/
│       │   └── route.ts      # POST /api/generate — content generation
│       └── analyze/
│           └── route.ts      # POST /api/analyze — SEO audit
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 🔌 API Endpoints

### `POST /api/generate`

Generate SEO-optimized content.

**Request body:**
```json
{
  "keyword": "best project management software",
  "secondaryKeywords": "task manager, team collaboration",
  "contentType": "Blog Article",
  "wordCount": "1200",
  "tone": "Professional",
  "audience": "small business owners"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "metaTitle": "...",
    "metaDescription": "...",
    "slug": "...",
    "h1": "...",
    "introduction": "...",
    "sections": [...],
    "faqSchema": [...],
    "conclusion": "...",
    "seoScore": 87,
    "keywordDensity": 0.02,
    "estimatedReadTime": 6,
    "seoTips": [...]
  }
}
```

### `POST /api/analyze`

Audit existing content for SEO quality.

**Request body:**
```json
{
  "keyword": "project management software",
  "metaTitle": "Best Project Management Software in 2025",
  "metaDescription": "Compare the top...",
  "content": "Your full article text..."
}
```

---

## 🚢 Deployment

Deploy to Vercel in one click:

1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` in Environment Variables
4. Deploy!

---

## 📄 License

MIT — free to use and modify.

# SEO Components for ContentRankLabs

This directory contains automatic SEO optimization components that run on every page to improve Google ranking and technical SEO.

## Components Overview

### SEOOptimizer.tsx
**Purpose**: Main SEO optimization component that automatically injects schema markup and optimizes meta tags.

**Features**:
- Automatic schema markup injection (JSON-LD)
- Meta tag optimization
- Open Graph and Twitter Card setup
- Technical SEO enhancements
- Keyword optimization

**Usage**:
```tsx
<SEOOptimizer
  title="Page Title"
  description="Page description"
  keywords={["keyword1", "keyword2"]}
  url="https://example.com/page"
  type="article" // or "website"
/>
```

### SEORankingOptimizer.ts
**Purpose**: Utility class for analyzing and optimizing content for better keyword ranking.

**Features**:
- Keyword density analysis
- Competition estimation
- Search volume prediction
- Content optimization suggestions
- SEO score calculation

**Usage**:
```typescript
import SEORankingOptimizer from './SEORankingOptimizer';

const optimizer = new SEORankingOptimizer(content, title, description);
const analysis = optimizer.getSEOAnalysis();
console.log('SEO Score:', analysis.score);
```

### AutoSEO.tsx
**Purpose**: Automatically loads SEO optimization scripts and tracking.

**Features**:
- Loads seo-optimizer.js script
- Web Vitals tracking
- Google Analytics integration
- Performance monitoring

**Usage**:
```tsx
<AutoSEO
  enableOptimizer={true}
  enableSchemaInjection={true}
  enableRankingOptimization={true}
/>
```

## Automatic Optimizations

### Technical SEO
- ✅ Canonical URLs
- ✅ Robots meta tags
- ✅ Security headers
- ✅ Performance optimizations
- ✅ Mobile optimization

### Schema Markup
- ✅ Organization schema
- ✅ Website schema
- ✅ WebPage schema
- ✅ Article schema (when applicable)
- ✅ SoftwareApplication schema
- ✅ Combined schema using @graph

### Ranking Signals
- ✅ Core Web Vitals monitoring
- ✅ User engagement tracking
- ✅ Content freshness signals
- ✅ Mobile-friendliness
- ✅ Page speed optimization

### Keyword Optimization
- ✅ Automatic keyword analysis
- ✅ Density optimization
- ✅ Title optimization
- ✅ Meta description optimization
- ✅ Content structure optimization

## Script: seo-optimizer.js

This client-side script automatically runs on page load and provides:

### Performance Optimizations
- Resource preloading
- DNS prefetching
- Lazy loading implementation
- Critical resource hints

### Security Enhancements
- Content Security Policy
- XSS protection
- Frame options
- Referrer policy

### SEO Monitoring
- Core Web Vitals tracking
- User engagement metrics
- Technical issue detection
- Performance monitoring

## Integration

The SEO system is automatically integrated into the root layout and runs on every page. No additional setup required.

## Monitoring

Check browser console for SEO optimization logs:
- `🚀 ContentRankLabs SEO Optimizer initialized`
- `✅ SEO optimizations applied successfully`
- SEO analysis and recommendations

## Customization

To customize SEO settings for specific pages:

1. Override SEOOptimizer props in page components
2. Modify schema templates in schemas/ directory
3. Update seo-optimizer.js for additional optimizations
4. Configure environment variables for tracking

## Environment Variables

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics ID
NEXT_PUBLIC_BASE_URL=https://seo-57o6.vercel.app  # Base URL for schemas
```

## Testing

Test your SEO implementation:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Search Console](https://search.google.com/search-console)

## Performance Impact

The SEO optimization system is designed to be lightweight:
- Minimal JavaScript execution
- Efficient DOM manipulation
- Cached schema generation
- Lazy-loaded tracking scripts
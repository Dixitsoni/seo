# Schema Markup for ContentRankLabs

This directory contains JSON-LD structured data schemas that can be validated using Google's Rich Results Test and Schema Markup Validator.

## Available Schemas

### Core Schemas
- **organization.json**: Organization schema for ContentRankLabs company information
- **website.json**: WebSite schema for the main website
- **software-application.json**: SoftwareApplication schema for the SEO tool
- **homepage-combined.json**: Combined schema with multiple types for the homepage

### Content Schemas
- **article-template.json**: Template for blog post/article schemas
- **faq-page.json**: FAQPage schema example for generated FAQ content
- **breadcrumb.json**: BreadcrumbList schema for navigation

## How to Use

1. **Copy the JSON-LD code** from the appropriate schema file
2. **Add to your HTML head** section within `<script type="application/ld+json">` tags
3. **Validate using Google's tools**:
   - [Rich Results Test](https://search.google.com/test/rich-results)
   - [Schema Markup Validator](https://validator.schema.org/)

## Implementation Example

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ContentRankLabs",
  "url": "https://seo-57o6.vercel.app",
  // ... rest of schema
}
</script>
```

## Schema Types Supported

- ✅ Organization
- ✅ WebSite
- ✅ SoftwareApplication
- ✅ Article/BlogPosting
- ✅ FAQPage
- ✅ BreadcrumbList
- ✅ WebPage

## Validation Checklist

Before deploying, ensure schemas:
- [ ] Use valid JSON-LD syntax
- [ ] Include required properties for each type
- [ ] Match actual page content
- [ ] Use correct URLs and data
- [ ] Pass Google's validation tools

## Notes

- Update URLs to match your actual domain
- Modify dates and content as needed
- Test all schemas in Google's validation tools
- Monitor rich results in Google Search Console
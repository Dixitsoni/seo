'use client';

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export default function SEOOptimizer({
  title = "ContentRankLabs - AI-Powered SEO Content Generator",
  description = "Generate SEO-optimized content with AI. Create articles, analyze SEO performance, and optimize for search engines with ContentRankLabs.",
  keywords = ["SEO content generator", "AI writing tool", "SEO analyzer", "content marketing", "schema markup"],
  url = "https://seo-57o6.vercel.app",
  image = "https://seo-57o6.vercel.app/og-image.png",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "ContentRankLabs",
  section,
  tags = []
}: SEOProps) {

  useEffect(() => {
    // Automatically optimize technical SEO
    optimizeTechnicalSEO();

    // Inject schema markup
    injectSchemaMarkup({
      title,
      description,
      url,
      image,
      type,
      publishedTime,
      modifiedTime,
      author,
      section,
      tags,
      keywords
    });

    // Implement keyword optimization
    optimizeKeywords(keywords);
  }, [title, description, keywords, url, image, type, publishedTime, modifiedTime, author, section, tags]);

  const optimizeTechnicalSEO = () => {
    // Add technical SEO optimizations
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = url;
    document.head.appendChild(link);

    // Add preload for critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/fonts/main.woff2';
    preloadLink.as = 'font';
    preloadLink.type = 'font/woff2';
    preloadLink.crossOrigin = 'anonymous';
    document.head.appendChild(preloadLink);

    // Add security headers via meta tags
    const securityMeta = document.createElement('meta');
    securityMeta.httpEquiv = 'Content-Security-Policy';
    securityMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
    document.head.appendChild(securityMeta);
  };

  const injectSchemaMarkup = (props: any) => {
    // Remove existing schema scripts
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => script.remove());

    // Inject organization schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ContentRankLabs",
      "url": "https://seo-57o6.vercel.app",
      "logo": "https://seo-57o6.vercel.app/logo.png",
      "description": "AI-powered SEO content generator and analyzer using Claude AI for creating high-quality, SEO-optimized articles and blog posts.",
      "foundingDate": "2024",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "email": "support@contentranklabs.com"
      },
      "sameAs": [
        "https://twitter.com/contentranklabs",
        "https://linkedin.com/company/contentranklabs"
      ],
      "knowsAbout": [
        "SEO Content Generation",
        "AI Writing Tools",
        "Search Engine Optimization",
        "Content Marketing",
        "Schema Markup",
        "Technical SEO"
      ]
    };

    // Inject website schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ContentRankLabs",
      "url": "https://seo-57o6.vercel.app",
      "description": "AI-powered SEO content generator and analyzer for creating high-quality, SEO-optimized articles, blog posts, and marketing content.",
      "publisher": {
        "@type": "Organization",
        "name": "ContentRankLabs"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://seo-57o6.vercel.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "en-US"
    };

    // Inject webpage schema
    const webpageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": props.url,
      "name": props.title,
      "description": props.description,
      "isPartOf": {
        "@type": "WebSite",
        "name": "ContentRankLabs",
        "url": "https://seo-57o6.vercel.app"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": props.image
      },
      "datePublished": props.publishedTime || "2024-01-01",
      "dateModified": props.modifiedTime || new Date().toISOString().split('T')[0]
    };

    // Inject article schema if type is article
    let articleSchema: Record<string, unknown> | null = null;
    if (props.type === 'article') {
      articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": props.title,
        "description": props.description,
        "image": props.image,
        "datePublished": props.publishedTime || "2024-01-01",
        "dateModified": props.modifiedTime || new Date().toISOString().split('T')[0],
        "author": {
          "@type": "Organization",
          "name": props.author,
          "url": "https://seo-57o6.vercel.app"
        },
        "publisher": {
          "@type": "Organization",
          "name": "ContentRankLabs",
          "logo": {
            "@type": "ImageObject",
            "url": "https://seo-57o6.vercel.app/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": props.url
        },
        "articleSection": props.section || "SEO",
        "keywords": props.keywords.join(", "),
        "wordCount": "800",
        "timeRequired": "PT5M",
        "inLanguage": "en-US"
      };
    }

    // Inject software application schema
    const softwareSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ContentRankLabs",
      "description": "AI-powered SEO content generator and analyzer that uses Claude AI to create high-quality, SEO-optimized articles, blog posts, and marketing content with built-in schema markup and real-time SEO scoring.",
      "url": "https://seo-57o6.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free to use SEO content generation and analysis tool"
      },
      "featureList": [
        "AI Content Generation",
        "SEO Analysis and Scoring",
        "Schema Markup Generation",
        "Meta Tag Optimization",
        "Keyword Density Analysis",
        "Readability Scoring",
        "PDF Report Export"
      ],
      "author": {
        "@type": "Organization",
        "name": "ContentRankLabs"
      }
    };

    // Create combined schema using @graph
    const schemas: any[] = [organizationSchema, websiteSchema, webpageSchema, softwareSchema];
    if (articleSchema) schemas.push(articleSchema);

    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": schemas
    };

    // Inject the schema script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(combinedSchema, null, 2);
    document.head.appendChild(script);
  };

  const optimizeKeywords = (keywords: string[]) => {
    // Add keywords to meta tags if not already present
    const existingKeywords = document.querySelector('meta[name="keywords"]');
    if (!existingKeywords) {
      const keywordsMeta = document.createElement('meta');
      keywordsMeta.name = 'keywords';
      keywordsMeta.content = keywords.join(', ');
      document.head.appendChild(keywordsMeta);
    }

    // Optimize title for keywords
    const titleElement = document.querySelector('title');
    if (titleElement && !titleElement.textContent?.includes(keywords[0])) {
      const optimizedTitle = `${keywords[0]} - ${title}`;
      titleElement.textContent = optimizedTitle;
    }

    // Add Open Graph keywords
    const ogKeywords = document.querySelector('meta[property="article:tag"]');
    if (!ogKeywords && tags.length > 0) {
      tags.forEach(tag => {
        const tagMeta = document.createElement('meta');
        tagMeta.setAttribute('property', 'article:tag');
        tagMeta.content = tag;
        document.head.appendChild(tagMeta);
      });
    }
  };

  return null; // This component handles client-side SEO optimizations only
}
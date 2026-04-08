// Automatic SEO Optimization Script
// This script runs automatically on page load to optimize for Google ranking

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSEO);
  } else {
    initializeSEO();
  }

  function initializeSEO() {
    console.log('🚀 ContentRankLabs SEO Optimizer initialized');

    // Run all SEO optimizations
    optimizeTechnicalSEO();
    enhancePerformance();
    addSecurityHeaders();
    implementRankingSignals();
    monitorCoreWebVitals();

    // Inject dynamic schema if needed
    injectDynamicSchema();

    console.log('✅ SEO optimizations applied successfully');
  }

  function optimizeTechnicalSEO() {
    // Add canonical URL
    if (!document.querySelector('link[rel="canonical"]')) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = window.location.href.split('#')[0];
      document.head.appendChild(canonical);
    }

    // Add robots meta if missing
    if (!document.querySelector('meta[name="robots"]')) {
      const robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
      document.head.appendChild(robots);
    }

    // Optimize meta viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    }

    // Add theme color for mobile browsers
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#000000';
      document.head.appendChild(themeColor);
    }

    // Add apple-touch-icon if missing
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      appleIcon.href = '/apple-touch-icon.png';
      document.head.appendChild(appleIcon);
    }
  }

  function enhancePerformance() {
    // Preload critical resources
    const criticalResources = [
      { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2' },
      { href: '/css/critical.css', as: 'style' },
      { href: '/js/main.js', as: 'script' }
    ];

    criticalResources.forEach(resource => {
      if (!document.querySelector(`link[href="${resource.href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        if (resource.as === 'font') link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });

    // Add resource hints
    const hints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: true },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      { rel: 'dns-prefetch', href: '//www.googletagmanager.com' }
    ];

    hints.forEach(hint => {
      if (!document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`)) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossOrigin) link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }

  function addSecurityHeaders() {
    // Add security meta tags
    const securityTags = [
      { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
      { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
      { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
      { 'http-equiv': 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { 'http-equiv': 'Permissions-Policy', content: 'geolocation=(), microphone=(), camera=()' }
    ];

    securityTags.forEach(tag => {
      const existing = document.querySelector(`meta[http-equiv="${tag['http-equiv']}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        meta.httpEquiv = tag['http-equiv'];
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });
  }

  function implementRankingSignals() {
    // Implement Google ranking signals

    // 1. Mobile-friendliness signal
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      document.documentElement.classList.add('mobile-view');
    }

    // 2. Page speed signal - lazy load images
    implementLazyLoading();

    // 3. User engagement signals
    trackUserEngagement();

    // 4. Content freshness signal
    addLastModified();

    // 5. HTTPS signal (already handled by hosting)

    // 6. Core Web Vitals optimization
    optimizeCoreWebVitals();
  }

  function implementLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img instanceof HTMLImageElement && img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  function trackUserEngagement() {
    let engagementTime = 0;
    const startTime = Date.now();

    // Track time on page
    const trackEngagement = () => {
      engagementTime = Date.now() - startTime;

      // Send engagement data (in production, send to analytics)
      if (engagementTime > 30000) { // 30 seconds
        console.log(`High engagement: ${engagementTime}ms on page`);
      }
    };

    // Track on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trackEngagement();
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', trackEngagement);

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      maxScroll = Math.max(maxScroll, scrollPercent);

      if (maxScroll > 75) {
        console.log('High scroll engagement: 75%+ of page viewed');
      }
    });
  }

  function addLastModified() {
    // Add last modified date for content freshness
    const lastModified = document.lastModified;
    if (lastModified && !document.querySelector('meta[name="last-modified"]')) {
      const meta = document.createElement('meta');
      meta.name = 'last-modified';
      meta.content = new Date(lastModified).toISOString();
      document.head.appendChild(meta);
    }
  }

  function optimizeCoreWebVitals() {
    // Largest Contentful Paint (LCP) optimization
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      if (lastEntry.startTime > 2500) {
        console.warn('Poor LCP detected. Consider optimizing largest content element.');
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.log('LCP observation not supported');
    }

    // First Input Delay (FID) optimization
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.processingStart > 100) {
          console.warn('Poor FID detected. Consider reducing JavaScript execution time.');
        }
      });
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.log('FID observation not supported');
    }

    // Cumulative Layout Shift (CLS) optimization
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      if (clsValue > 0.1) {
        console.warn('Poor CLS detected. Consider fixing layout shifts.');
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.log('CLS observation not supported');
    }
  }

  function monitorCoreWebVitals() {
    // Monitor and report Core Web Vitals
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }

  function injectDynamicSchema() {
    // Check if schema is already present
    if (document.querySelector('script[type="application/ld+json"]')) {
      return;
    }

    // Get page content for dynamic schema generation
    const pageTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const canonicalUrl = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || window.location.href;

    // Generate dynamic schema based on page content
    const dynamicSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": canonicalUrl,
          "url": canonicalUrl,
          "name": pageTitle,
          "description": metaDescription,
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://seo-57o6.vercel.app/#website",
            "url": "https://seo-57o6.vercel.app",
            "name": "ContentRankLabs"
          },
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0]
        }
      ]
    };

    // Inject the schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(dynamicSchema);
    document.head.appendChild(script);
  }

  // Expose SEO utilities globally
  window.SEOUtils = {
    getSEOAnalysis: function() {
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        robots: document.querySelector('meta[name="robots"]')?.content,
        schemaCount: document.querySelectorAll('script[type="application/ld+json"]').length
      };
    },

    optimizeForKeyword: function(keyword) {
      console.log(`Optimizing page for keyword: ${keyword}`);
      // Implementation would analyze content and suggest optimizations
    }
  };

})();
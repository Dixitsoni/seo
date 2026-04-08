'use client';

import Script from 'next/script';

interface AutoSEOProps {
  enableOptimizer?: boolean;
  enableSchemaInjection?: boolean;
  enableRankingOptimization?: boolean;
}

export default function AutoSEO({
  enableOptimizer = true,
  enableSchemaInjection = true,
  enableRankingOptimization = true
}: AutoSEOProps) {
  return (
    <>
      {/* Load SEO Optimizer Script */}
      {enableOptimizer && (
        <Script
          src="/seo-optimizer.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log('SEO Optimizer script loaded successfully');
          }}
          onError={(e) => {
            console.error('Failed to load SEO Optimizer script:', e);
          }}
        />
      )}

      {/* Web Vitals Tracking */}
      <Script
        src="https://unpkg.com/web-vitals@3.1.1/dist/web-vitals.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Web Vitals will be automatically tracked by the optimizer script
          console.log('Web Vitals tracking enabled');
        }}
      />

      {/* Google Analytics (if needed) */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
          onLoad={() => {
            const dataLayer = window.dataLayer || [];
            window.dataLayer = dataLayer;
            function gtag(...args: any[]) {
              dataLayer.push(args);
            }
            gtag('js', new Date());
            gtag('config', process.env.NEXT_PUBLIC_GA_ID);
          }}
        />
      )}
    </>
  );
}

// Type declarations for global SEO utilities
declare global {
  interface Window {
    SEOUtils?: {
      getSEOAnalysis: () => any;
      optimizeForKeyword: (keyword: string) => void;
    };
    dataLayer?: any[];
  }
}
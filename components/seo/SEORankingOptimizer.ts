// SEO Keyword Ranking Optimizer
// Automatically analyzes content and optimizes for Google ranking

export interface KeywordData {
  keyword: string;
  density: number;
  prominence: number;
  competition: 'low' | 'medium' | 'high';
  searchVolume: number;
  ranking: number;
}

export interface SEOAnalysis {
  score: number;
  keywords: KeywordData[];
  recommendations: string[];
  technicalIssues: string[];
}

class SEORankingOptimizer {
  private content: string = '';
  private title: string = '';
  private metaDescription: string = '';
  private keywords: string[] = [];

  constructor(content: string, title: string = '', metaDescription: string = '') {
    this.content = content;
    this.title = title;
    this.metaDescription = metaDescription;
    this.analyzeContent();
  }

  private analyzeContent(): void {
    // Extract keywords from content
    this.keywords = this.extractKeywords(this.content);

    // Optimize keyword density
    this.optimizeKeywordDensity();

    // Check title optimization
    this.optimizeTitle();

    // Check meta description
    this.optimizeMetaDescription();
  }

  private extractKeywords(text: string): string[] {
    // Remove stop words and extract meaningful keywords
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));

    // Count word frequency
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Get top keywords
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  private optimizeKeywordDensity(): void {
    const contentLength = this.content.split(' ').length;
    const optimalDensity = 1.5; // 1.5% optimal keyword density

    this.keywords.forEach(keyword => {
      const occurrences = (this.content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
      const density = (occurrences / contentLength) * 100;

      if (density > optimalDensity * 1.5) {
        // Too high density - suggest reducing
        console.log(`Keyword "${keyword}" density too high: ${density.toFixed(2)}%. Consider reducing.`);
      } else if (density < optimalDensity * 0.5) {
        // Too low density - suggest increasing
        console.log(`Keyword "${keyword}" density too low: ${density.toFixed(2)}%. Consider increasing.`);
      }
    });
  }

  private optimizeTitle(): void {
    if (!this.title) return;

    const titleLength = this.title.length;
    const primaryKeyword = this.keywords[0];

    // Check title length (30-60 characters optimal)
    if (titleLength < 30) {
      console.log('Title too short. Consider expanding to 30-60 characters.');
    } else if (titleLength > 60) {
      console.log('Title too long. Consider shortening to 30-60 characters.');
    }

    // Check if primary keyword is in title
    if (!this.title.toLowerCase().includes(primaryKeyword)) {
      console.log(`Consider including primary keyword "${primaryKeyword}" in title.`);
    }

    // Check title position (keyword should be near beginning)
    const keywordPosition = this.title.toLowerCase().indexOf(primaryKeyword);
    if (keywordPosition > 30) {
      console.log('Primary keyword appears too late in title. Consider moving it closer to the beginning.');
    }
  }

  private optimizeMetaDescription(): void {
    if (!this.metaDescription) return;

    const descLength = this.metaDescription.length;
    const primaryKeyword = this.keywords[0];

    // Check description length (120-160 characters optimal)
    if (descLength < 120) {
      console.log('Meta description too short. Consider expanding to 120-160 characters.');
    } else if (descLength > 160) {
      console.log('Meta description too long. Consider shortening to 120-160 characters.');
    }

    // Check if primary keyword is in description
    if (!this.metaDescription.toLowerCase().includes(primaryKeyword)) {
      console.log(`Consider including primary keyword "${primaryKeyword}" in meta description.`);
    }
  }

  public getKeywordAnalysis(): KeywordData[] {
    return this.keywords.map(keyword => {
      const occurrences = (this.content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
      const contentLength = this.content.split(' ').length;
      const density = (occurrences / contentLength) * 100;

      // Calculate prominence (position in content)
      const firstOccurrence = this.content.toLowerCase().indexOf(keyword);
      const prominence = firstOccurrence === -1 ? 0 : Math.max(0, 100 - (firstOccurrence / contentLength) * 100);

      return {
        keyword,
        density: parseFloat(density.toFixed(2)),
        prominence: parseFloat(prominence.toFixed(2)),
        competition: this.estimateCompetition(keyword),
        searchVolume: this.estimateSearchVolume(keyword),
        ranking: this.calculateRankingPotential(density, prominence)
      };
    });
  }

  private estimateCompetition(keyword: string): 'low' | 'medium' | 'high' {
    // Simple competition estimation based on keyword characteristics
    if (keyword.length > 10 || keyword.includes(' ')) {
      return 'low'; // Long-tail keywords have lower competition
    }
    if (keyword.length > 5) {
      return 'medium';
    }
    return 'high'; // Short, generic keywords have high competition
  }

  private estimateSearchVolume(keyword: string): number {
    // Simplified search volume estimation
    // In a real implementation, this would use keyword research APIs
    const baseVolume = 1000;
    const lengthMultiplier = Math.max(0.1, 1 - (keyword.length - 3) * 0.1);
    const competitionMultiplier = keyword.includes(' ') ? 0.5 : 1;

    return Math.round(baseVolume * lengthMultiplier * competitionMultiplier);
  }

  private calculateRankingPotential(density: number, prominence: number): number {
    // Simple ranking calculation based on density and prominence
    const optimalDensity = 1.5;
    const densityScore = Math.max(0, 100 - Math.abs(density - optimalDensity) * 20);
    const prominenceScore = prominence;

    return Math.round((densityScore + prominenceScore) / 2);
  }

  public getSEOAnalysis(): SEOAnalysis {
    const keywords = this.getKeywordAnalysis();
    const recommendations: string[] = [];
    const technicalIssues: string[] = [];

    // Generate recommendations
    keywords.forEach(kw => {
      if (kw.density > 2.5) {
        recommendations.push(`Reduce density of "${kw.keyword}" (currently ${kw.density}%)`);
      } else if (kw.density < 0.5) {
        recommendations.push(`Increase usage of "${kw.keyword}" for better ranking`);
      }

      if (kw.competition === 'high' && kw.searchVolume > 5000) {
        recommendations.push(`Consider targeting long-tail variations of "${kw.keyword}"`);
      }
    });

    // Check technical issues
    if (this.title.length > 60) {
      technicalIssues.push('Title tag too long (>60 characters)');
    }
    if (this.metaDescription.length > 160) {
      technicalIssues.push('Meta description too long (>160 characters)');
    }
    if (!this.title.toLowerCase().includes(this.keywords[0])) {
      technicalIssues.push('Primary keyword not in title');
    }

    // Calculate overall SEO score
    const avgRanking = keywords.reduce((sum, kw) => sum + kw.ranking, 0) / keywords.length;
    const technicalScore = technicalIssues.length === 0 ? 100 : Math.max(0, 100 - technicalIssues.length * 20);
    const score = Math.round((avgRanking + technicalScore) / 2);

    return {
      score,
      keywords,
      recommendations,
      technicalIssues
    };
  }

  public optimizeContent(): string {
    let optimizedContent = this.content;

    // Apply automatic optimizations
    this.keywords.forEach(keyword => {
      // Ensure primary keyword appears in first paragraph
      const firstParagraph = optimizedContent.split('\n\n')[0];
      if (!firstParagraph.toLowerCase().includes(keyword) && keyword === this.keywords[0]) {
        optimizedContent = optimizedContent.replace(firstParagraph, `${firstParagraph} ${keyword}.`);
      }
    });

    return optimizedContent;
  }
}

// Export for use in components
export default SEORankingOptimizer;

// Utility function for automatic SEO optimization
export function optimizePageSEO(content: string, title: string, description: string) {
  const optimizer = new SEORankingOptimizer(content, title, description);
  const analysis = optimizer.getSEOAnalysis();

  // Log optimization suggestions
  console.log('SEO Analysis:', analysis);

  // Apply optimizations
  const optimizedContent = optimizer.optimizeContent();

  return {
    optimizedContent,
    analysis,
    recommendations: analysis.recommendations
  };
}
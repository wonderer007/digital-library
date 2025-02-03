interface TextAnalysis {
  plot?: {
    themes: string[];
    mainEvents: string;
  };
  syntax?: {
    patterns: string[];
    structure: {
      simple: number;
      complex: number;
      compound: number;
    };
  };
  language?: {
    primary: string;
    secondary: string[];
    complexity: string;
    uniqueWords: number;
    averageSentenceLength: number;
  };
  sentiment?: {
    overall: string;
    breakdown: {
      neutral: number;
      negative: number;
      positive: number;
    };
    keyEmotions: string[];
  };
  characters?: Array<{
    name: string;
    mentions: number;
    significance: string;
  }>;
}

export interface Book {
  id: string;
  metadata: BookMetadata;
  content: string;
  created_at: string;
  gutenberg_id: number;
  dateAdded: string;
  text_analysis: TextAnalysis;
}

export interface BookMetadata {
  notes?: string[];
  subjects?: string[];
  author: string;
  title: string;
  readingEase?: number;
  summary?: string;
  language?: string;
  locClass?: string;
  category?: string;
  'ebook-No.'?: string;
  releaseDate?: string;
  mostRecentlyUpdated?: string;
  copyrightStatus?: string;
  downloads?: number;
}

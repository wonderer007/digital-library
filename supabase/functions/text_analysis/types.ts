export type Character = {
  name: string;
  mentions: number;
  significance: string;
};

export type Language = {
  primary: string;
  secondary: string[];
  complexity: string;
  uniqueWords: number;
  averageSentenceLength: number;
};

export type Sentiment = {
  score: number;
  label: string;
};

export type Plot = {
  summary: string;
  keyEvents: string[];
  themes: string[];
};

interface Structure {
  structure: {
    simple: number;
    compound: number;
    complex: number;
  };
  patterns: string[];
}

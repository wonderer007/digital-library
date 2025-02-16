import { Character, Language, Sentiment, Plot, Structure } from './types.ts'

function getMostFrequent(arr: string[]): string {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop()!;
}

function determineOverallSentiment(breakdown: { positive: number; negative: number; neutral: number }): string {
  const { positive, negative, neutral } = breakdown;
  const max = Math.max(positive, negative, neutral);
  
  if (max === neutral) return "Neutral";
  if (max === positive) return "Positive";
  return "Negative";
}

function mergeCharacters(characters: Character[]) {
  const characterMap = new Map();
  
  characters.forEach((character: Character) => {
    if (characterMap.has(character.name)) {
      const existing = characterMap.get(character.name);
      existing.mentions += character.mentions;
    } else {
      characterMap.set(character.name, { 
        ...character,
        mentions: character.mentions
      });
    }
  });
  
  return Array.from(characterMap.values());
}

function aggregateLanguageStats(languages: Language[]) {
  return {
    primary: languages[0].primary,
    secondary: [...new Set(languages.flatMap(data => data.secondary))],
    complexity: getMostFrequent(languages.map(data => data.complexity)),
    uniqueWords: languages.reduce((sum, data) => 
      sum + data.uniqueWords, 0) / 3,
    averageSentenceLength: languages.reduce((sum, data) => 
      sum + data.averageSentenceLength, 0) / 3,
  };
}

function aggregateSentiment(sentiments: Sentiment[]) {  
  const averageBreakdown = sentiments.reduce((acc, data) => ({
    negative: acc.negative + data.breakdown.negative / 3,
    neutral: acc.neutral + data.breakdown.neutral / 3,
    positive: acc.positive + data.breakdown.positive / 3
  }), { negative: 0, neutral: 0, positive: 0 });

  return {
    overall: determineOverallSentiment(averageBreakdown),
    breakdown: averageBreakdown,
    keyEmotions: [...new Set(sentiments.flatMap(data => data.keyEmotions))]
  };
}

function aggregatePlot(plots: Plot[]) {
  return {
    mainEvents: [
      plots[0].mainEvents,
      plots[1].mainEvents,
      plots[2].mainEvents
    ].join(' ... '),
    themes: [...new Set(plots.flatMap(plot => plot.themes))]
  };
}

function aggregateSyntax(structures: Structure[]) {  
  const averageStructure = structures.reduce((acc, data) => ({
    simple: acc.simple + data.structure.simple / 3,
    compound: acc.compound + data.structure.compound / 3,
    complex: acc.complex + data.structure.complex / 3
  }), { simple: 0, compound: 0, complex: 0 });

  return {
    structure: averageStructure,
    patterns: [...new Set(structures.flatMap(data => data.patterns))]
  };
}

export async function analyzeSelectiveText(text: string) {
  const sampleSize = 5000;
  
  const beginning = text.slice(0, sampleSize);
  const middleStart = Math.floor((text.length - sampleSize) / 2);
  const middle = text.slice(middleStart, middleStart + sampleSize);
  const end = text.slice(-sampleSize);

  const beginningAnalysis = await analyzeText(beginning);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const middleAnalysis = await analyzeText(middle);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const endAnalysis = await analyzeText(end);

  const analyses = [beginningAnalysis, middleAnalysis, endAnalysis].map(analysis => 
    JSON.parse(analysis.choices[0].message.content)
  );

  const aggregatedAnalysis = {
    characters: mergeCharacters(analyses.flatMap(analysis => analysis.characters)),
    language: aggregateLanguageStats(analyses.flatMap(analysis => analysis.language)),
    sentiment: aggregateSentiment(analyses.flatMap(analysis => analysis.sentiment)),
    plot: aggregatePlot(analyses.flatMap(analysis => analysis.plot)),
    syntax: aggregateSyntax(analyses.flatMap(analysis => analysis.syntax))
  };

  return aggregatedAnalysis;
} 

async function analyzeText(text: string) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const headers = {
    "Authorization": `Bearer ${Deno.env.get('GROK_API_TOKEN')}`,
    "Content-Type": "application/json"
  };

  const data = {
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are an assistant that analyzes text and provides detailed literary analysis. Your response must be a valid JSON object matching the following schema: " + 
          JSON.stringify({
            type: "json_object",
            properties: {
              characters: {
                type: "array",
                items: {
                  type: "json_object",
                  properties: {
                    name: { type: "text" },
                    mentions: { type: "number" },
                    significance: { type: "text" }
                  }
                }
              },
              language: {
                type: "json_object",
                properties: {
                  primary: { type: "text" },
                  secondary: { 
                    type: "array",
                    items: { type: "text" }
                  },
                  complexity: { 
                    type: "text",
                    enum: ["Basic", "Intermediate", "Advanced"]
                  },
                  uniqueWords: { type: "number" },
                  averageSentenceLength: { type: "number" }
                },
                required: ["primary", "secondary", "complexity", "uniqueWords", "averageSentenceLength"]
              },
              sentiment: {
                type: "json_object",
                properties: {
                  overall: { 
                    type: "text",
                    enum: ["Positive", "Negative", "Neutral"]
                  },
                  breakdown: {
                    type: "json_object",
                    properties: {
                      negative: { type: "number", minimum: 0, maximum: 100 },
                      neutral: { type: "number", minimum: 0, maximum: 100 },
                      positive: { type: "number", minimum: 0, maximum: 100 }
                    },
                    required: ["negative", "neutral", "positive"]
                  },
                  keyEmotions: {
                    type: "array",
                    items: { type: "text" }
                  }
                },
                required: ["overall", "breakdown", "keyEmotions"]
              },
              plot: {
                type: "json_object",
                properties: {
                  mainEvents: { type: "text" },
                  themes: {
                    type: "array",
                    items: { type: "text" }
                  }
                },
                required: ["mainEvents", "themes"]
              },
              syntax: {
                type: "json_object",
                properties: {
                  structure: {
                    type: "json_object",
                    properties: {
                      simple: { type: "number", minimum: 0, maximum: 100 },
                      compound: { type: "number", minimum: 0, maximum: 100 },
                      complex: { type: "number", minimum: 0, maximum: 100 }
                    },
                    required: ["simple", "compound", "complex"]
                  },
                  patterns: {
                    type: "array",
                    items: { type: "text" }
                  }
                },
                required: ["structure", "patterns"]
              }
            }
          })
      },
      {
        role: "user",
        content: `Analyze the following text:\n\n${text}`
      }
    ],
    temperature: 0.5,
    response_format: { 
      type: "json_object"
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

async function fetchBookContent(book_id: number) {
  const url = `https://www.gutenberg.org/files/${book_id}/${book_id}-0.txt`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SupabaseFunction/1.0)" }
    });

    if (!response.ok) throw new Error(`Failed to fetch book. Status: ${response.status}`);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/plain")) {
      throw new Error(`Unexpected content type: ${contentType}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error("Fetch error:", error.message);
    return null;
  }
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
        content: `you are a helpful assistant. You must return only valid JSON with these strict requirements:
                 1. All keys must be in double quotes
                 2. All string values must be in double quotes
                 3. No extra newlines or formatting
                 4. No markdown or code blocks
                 5. Must be parseable by JSON.parse()`
      },
      {
        role: "user",
        content: `Analyze the following text and provide a structured response matching this exact format:

                 {
                   "characters": [
                     {
                       "name": string,           // character name
                       "mentions": number,       // number of mentions in text
                       "significance": string    // 'Protagonist', 'Antagonist', or 'Supporting Character'
                     }
                   ],
                   "language": {
                     "primary": string,         // format: 'Language (confidence%)'
                     "secondary": string[],     // array of other detected languages
                     "complexity": string,      // 'Basic', 'Intermediate', or 'Advanced'
                     "uniqueWords": number,     // count of unique words
                     "averageSentenceLength": number  // average words per sentence
                   },
                   "sentiment": {
                     "overall": string,         // 'Positive', 'Negative', or 'Neutral'
                     "breakdown": {
                       "negative": number,      // percentage (0-100)
                       "neutral": number,       // percentage (0-100)
                       "positive": number       // percentage (0-100)
                     },
                     "keyEmotions": string[]   // array of primary emotions detected
                   },
                   "plot": {
                     "mainEvents": string,     // brief summary of main events
                     "themes": string[]        // array of main themes
                   },
                   "syntax": {
                     "structure": {
                       "simple": number,       // percentage (0-100)
                       "compound": number,     // percentage (0-100)
                       "complex": number       // percentage (0-100)
                     },
                     "patterns": string[]      // array of common patterns found
                   }
                 }

                 Text:
                 ${text}`
      }
    ],
    temperature: 0.5
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

Deno.serve(async (req) => {
  try {
    const { record } = await req.json(); 
    if (!record || !record.gutenberg_id) throw new Error('Invalid request data');
    const text = await fetchBookContent(record.gutenberg_id);
    if (!text) throw new Error('Could not fetch book content');
    console.log("Text Size: ", text.length)
    const truncatedText = text.slice(0, 5000);
    const response = await analyzeText(truncatedText);
    console.log("Grok Response: ", response);
    const text_analysis = JSON.parse(response.choices[0].message.content);
    

    const { error } = await supabase
      .from("books")
      .update({ text_analysis })
      .eq("gutenberg_id", record.gutenberg_id);

    if (error) throw new Error(`Error updating book: ${error.message}`);
    
    return new Response(
      JSON.stringify(text_analysis),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
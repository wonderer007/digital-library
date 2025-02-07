import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { analyzeSelectiveText } from './textAnalyzer.ts'

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

Deno.serve(async (req) => {
  try {
    const { record } = await req.json();
    if (!record || !record.gutenberg_id) throw new Error('Invalid request data');

    const text = await fetchBookContent(record.gutenberg_id);
    if (!text) throw new Error('Could not fetch book content');

    const text_analysis = await analyzeSelectiveText(text);
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
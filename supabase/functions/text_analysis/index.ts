import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { analyzeSelectiveText } from './textAnalyzer.ts'
import { fetchBookContentFromURL } from '../_shared/bookFetcher.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  try {
    const { record } = await req.json();
    if (!record || !record.gutenberg_id) throw new Error('Invalid request data');

    const { data: bookData } = await supabase
      .from("books")
      .select("content")
      .eq("gutenberg_id", record.gutenberg_id)
      .single();

    const text = bookData?.content || await fetchBookContentFromURL(record.gutenberg_id);
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
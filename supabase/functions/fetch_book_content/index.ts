import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { fetchBookContentFromURL } from '../_shared/bookFetcher.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  try {
    const { record } = await req.json();
    if (!record || !record.gutenberg_id) throw new Error('Invalid request data');

    const content = await fetchBookContentFromURL(record.gutenberg_id);
    const { error } = await supabase
      .from("books")
      .update({ content })
      .eq("gutenberg_id", record.gutenberg_id);

    if (error) throw new Error(`Error updating book: ${error.message}`);

    return new Response(JSON.stringify({ success: true, book_id }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
});
